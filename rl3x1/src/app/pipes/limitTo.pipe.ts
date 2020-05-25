import { PipeTransform, Pipe  } from '@angular/core';

@Pipe({
  name: 'limitTo'
})
export class limitToPipe implements PipeTransform {

  transform(value: string, limit: number) : string {

    let trail = '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

}