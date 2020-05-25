import { Component } from "@angular/core";

// both this and the parent component could be folded into one component as they're both simple, but it illustrates how
// a fuller example could work
@Component({
    selector: 'editimage-link',
    template: `<i class="fa fa-check-circle fa-2x green" *ngIf="canActive && this.isActive"></i>
    <i class="fa fa-times-circle fa-2x red" *ngIf="canActive && !this.isActive"></i>`
})

export class ImageColumnComponent {
    params: any;
    cell: any;
    isActive: boolean = false;
    is_bill_to_customer: boolean = false;
    is_free_of_charge: boolean = false;
    calculated_from_price_list: boolean = false;
    is_repair_charge_applicable: boolean = false;
    canActive: boolean = true;
    agInit(params: any): void {
        this.params = params;
        if(!params.data){
            this.canActive = false;
            return;
        }

debugger;
        if (params.colDef.field == "IsActive" ) {
            
            if (params.data.IsActive.toString() == 'Yes' || params.data.IsActive.toString()=='true') {
                this.isActive = true;
                //this.canActive = true;
            }
            else {
                this.isActive = false;
                //this.canActive = false;
            }             
            
        }

        

        // if (params.data.is_free_of_charge.toString() == 'Yes') {
        //     params.data.is_free_of_charge = true;
        // }
        // else {
        //     params.data.is_free_of_charge = false;
        // }

        // if (params.data.calculated_from_price_list.toString() == 'Yes') {
        //     params.data.calculated_from_price_list = true;
        // }
        // else {
        //     params.data.calculated_from_price_list = false;
        // }
        // if (params.datais_repair_charge_applicable.toString() == 'Yes') {
        //     params.data.is_repair_charge_applicable = true;
        // }
        // else {
        //     params.data.is_repair_charge_applicable = false;
        // }

        if (params.colDef.field == "is_bill_to_customer" ) {  
          if (params.data.is_bill_to_customer.toString() == 'Yes') {
                this.isActive = true;
            }
            else {
                this.isActive = false;
            } 
        }

        if (params.colDef.field == "is_free_of_charge" ) {
                if (params.data.is_free_of_charge.toString() == 'Yes') {
                        this.isActive = true;
                }
                else {
                         this.isActive = false;
                    }
                }

        if (params.colDef.field == "calculated_from_price_list" ) {
            if (params.data.calculated_from_price_list.toString() == 'Yes') {
                this.isActive = true;
                }
                else {
                 this.isActive = false;
                    }
            }
        

        if (params.colDef.field == "is_repair_charge_applicable" ) {
            if (params.data.is_repair_charge_applicable.toString() == 'Yes') {
                this.isActive = true;
                }
                else {
                 this.isActive = false;
                    }
        }
       
        else if (params.colDef.field == "RequiredonBackOffice") {
            this.isActive = params.data.RequiredonBackOffice;
        }
    }
}

