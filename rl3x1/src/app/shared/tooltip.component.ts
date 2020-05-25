import { Component } from "@angular/core";
import { ToolTipLinkComponent } from "../controls/clickable/ToolTiplink.component";

//import { GlobalVariableService } from '../shared/globalvariable.service';

// both this and the parent component could be folded into one component as they're both simple, but it illustrates how
// a fuller example could work
@Component({
    selector: 'tooltip-link',
    template: `<ag-tooltiplink [isShow]="IsShowToolTip" [display]="Display" [ToolTipDisplay]="ToolTipDisplay" [cell]="cell"></ag-tooltiplink>               
`
})
export class ToolTipComponent  {
    private params: any;
    public cell: any;
    public Display: string;
    public ToolTipDisplay: string;
    public IsShowToolTip: boolean;
    
    agInit(params: any): void {
        this.params = params;
        this.cell = params.data; 
        this.IsShowToolTip = params.data.IsShowToolTip;
        this.ToolTipDisplay = params.data.RoleList;

        if (params.data.IsShowToolTip)
            this.Display = (params.value == undefined ? '' : params.value.substr(0, 20));
        else
            this.Display = (params.value == undefined ? '' : params.value);
    }
   
    public clicked(): void {
        this.params.context.componentParent.OpenTooltip(this.cell, this.params.colDef.field);
    }

    public OnLeaveClicked(): void {
        this.params.context.componentParent.LeaveTooltip(this.cell, this.params.colDef.field);
    }

}