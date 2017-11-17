import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'roundPipe'
})
export class RoundPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        return (value * 100).toFixed(0);
    }
}
