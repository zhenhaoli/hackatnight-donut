import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
    Config as AWSConfig, CognitoIdentityCredentials
} from 'aws-sdk/global';
import * as LexRuntime from 'aws-sdk/clients/lexruntime';
import * as Rekognition from 'aws-sdk/clients/rekognition';
import {LexClient} from "../../shared/LexClient";
import {Message} from "../../shared/types";
import {DetectFacesRequest} from "aws-sdk/clients/rekognition";

declare const navigator: any;
declare const MediaRecorder: any;

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    // input
    public textInput: string = "";
    public isRecording: boolean = false;
    private audioStream: any; // usermedia stream
    private videoStream: any; // usermedia stream
    private video: any; // video html element
    private chunks: any = [];

    // aws
    private lexClient: LexClient;
    private rekognitionClient: Rekognition;

    // message history
    public messages: Message[] = [];

    constructor(private cdf: ChangeDetectorRef) {
        // AWS SETUP
        this.setupAwsLex();

        // AUDIO RECORDER SETUP
        this.setupAudioRecorder();

        // VIDEO RECORDER SETUP
        this.setupVideoRecorder();
    }

    ngOnInit() {
    }

    private setupAwsLex() {
        const poolId = 'us-east-1:d1c2cef8-114c-4a99-b569-e7d63dbb9955';
        const region = 'us-east-1';
        const credentials = new CognitoIdentityCredentials(
            {IdentityPoolId: poolId},
            {region},
        );
        const awsConfig = new AWSConfig({region, credentials});
        const lexRuntimeClient = new LexRuntime(awsConfig);
        this.rekognitionClient = new Rekognition(awsConfig);

        this.lexClient = new LexClient({
            botName: "Donut",
            botAlias: "$LATEST",
            userId: null,
            lexRuntimeClient: lexRuntimeClient
        });
    }

    private setupAudioRecorder() {
        const onSuccess = (stream) => {
            this.audioStream = new MediaRecorder(stream);
            this.audioStream.onstart = (e) => {
                this.chunks = [];
            };
            this.audioStream.onstop = (e) => {
                const audio = new Audio();
                const blob = new Blob(this.chunks, {'type': 'audio/x-l16'});
                this.chunks.length = 0;

                // create array buffer from blob
                let reader = new FileReader();
                reader.onload = () => {
                    let ctx = new AudioContext();
                    ctx.decodeAudioData(reader.result).then((buffer) => {
                        this.reSample(buffer, 16000, (newBuffer) => {
                            let arrayBuffer = this.convertFloat32ToInt16(newBuffer.getChannelData(0));
                            this.lexClient.postContent(arrayBuffer).then((res) => {
                                const uInt8Array = new Uint8Array(res.audioStream);
                                const arrayBuffer = uInt8Array.buffer;
                                const blob = new Blob([arrayBuffer]);
                                const url = URL.createObjectURL(blob);
                                let audioElement = new Audio();
                                audioElement.src = url;
                                audioElement.play();
                                this.messages.push(new Message(res.message, 'server', new Date(), audioElement));
                                this.cdf.detectChanges();
                            });
                        });
                    });
                };
                reader.readAsArrayBuffer(blob);

                // store audio in messages
                audio.src = window.URL.createObjectURL(blob);
                audio.load();
                this.messages.push(new Message('', 'client', new Date(), audio));
                this.cdf.detectChanges();
            };

            this.audioStream.ondataavailable = (e) => this.chunks.push(e.data);
        };

        // check for browser type
        navigator.mediaDevices.getUserMedia = (navigator.mediaDevices.getUserMedia ||
            navigator.mediaDevices.webkitGetUserMedia ||
            navigator.mediaDevices.mozGetUserMedia ||
            navigator.mediaDevices.msGetUserMedia);

        // request user permission
        navigator.mediaDevices.getUserMedia({audio: true})
            .then(onSuccess)
            .catch((e) => console.log(e));

    }

    private setupVideoRecorder() {
        const onSuccess = (stream) => {
            this.videoStream = new MediaStream(stream);
            this.video = document.querySelector('video');
            this.video.srcObject = this.videoStream;
            this.video.onloadedmetadata = (e) => {
                this.video.play();
            };
        };

        // check for browser type
        navigator.mediaDevices.getUserMedia = (navigator.mediaDevices.getUserMedia ||
            navigator.mediaDevices.webkitGetUserMedia ||
            navigator.mediaDevices.mozGetUserMedia ||
            navigator.mediaDevices.msGetUserMedia);

        // request user permission
        navigator.mediaDevices.getUserMedia({video: true})
            .then(onSuccess)
            .catch((e) => console.log(e));

    }

    public startRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.isRecording = true;
            this.audioStream.start();
        }
    }

    public stopRecording() {
        this.isRecording = false;
        this.audioStream.stop();
    }

    public takePicture() {
        if (this.videoStream) {
            let canvas: HTMLCanvasElement = document.querySelector('canvas');
            canvas
                .getContext("2d")
                .drawImage(this.video, 0, 0, 450, 450, 0, 0, 450, 450);
            let base64Image = canvas.toDataURL('image/jpeg').replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
            let imageBytes = this.getBinary(base64Image);
            let detectFacesRequest: DetectFacesRequest = {Image: {Bytes: imageBytes}, Attributes: ["ALL"]};
            this.messages.push({
                text: '',
                time: new Date(),
                sender: 'client',
                audio: null,
                imgSrc: canvas.toDataURL('image/jpeg')
            });
            this.rekognitionClient.detectFaces(detectFacesRequest, (err, data) => {
                if (!err) {
                    this.messages.push({
                        text: '',
                        time: new Date(),
                        sender: 'server',
                        audio: null,
                        imgSrc: null,
                        emotions: data.FaceDetails[0].Emotions
                    });
                }
            });
        }
    }

    public sendText() {
        this.messages.push(new Message(this.textInput, 'client', new Date()));
        this.lexClient.postText(this.textInput).then((res) => {
            this.messages.push(new Message(res.message, 'server', new Date()));
        });
        this.textInput = '';
    }

    // UTIL
    private getBinary(base64Image) {
        let binaryImg = atob(base64Image);
        let length = binaryImg.length;
        let ab = new ArrayBuffer(length);
        let ua = new Uint8Array(ab);
        for (let i = 0; i < length; i++) {
            ua[i] = binaryImg.charCodeAt(i);
        }
        return ab;
    }

    private reSample(audioBuffer, targetSampleRate, onComplete) {
        let channel = audioBuffer.numberOfChannels;
        let samples = audioBuffer.length * targetSampleRate / audioBuffer.sampleRate;

        let offlineContext = new OfflineAudioContext(channel, samples, targetSampleRate);
        let bufferSource = offlineContext.createBufferSource();
        bufferSource.buffer = audioBuffer;

        bufferSource.connect(offlineContext.destination);
        bufferSource.start(0);

        offlineContext.startRendering().then(function (renderedBuffer) {
            onComplete(renderedBuffer);
        })
    }

    private convertFloat32ToInt16(buffer) {
        let l = buffer.length;
        let buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
        }
        return buf.buffer;
    }

}
