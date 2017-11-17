import {Emotion} from "aws-sdk/clients/rekognition";

export class Message {

    constructor(text: string, sender: string, time: Date, audio?: HTMLAudioElement, imgSrc?: string, emotions?: string[] | Emotion[]) {
        this.text = text;
        this.sender = sender;
        this.time = time;
        this.audio = audio;
        this.imgSrc = imgSrc;
        this.emotions = emotions;
    }

    text: string;
    sender: string;
    time: Date;
    audio?: HTMLAudioElement;
    imgSrc?: string;
    emotions?: Emotion[] | string[];
}
