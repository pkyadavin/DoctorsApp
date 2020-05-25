import { Component } from "@angular/core";
import { ClickableImageLinkComponent } from "./ImageIconlink.component";
//import { GlobalVariableService } from '../shared/globalvariable.service';

// both this and the parent component could be folded into one component as they're both simple, but it illustrates how
// a fuller example could work
@Component({
    selector: 'editimage-link',
    template: `<ag-Imagelink (onClicked)="clicked($event)" [display]="Display" [cell]="cell"></ag-Imagelink>
               <div *ngIf="IsDocAttached && cell.AttachedDocument>0" class="glyphicon glyphicon-ok" style="color: Green"></div>
`
})
export class EditIamgeComponent  {
    private params: any;
    public cell: any;
    public Display: string;
    public IsDocAttached: boolean = false;
    
    agInit(params: any): void {
        this.params = params;
        this.cell = params.data; 
        this.Display = (params.value == undefined ? (this.params.colDef.headerName == 'Action' ? this.params.colDef.field : params.value) : params.value); 
        if (this.params.data.IsDocAttached != undefined && this.params.data.IsDocAttached != null) {
            this.IsDocAttached = this.params.data.IsDocAttached;
        } 

        //if (this.params.data.isControlsAdded != undefined && this.params.data.isControlsAdded != null)
        //    this.IsDocAttached = this.params.data.isControlsAdded;
    }

    public clicked(e): void {
        this.params.context.componentParent.EditImageClicked(this.cell, this.params.colDef.field);
    }

}