import { Component, Input, Output, EventEmitter, Directive, ViewChild } from '@angular/core';

import { Directory } from './tree-view-directory.js';
import { ContextMenuComponent } from '../context-menu/component/contextMenu.component.js';
import { ContextMenuService } from '../../controls/context-menu/component/src/contextMenu.service.js';
//import { TreeNodeService } from '../../controls/tree-view/tree-view.service.js';
import { Subject } from 'rxjs/Subject';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
    selector: 'tree-view',
    animations: [
        trigger(
            'myAnimation',
            [
                transition(
                    ':enter', [
                        style({ transform: 'translateY(0%)', opacity: 1 }),
                        animate('400ms', style({ transform: 'translateY(10%)', opacity: 1 }))
                    ]
                ),
                transition(
                    ':leave', [
                        style({ transform: 'translateY(10%)', opacity: 1 }),
                        animate('400ms', style({ transform: 'translateY(0%)', opacity: 1 }))

                    ]
                )]
        )
    ],
    //  providers: [ContextMenuService],
    styles: [`a,img {
	        cursor: pointer;
            margin-left: 10px;
            }span:hover {
                background-color: #C9DDE1;
                color:white;
                cursor: pointer;
            }    
            ul {
                    list-style-type: none;
                    background-color:#ffffff;
                    margin:0px;
                    padding-left:22px;
                }
            li {
                    list-style: none;
                    line-height:24px!important;                   
                }`],
    template: `<ul>
                    <li *ngFor="let dir of directories; let i=index" [class.selected]="dir.ID == selectedID"  (contextmenu)=onContextMenu($event,dir)>
                        <a *ngIf="dir.HasChildren && dir.ChildNodes.length>0" (click)="dir.toggle(dir)" 
                             class="toggle"><i [ngClass]="dir.expanded?'fa fa-caret-down':'fa fa-caret-right'"></i></a><img [src]="'../../Assets/img/' + dir.getPath()" /><span [ngClass]="dir.HasProblem?'fontbold':''" (click)="toggle(dir)" > {{ dir.Name }}</span>
                        <div *ngIf="dir.expanded">
                            <tree-view [directories]="dir.ChildNodes" [actionList]="actionList" [(selectedID)]="selectedID" [isContext]="isContext"  (notifyData)="GetData($event)"></tree-view>
                        </div>
                    </li>
                </ul>
                 <context-menu  *ngIf="isContext"></context-menu>
                `
})
//<ul><img [src]="'../../Assets/img/' + dir.Path" />{{dir.getIcon()}}
//    <li *ngFor="let file of dir.Childs">{{file}}</li>
//</ul>
export class TreeView {


    @Input() directories: Array<Directory>;

    @Input() actionList: any;

    @Input() isContext: boolean;
    // isCon: boolean;
    @Output() notifyData: EventEmitter<any> = new EventEmitter<any>();
    @Input() selectedID: string;

    toggle(dir) {
        this.selectedID = dir.ID;
        this.notifyData.emit(dir);
    }

    GetData(dir) {
        this.selectedID = dir.ID;
        this.notifyData.emit(dir);
    }


    constructor(private contextMenuService: ContextMenuService) {
        //console.log('iscon', this.isContext);
    }
    ngOnInit() {
        //  this.isCon = this.isContext;
        // console.log('iscoyfjhgvn', this.isContext);
    }

    public onContextMenu($event: MouseEvent, item: any): void {
        this.contextMenuService.show.next({
            actions: this.actionList,
            event: $event, item: item
        });
        $event.preventDefault();
        $event.stopPropagation();
    }

}