import {NgModule} from '@angular/core';
import {FlexLayoutModule} from "@angular/flex-layout";
import {PipesModule} from "./pipes/pipes.module";
import {DialogModule} from "./components/dialog/dialog.module";
import {MainLayoutModule} from "./layouts/main-layout/main-layout.module";

@NgModule({
    imports: [
        // Material Modules
        FlexLayoutModule,
        // own modules
        PipesModule,
        DialogModule,
        MainLayoutModule
    ],
    exports: [
        // Material Modules
        FlexLayoutModule,
        // Own modules
        PipesModule,
        DialogModule,
        MainLayoutModule
    ],
    declarations: [],
    providers: [],
    entryComponents: []
})
export class LibraryModule {
}
