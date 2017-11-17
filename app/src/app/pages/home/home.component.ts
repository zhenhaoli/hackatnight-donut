import {Component, OnInit} from '@angular/core';
import { Config as AWSConfig, CognitoIdentityCredentials }
    from 'aws-sdk/global';
import * as LexRuntime from 'aws-sdk/clients/lexruntime';
import * as S3 from 'aws-sdk/clients/s3';
import * as Polly from 'aws-sdk/clients/polly';
import {LexClient} from "../../shared/LexClient";

declare const navigator: any;
declare const MediaRecorder: any;


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: []
})
export class HomeComponent implements OnInit {
    public isRecording: boolean = false;
    public textInput: string = "";

    private chunks: any = [];
    private mediaRecorder: any;
    private lexClient: LexClient;

    constructor() {
        // AWS SETUP
        const poolId = 'us-east-1:d1c2cef8-114c-4a99-b569-e7d63dbb9955';
        const region = 'us-east-1';
        const credentials = new CognitoIdentityCredentials(
            { IdentityPoolId: poolId },
            { region },
        );
        const awsConfig = new AWSConfig({ region, credentials });
        const lexRuntimeClient = new LexRuntime(awsConfig);
        const pollyClient = new Polly(awsConfig);

        this.lexClient = new LexClient({
            botName: "Joshua",
            botAlias: "$LATEST",
            userId: null,
            lexRuntimeClient: lexRuntimeClient
        });

        // AUDIO RECORDER SETUP
        const onSuccess = stream => {
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.onstop = (e) => {
                const audio = new Audio();
                const blob = new Blob(this.chunks, {'type': 'audio/wav; codecs=opus'});
                this.chunks.length = 0;
                audio.src = window.URL.createObjectURL(blob);
                audio.load();
                this.lexClient.postContent(blob).then((res) => {
                    console.log(res);
                    let uInt8Array = new Uint8Array(res.audioStream);
                    let arrayBuffer = uInt8Array.buffer;
                    let blob = new Blob([arrayBuffer]);
                    let url = URL.createObjectURL(blob);
                    let audioElement = new Audio();
                    audioElement.src = url;
                    audioElement.play();
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

    ngOnInit() {
    }

    public startRecording() {
        this.isRecording = true;
        this.mediaRecorder.start();
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
        this.lexClient.postText(this.textInput).then((res) => {
            console.log(res);
        });
    }

}
