import { Pipe, PipeTransform } from '@angular/core';
declare var $: any;

@Pipe({ name: 'has' })
export class hasPipe implements PipeTransform {
    transform(source: Array<any>, what: string, value: string): Array<any> {
        if (source) {
            return source.filter(f => f[what] == value);
        }
    }
}

@Pipe({ name: 'indexOf' })
export class indexOfPipe implements PipeTransform {
    transform(source: Array<any>, what: string, value: string): boolean {
        if (source) {
            var retvalue = false;
            source.forEach(function(_route){
                if(value.indexOf(_route.NavigateURL) > -1)
                {
                    retvalue = true;
                }
            })
            return retvalue;
        }
    }
}