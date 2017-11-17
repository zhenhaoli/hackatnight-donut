import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
    Config as AWSConfig, CognitoIdentityCredentials
}
    from 'aws-sdk/global';
import * as LexRuntime from 'aws-sdk/clients/lexruntime';
import * as S3 from 'aws-sdk/clients/s3';
import * as Polly from 'aws-sdk/clients/polly';
import {LexClient} from "../../shared/LexClient";

declare const navigator: any;
declare const MediaRecorder: any;

export class Message {

    constructor(text: string, sender: string, time: Date, audio?: HTMLAudioElement) {
        this.text = text;
        this.sender = sender;
        this.time = time;
        this.audio = audio;
    }

    text: string;
    sender: string;
    time: Date;
    audio?: HTMLAudioElement;
}

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    // input
    public textInput: string = "";
    public isRecording: boolean = false;
    private mediaRecorder: any;
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
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.onstop = (e) => {
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

            this.mediaRecorder.ondataavailable = (e) => this.chunks.push(e.data);
        };

        navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getUserMedia({audio: true}, onSuccess, (e) => console.log(e));
    }

    public startRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.isRecording = true;
            this.mediaRecorder.start();
        }
    }

    public stopRecording() {
        // stop
        this.isRecording = false;
        this.mediaRecorder.stop();
    }

    public takePicture() {
        // take pic
    }

    public sendText() {
        this.messages.push(new Message(this.textInput, 'client', new Date()));
        this.lexClient.postText(this.textInput).then((res) => {
            this.messages.push(new Message(res.message, 'server', new Date()));
        });
        this.textInput = '';
    }

}
