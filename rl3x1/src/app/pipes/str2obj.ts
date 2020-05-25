import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'str2obj' })
export class str2objPipe implements PipeTransform {
    transform<T>(value: string): T {
        if (typeof value === "object")
            return value;
        return JSON.parse(value) as T;
    }
}