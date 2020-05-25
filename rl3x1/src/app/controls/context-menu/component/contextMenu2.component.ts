//import { Component, Directive, Input } from '@angular/core';
//import { ContextMenuService } from './src/contextMenu.service';
//import { Subject } from 'rxjs/Rx';

//@Component({
//    selector: 'context-menu-holder',
//    styles: [
//        '.container{width:150px;background-color:#eee}',
//        '.link{}', '.link:hover{background-color:#abc}',
//        'ul{margin:0px;padding:0px;list-style-type: none}'
//    ],
//    host: {
//        '(document:click)': 'clickedOutside()',
//        //'(click)':'clickInside()'
//    },
//    template:
//    `<div [ngStyle]="locationCss" class="container">
//      <ul>
//        <li (click)="link.subject.next(link.title)" class="link" *ngFor="#link of links">
//          {{link.title}}
//        </li>
//      </ul>
//    </div>
//  `
//})
//export class ContextMenuHolderComponent {
//    links = [];
//    isShown = false;
//    private mouseLocation: { left: number, top: number } = { left: 0,top: 0 };
//    constructor(private _contextMenuService: ContextMenuService) {
//        _contextMenuService.show.subscribe(e => this.showMenu(e.event, e.item));
//    }

//    get locationCss() {
//        return {
//            'position': 'fixed',
//            'display': this.isShown ? 'block' : 'none',
//            left: this.mouseLocation.left + 'px',
//            top: this.mouseLocation.top + 'px',
//        };
//    }
//    clickedOutside() {
//        this.isShown = false
//    }

//    showMenu(event, links) {
//        this.isShown = true;
//        this.links = links;
//        this.mouseLocation = {
//            left: event.clientX,
//            top: event.clientY
//        }
//    }
//}

//@Directive({
//    selector: '[context-menu]',
//    host: { '(contextmenu)': 'rightClicked($event)' }
//})
//export class ContextMenuDirective {
//    @Input('context-menu') links;
//    constructor(private _contextMenuService: ContextMenuService) {
//    }
//    rightClicked(event: MouseEvent) {
//        this._contextMenuService.show.next({ event: event, obj: this.links });
//        event.preventDefault();
//    }
//}

//@Component({
//    selector: 'child-component',
//  //  directives: [ContextMenuDirective],
//    template: `
//  <div [context-menu]="links" >right click here ... {{firstRightClick}}</div>
//  `
//})
//export class ChildComponent {
//    firstRightClick;
//    links;
   
//    constructor() {
//        this.links = [
//            { title: 'Add', subject: new Subject() },
//            { title: 'Edit', subject: new Subject() },
//            { title: 'Delete', subject: new Subject() }
//        ];
//        //this.anotherLinks = [
//        //    { title: 'link 1', subject: new Subject() },
//        //    { title: 'link 2', subject: new Subject() },
//        //    { title: 'link 3', subject: new Subject() }
//        //];
//    }

//    // subscribe to subjects
//    ngOnInit() {
//        this.links.forEach(l => l.subject.subscribe(val => this.firstCallback(val)));
//     //   this.anotherLinks.forEach(l => l.subject.subscribe(val => this.secondCallback(val)))
//    }
//    firstCallback(val) {
//        this.firstRightClick = val;
//    }
//    //secondCallback(val) {
//    //    this.secondRightClick = val;
//    //}
//}
//@Component({
//    selector: 'my-app',
// //   directives: [ContextMenuHolderComponent, ChildComponent],
//    template: `
//	<context-menu-holder></context-menu-holder>
//	<h1>My First Angular 2 App</h1>
//	<child-component></child-component>
//	`
//})
//export class CMComponent { }