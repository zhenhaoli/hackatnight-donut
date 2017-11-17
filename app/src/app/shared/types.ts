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
