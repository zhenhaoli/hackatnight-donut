import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import {LineChartDataSet} from "./line-chart-cjs.types";

@Component({
    selector: 'line-chart-cjs',
    template: `
        <div class="margin--sm" *ngIf="lineChartData && lineChartData.length > 0">
            <canvas baseChart
                    [datasets]="lineChartData"
                    [labels]="lineChartLabels"
                    [chartType]="lineChartType"
                    [options]="lineChartOptions"
                    [colors]="lineChartColors"></canvas>
        </div>
    `,
    styles: [],
    providers: [DatePipe]
})
export class LineChartCjsComponent implements OnInit, OnDestroy {
    @Input()
    public lineChartData: LineChartDataSet[];

    @Input()
    public lineChartLabels: string[];

    @Input()
    public height: number = 500;

    public lineChartType: string = 'line';
    public lineChartColors: any[] = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        }
    ];
    public lineChartOptions: any = {
        responsive: true
    };

    constructor() {
    }

    ngOnInit() {
        this.calculateChartData();
    }

    ngOnChanges() {
        this.calculateChartData();
    }

    private calculateChartData() {
        // TODO: redraw chart
    }

    ngOnDestroy() {
    }

}
