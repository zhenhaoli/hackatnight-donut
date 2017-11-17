import {Component, Inject, Input, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";

@Component({
    selector: 'custom-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
    public title: string;
    public content: string;
    public confirmLabel: string;
    public closeLabel: string;
    public confirmAction: () => void;
    public closeAction: () => void;

    constructor(public dialogRef: MdDialogRef<DialogComponent>, @Inject(MD_DIALOG_DATA) public data: any) {
        this.title = data.title;
        this.content = data.content;
        this.confirmLabel = data.confirmLabel ? data.confirmLabel : null;
        this.confirmAction = data.confirmAction ? data.confirmAction : null;
        this.closeLabel = data.closeLabel;
        this.closeAction = data.closeAction;
    }

    public close() {
        if (this.closeAction) {
            this.closeAction();
        }
        this.dialogRef.close(false);
    }

    public confirm() {
        if (this.confirmAction) {
            this.confirmAction();
        }
        this.dialogRef.close(true);
    }
}
