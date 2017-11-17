import {NgModule} from '@angular/core';
import {DialogComponent} from './dialog.component';
import {DialogService} from "./dialog.service";
import {CommonModule} from "@angular/common";
import {
    MdButtonModule,
    MdDialogModule
} from "@angular/material";

@NgModule({
    imports: [
        CommonModule,
        MdDialogModule,
        MdButtonModule
    ],
    exports: [
        DialogComponent
    ],
    declarations: [DialogComponent],
    providers: [DialogService],
    entryComponents: [DialogComponent]
})
export class DialogModule {
}
