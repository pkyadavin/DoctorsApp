import { Pipe, PipeTransform } from '@angular/core';
declare var $: any;
@Pipe({ name: 'startFrom' })
export class startFromPipe implements PipeTransform {
   
    transform(input, start)  {
       //return 
            start = +start; //parse to int
            if (typeof input != "undefined")
                return input.slice(start);
        }
    }

//}
//filter('startFrom', function () {
//    return function (input, start) {
//        start = +start; //parse to int
//        if (typeof input != "undefined")
//            return input.slice(start);
//    }
//});