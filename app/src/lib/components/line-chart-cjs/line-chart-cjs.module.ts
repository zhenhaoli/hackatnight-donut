import {NgModule} from '@angular/core';

import {LineChartCjsComponent} from './line-chart-cjs.component';
import {CommonModule} from "@angular/common";
import {ChartsModule} from "ng2-charts";

@NgModule({
    imports: [
        CommonModule,
        ChartsModule],
    exports: [
        LineChartCjsComponent
    ],
    declarations: [LineChartCjsComponent],
    providers: [],
})
export class LineChartCjsModule {
}
