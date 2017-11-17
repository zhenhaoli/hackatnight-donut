export class LexClient {
    public botName: string;
    public botAlias: string;
    public userId: string;
    public lexRuntimeClient: any;
    public credentials: any;

    constructor({
                    botName,
                    botAlias = '$LATEST',
                    userId,
                    lexRuntimeClient,
                }) {
        if (!botName || !lexRuntimeClient) {
            throw new Error('invalid lex client constructor arguments');
        }

        this.botName = botName;
        this.botAlias = botAlias;
        this.userId = userId ||
            'bmw-car-ui-' +
            `${Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)}`;

        this.lexRuntimeClient = lexRuntimeClient;
        this.credentials = this.lexRuntimeClient.config.credentials;
    }

    initCredentials(credentials) {
        this.credentials = credentials;
        this.lexRuntimeClient.config.credentials = this.credentials;
        this.userId = (credentials.identityId) ?
            credentials.identityId :
            this.userId;
    }

    postText(inputText, sessionAttributes = {}) {
        const postTextReq = this.lexRuntimeClient.postText({
            botAlias: this.botAlias,
            botName: this.botName,
            userId: this.userId,
            inputText,
            sessionAttributes,
        });
        return this.credentials.getPromise()
            .then(creds => creds && this.initCredentials(creds))
            .then(() => postTextReq.promise());
    }

    postContent(blob,
                sessionAttributes = {},
                acceptFormat = 'audio/ogg') {
        const postContentReq = this.lexRuntimeClient.postContent({
            accept: acceptFormat,
            botAlias: this.botAlias,
            botName: this.botName,
            userId: this.userId,
            contentType: 'audio/x-l16; sample-rate=16000; channel-count=1',
            inputStream: blob,
            sessionAttributes,
        });

        return this.credentials.getPromise()
            .then(creds => creds && this.initCredentials(creds))
            .then(() => postContentReq.promise());
    }

    // HELPER METHODS TO PREPARE AUDIO DATA
}
