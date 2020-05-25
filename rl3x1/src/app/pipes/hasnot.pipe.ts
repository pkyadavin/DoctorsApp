import { Pipe, PipeTransform } from '@angular/core';
declare var $: any;

@Pipe({ name: 'hasnot' })
export class hasnotPipe implements PipeTransform {
    transform(source: Array<any>, what: string, value: string): Array<any> {
        return source.filter(f => f.what != value);
    }
}