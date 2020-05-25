import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class TreeNodeService {
    click: EventEmitter<Object> = new EventEmitter();
}