import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
    Config as AWSConfig, CognitoIdentityCredentials
} from 'aws-sdk/global';
import * as LexRuntime from 'aws-sdk/clients/lexruntime';
import * as Rekognition from 'aws-sdk/clients/rekognition';
import * as S3 from 'aws-sdk/clients/s3';
import * as Polly from 'aws-sdk/clients/polly';
import {LexClient} from "../../shared/LexClient";
import {Message} from "../../shared/types";

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

    // aws lex
    private lexClient: LexClient;

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
        const pollyClient = new Polly(awsConfig);

        this.lexClient = new LexClient({
            botName: "Joshua",
            botAlias: "$LATEST",
            userId: null,
            lexRuntimeClient: lexRuntimeClient
        });
    }

    private setupAudioRecorder() {
        const onSuccess = (stream) => {
            this.audioStream = new MediaRecorder(stream);
            this.audioStream.onstop = (e) => {
                const audio = new Audio();
                const blob = new Blob(this.chunks, {'type': 'audio/wav; codecs=opus'});
                this.chunks.length = 0;
                audio.src = window.URL.createObjectURL(blob);
                audio.load();
                this.messages.push(new Message('', 'client', new Date(), audio));
                this.cdf.detectChanges();
                this.lexClient.postContent(blob).then((res) => {
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
        if(this.videoStream) {
            let canvas: any = document.querySelector('canvas');
            canvas
                .getContext("2d")
                .drawImage(this.video, 0, 0, 300, 300, 0, 0, 300, 300);
            let img = canvas.toDataURL('image/png');
            console.log(img);
            // let image = new Image();
            // image.src = img;
            // POST image to AWS rekognition
        }
    }

    public sendText() {
        this.messages.push(new Message(this.textInput, 'client', new Date()));
        this.lexClient.postText(this.textInput).then((res) => {
            this.messages.push(new Message(res.message, 'server', new Date()));
        });
        this.textInput = '';
    }

}
