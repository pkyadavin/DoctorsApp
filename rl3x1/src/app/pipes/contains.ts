import { Pipe, PipeTransform } from '@angular/core';
declare var $: any;

@Pipe({ name: 'contains' })
export class containsPipe implements PipeTransform {
    transform(value: Array<string>, args: string): boolean {
        return $.inArray(args, value) == -1 ? false : true;
    }
}