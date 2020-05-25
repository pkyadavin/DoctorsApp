import { Injectable } from "@angular/core"
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Injectable()
export class Util {
    constructor(private toastr: ToastrService) { }
    // ShowAlert(message, title)
    // {
    //     this.toastr.info(message, title);
    // }
    error(message, title, ToastConfig?) {
        this.toastr.error(message, '', ToastConfig);
    }
    success(message, title, ToastConfig?) {
        this.toastr.success(message, '', ToastConfig);
    }
    info(message, title, ToastConfig?) {
        this.toastr.info(message, '', ToastConfig);
    }
    warning(message, title, ToastConfig?) {
        this.toastr.warning(message, '', ToastConfig);
    }

    fileSizeValidate(fileSize, maxSize = 0, minSize = 0) {
        if (maxSize == 0) maxSize = 5;
        if (minSize == 0) minSize = 0;
        let fileSizeInKB = Math.round(fileSize / 1024);
        if (fileSizeInKB > maxSize * 1024)
            return true;
        // else if (fileSizeInKB < minSize * 1024)
        //     return false;
        else
            return false;
    }
    toDecimal(number, point) {
        return parseFloat(parseFloat(number).toFixed(point));
    }

  getUBStatuses(): any {
    let statusList = [];
    statusList.push({ "ubstatus": "NOT_AVAILABLE", "instatus": "Initiated" });
    statusList.push({ "ubstatus": "LABEL_PRINTED", "instatus": "Initiated" });
    statusList.push({ "ubstatus": "IN_TRANSIT", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "HANDOVER", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "WAREHOUSE", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "IN_DELIVERY", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "DELIVERY_FAILED", "instatus": "Delivery Failed" });
    statusList.push({ "ubstatus": "RECEIVER_MOVED", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "NO_HANDOVER", "instatus": "Delivery Failed" });
    statusList.push({ "ubstatus": "DELIVERED", "instatus": "Delivered" });
    statusList.push({ "ubstatus": "CANCELLED", "instatus": "Delivery Failed" });
    statusList.push({ "ubstatus": "SHIPPING_GENERATED", "instatus": "Initiated" });
    statusList.push({ "ubstatus": "PICKUP_SCHEDULED", "instatus": "Initiated" });
    statusList.push({ "ubstatus": "PARCEL_DELIVERED_AT_COUREON_HUB", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "PARCEL_PROCESSED", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "PARCEL_TRANSIT", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "TRANSIT_TO_DESTINATION_COUNTRY", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "PARCEL_AT_CARRIER_NATIONAL_HUB", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "PARCEL_IN_DELIVERY", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "MISSED_DELIVERY", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "PARCEL_STORED", "instatus": "Delivery Failed" });
    statusList.push({ "ubstatus": "DELIVERY_PLANNED", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "PARCEL_DELIVERED", "instatus": "Delivered" });
    statusList.push({ "ubstatus": "UNDELIVERABLE", "instatus": "Delivery Failed" });
    statusList.push({ "ubstatus": "IGNORE", "instatus": "Delivery Failed" });
    statusList.push({ "ubstatus": "WAREHOUSE_INBOUND_SCAN", "instatus": "In-Transit" });
    statusList.push({ "ubstatus": "WAREHOUSE_OUTBOUND_SCAN", "instatus": "In-Transit" });
    return statusList;
  }
}
export class TypedJson {
    static parse<T>(value: any): T {
        if (typeof value === "object" || value === undefined)
            return value;
        return JSON.parse(value) as T;
    }
}
export class Property {
    filterValue: string = "";
    booleanText: string;
    LocalAccess: Array<string> = [];
    errorMessage: string;
    reg: any[];
    h_localize: any;
    e_localize: any;
    Permissions: any;
    moduleTitle: string;
    moduleDescription: string;
    constructor();
    constructor(prop: Property)
    constructor(prop?: any) {
        this.booleanText = "Activate";
        this.filterValue = null;
    }

    OnValidForm(form: any) {
        if (!form.valid) {
            for (var i in form.controls) {
                form.controls[i].markAsTouched();
            }
            return;
        }
        // return true;
    }
    hasPermission(p: string): boolean {
        return $.inArray(p, this.LocalAccess) != -1;
    }
}

export class MaskString {
    mask(startIndex: number, numberOfCharacterToBeMasked: number, interval: number, maskCharacter: string,
        plainString: string): string {
        let finalMaskedString = "";
        let localMaskedInterval: number = 0;
        let localUnMaskedInterval: number = interval;
        let stringToMask = plainString.substr(startIndex, plainString.length);
        let startChars = plainString.substr(0, startIndex);
        stringToMask.split('').forEach(element => {
            if (localMaskedInterval < numberOfCharacterToBeMasked) {
                if (element != ' ') {
                    finalMaskedString += maskCharacter;
                    localMaskedInterval++;
                }
            }
            else {
                if (localUnMaskedInterval == 0) {
                    localMaskedInterval = 0;
                    localUnMaskedInterval = interval;
                }
                else {
                    finalMaskedString += element;
                    localUnMaskedInterval--;
                }
            }
        });
        return startChars + finalMaskedString;
    }
}