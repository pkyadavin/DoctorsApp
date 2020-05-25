import { Pipe, PipeTransform } from '@angular/core';
declare var $: any;

@Pipe({ name: 'actioncode' })
export class actioncodePipe implements PipeTransform {
    transform(Source: any, args: string, ActionCodes: any, isDependant?: boolean, dependantOn?: any, filter?:string): boolean {
        let baseValues: any = Source.filter(f => f.TypeCode == args);
        if (isDependant) {
            let DependsOn: any = $.map(ActionCodes.filter(f => f.TypeCode == dependantOn), function (n, i) {
                return n.RMAActionCodeID;
            });
            var filteredValue = baseValues.filter(f => {
                var parents = $.map(JSON.parse(f.ParentActionCodes), function (n, i) {
                    return n.ID;
                });
                var arrays = [];
                arrays.push(parents);
                arrays.push(DependsOn);
                var selectedparents = arrays.shift().filter(function (v) {
                    return arrays.every(function (a) {
                        return a.indexOf(v) !== -1;
                    });
                });
                return selectedparents.length > 0;
            });
            if (filter)
                return filteredValue.filter(f => f.RMAActionName.toLowerCase().indexOf(filter.toLowerCase()) != -1)
            return filteredValue;
        }
        if (filter)
            return Source.filter(f => f.TypeCode == args && f.RMAActionName.toLowerCase().indexOf(filter.toLowerCase()) != -1);
        return Source.filter(f => f.TypeCode == args);
    }
}