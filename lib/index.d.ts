export default class Metrics {
    clientID: string;
    options: MetricsOptions;
    title: string;
    trackingID: string;
    constructor(trackingID: string, options?: MetricsOptions);
    listen(): void;
    mute(): void;
    event(payload: GoogleEvent): void;
    private handler;
    private commandListener;
    private sendEvent;
    private defaultParams;
    private getCommands;
    private getMacAddress;
    private getClientID;
    private getPackageName;
}
