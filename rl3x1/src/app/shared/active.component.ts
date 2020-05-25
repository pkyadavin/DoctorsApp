import { Component } from "@angular/core";
//import { ClickableLinkComponent } from "../controls/clickable/link.component";
//import { GlobalVariableService } from '../shared/globalvariable.service';

// both this and the parent component could be folded into one component as they're both simple, but it illustrates how
// a fuller example could work
@Component({
    selector: 'active-link',
    template: `<span *ngIf='canActive && isActive'><i class='fa fa-check-circle fa-2x green' aria-hidden='true'></i></span>
                <span *ngIf='canActive && !isActive'><i class='fa fa-times-circle fa-2x red' aria-hidden='true'></i></span>`
})
export class ActiveComponent {
    private params: any;
    public cell: any;
    public isActive: boolean = true;
    public canActive: boolean = true;
    agInit(params: any): void {
        this.params = params;
        if(!params.data){
            this.canActive = false;
            return;
        }
        if (this.params.colDef.headerName == 'Active') {
            if (this.params.data.IsActive == "Yes" || this.params.data.isActive == "Yes") {
                this.isActive = true;
            } else {
                this.isActive = false;
            }
        }
        else if (this.params.colDef.headerName == 'Back-Office') {
            if (this.params.data.OnBO == "Yes") {
                this.isActive = true;
            } else {
                this.isActive = false;
            }
        }
        else if (this.params.colDef.headerName == 'Customer Portal') {
            if (this.params.data.OnCP == "Yes") {
                this.isActive = true;
            } else {
                this.isActive = false;
            }
        }
        else if (this.params.colDef.headerName == 'Is Active') {
            if (this.params.data.isActive == "Yes") {
                this.isActive = true;
            } else {
                this.isActive = false;
            }
        }
    }

}