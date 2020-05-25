import { Component } from "@angular/core";

// both this and the parent component could be folded into one component as they're both simple, but it illustrates how
// a fuller example could work
@Component({
  selector: "edit-link",
  template: `
    <ag-link
      *ngIf="canActive && IsShow"
      (onClicked)="clicked($event)"
      [display]="Display"
      [cell]="cell"
    ></ag-link>
    <i
      *ngIf="
        params.data &&
        params.colDef.field == 'RMANumber' &&
        params.data.hasFiles
      "
      class="fa fa-paperclip"
      style="color:#919eab;font-size: 15px; cursor: pointer;margin-left:5px;"
    ></i>
    <i
      *ngIf="
        params.data &&
        params.colDef.field == 'RMANumber' &&
        params.data.hasNotes
      "
      class="fa fa-comment"
      style="color:#919eab;font-size: 15px; cursor: pointer;margin-left:5px;"
    ></i>
  `
})
export class EditComponent {
  params: any;
  public cell: any;
  public Display: string;
  public IsShow: boolean = true;
  public canActive: boolean = true;
  agInit(params: any): void {
    //debugger;
    this.params = params;
    if (!params.data) {
      this.canActive = false;
      return;
    }
    //debugger;
    this.cell = params.data;
    this.Display =
      params.value == undefined
        ? this.params.colDef.headerName == "Action" ||
          this.params.colDef.headerName == ""
          ? this.params.colDef.field
          : params.value
        : params.value;
  }

  public clicked(): void {
    //debugger;
    this.params.context.componentParent.EditClicked(
      this.cell,
      this.params.colDef.field
    );
  }
}
