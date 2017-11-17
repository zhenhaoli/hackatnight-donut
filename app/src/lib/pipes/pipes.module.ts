import {NgModule} from '@angular/core';
import {RoundPipe} from "./round.pipe";
import {CommonModule} from "@angular/common";

@NgModule({
    imports: [CommonModule],
    exports: [],
    declarations: [RoundPipe],
    providers: [],
})
export class PipesModule {
}
