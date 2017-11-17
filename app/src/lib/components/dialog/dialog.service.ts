import {Injectable} from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from "@angular/material";
import {DialogComponent} from "./dialog.component";
import {DialogConfig} from "./dialog.config";

@Injectable()
export class DialogService {
    private dialogRef: MdDialogRef<DialogComponent>;

    constructor(private dialog: MdDialog) {
    }

    public open(dialogConfig: DialogConfig): MdDialogRef<DialogComponent> {
        this.dialogRef = this.createDialogModal(dialogConfig);
        return this.dialogRef;
    }

    private createDialogModal(dialogConfig: DialogConfig): MdDialogRef<DialogComponent> {
        let modalConfig: MdDialogConfig = new MdDialogConfig();
        modalConfig.data = dialogConfig;
        return this.dialog.open(DialogComponent, modalConfig);
    }
}
