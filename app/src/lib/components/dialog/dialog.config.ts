export class DialogConfig {
    title: string = "";
    content: string = "";
    confirmLabel?: string = "";
    closeLabel: string = "";
    confirmAction?: () => void;
    closeAction: () => void;
}
