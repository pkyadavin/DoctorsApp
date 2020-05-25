import { Component } from "@angular/core";
import { ClickableLinkComponent } from "./link.component";
//import { GlobalVariableService } from '../shared/globalvariable.service';

// both this and the parent component could be folded into one component as they're both simple, but it illustrates how
// a fuller example could work
@Component({
    selector: 'edit-artifact-link',
    template: `<ag-link (onClicked)="clicked($event)" [display]="cell.FileName" [cell]="cell"></ag-link>
`
})
export class EditArtifactComponent {
    private params: any;
    public cell: any;
    //private partnerinfo: any;

    //constructor(private _globalService: GlobalVariableService) {

    //}

    agInit(params: any): void {
        this.params = params;
        this.cell = params.data;
    }

    public clicked(cell: any): void {
        console.log("edit artifact clicked" + JSON.stringify(cell));
        var popup = window.open(cell.ArtifactURL, '_blank',
            'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,'
            + 'location=no,status=no,titlebar=no');

        popup.window.focus();
        //popup.close();        
    }
}