import { Component } from "@angular/core";
import { ClickableComponent } from "../../controls/clickable/clickable.component";
//import { GlobalVariableService } from '../shared/globalvariable.service';

// both this and the parent component could be folded into one component as they're both simple, but it illustrates how
// a fuller example could work
@Component({
    selector: 'select-item',
    template: `<ag-clickable (onClicked)="clicked($event)" [cell]="cell" [Display]="dispaly"></ag-clickable>`

})
export class SelectComponent {
    private params: any;
    public cell: any;
    public dispaly: string;

    agInit(params: any): void {
        this.params = params;
        this.cell = params.data;
        if (this.cell.Resolve)
            this.dispaly = this.cell.Resolve;
        else
            this.dispaly = "Select";
    }

    public clicked(cell: any): void {
        this.params.context.componentParent.SelectItem(cell);
    }
}