import {Input,Output, EventEmitter } from '@angular/core';

export class Directory {

    expanded = true;
    checked = false;
    public HasProblem: boolean = false;
    mode: string;
    directories: Array<Directory>;
    path: string="folder.png"
    files: Array<string>;
    code: string;
    public ParentNode: Directory
  
    constructor(
        public ID: number,
        public HasChildren: boolean,
        public Code: string,
        public Name: string,
        public ChildNodes: Array<Directory>=[]
      ) {
    }

    toggle(obj) {
        this.expanded = !this.expanded;
        this.code = obj;
        
    }


    getIcon() {

        if (this.expanded) {
            return '-';
        }

        return '+';
    }

    getPath() {
        if (!this.HasProblem) {
            return 'folder.png';
        }

        return 'folder-blue.png';
    }

    getCss() {
        if (this.expanded) {
            return 'active';
        }
        alert(this.Code);
        return '';
    }

    check() {
        this.checked = !this.checked;
        this.checkRecursive(this.checked);
    }

    checkRecursive(state: boolean) {
        this.ChildNodes.forEach(d => {
            d.checked = state;
            d.checkRecursive(state);
        });
    }
}

