import { Component, Input, Output, EventEmitter, ViewChild, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { LocationService } from './Location.Service';
import { LocationStructure } from './Location.model.js';
import { Util } from 'src/app/app.util';
var rng = require('../../../assets/js/creategrid.js');
declare var $: any;
@Component({
    selector: 'loc-structure',
    providers: [LocationService],
    templateUrl: './LocationPositions.template.html'

})

export class LocationPositions {
    @Input('StructureData') StructureData: LocationStructure;
    Rows = [];
    Columns = [];
    Labels = "";
    LabelsArray = [];
    PartnerLocationID: number;
    @Output() AddRowNColumnEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() EditRowNColumnEvent: EventEmitter<any> = new EventEmitter();
    @Output() DeleteLocationEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() RenameLocationEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() refControlEvent: EventEmitter<any> = new EventEmitter();

    constructor(private $locationService: LocationService, private _change: ChangeDetectorRef,private _util:Util) {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.StructureData.Childs)
            this.StructureData.Childs.forEach((item, itemindex) => {
                if ($.inArray(item.RowIndex, this.Rows) == -1) {
                    this.Rows.push(item.RowIndex);
                }
                for (var i = 0; i < this.StructureData.Childs.filter(f => f.RowIndex == item.RowIndex).length; i++) {
                    this.Columns.push(i + 1);
                }
            });
    }

    

    ShowPopUp(id) {
        $('#div' + id).css("display", "block");
    }
    HidePopUp(id) {
        $('.popover').css("display", "none");
        $('#div' + id).css("display", "none");
    }
    LocationMap = function (val) {
        val = 'Col' + val;
        this.Labels += $('#' + val).find("span").html() + "`";
        var x = this.getLabels(val);
        var label = this.Labels;
        var lbl = label.split('`');
        var fullLabel = "";
        for (var i = lbl.length - 1; i--;) {
            if (lbl[i] != "") {
                fullLabel += lbl[i].trim() + "-";
            }
        }
        fullLabel = fullLabel.substr(0, fullLabel.length - 1);
        this.Labels = "";
        return fullLabel;
    }
 
    getLabels(id) {
        if (typeof id !== 'undefined') {
            if (typeof ($("#" + $('#' + id).parents("td:first").attr("id")).find("span").html()) !== 'undefined') {
                this.Labels += ($("#" + $('#' + id).parents("td:first").attr("id")).find("span").html()) + "`";
                var x = this.getLabels($('#' + id).parents("td:first").attr("id"));
            }
        }
    }
    
    AddRowNColumnEventCallback($event) { 
        this.AddRowNColumnEvent.emit($event);
    }

    EditRowNColumnEventCallback () {

    }

    RenameLocationCallback($event) {
        this.RenameLocationEvent.emit($event);
    }

    DeleteLocationEventCallback($event) {
        this.DeleteLocationEvent.emit($event);        
    }  
    trackByFn(index, item) {
        return item.PartnerLocationID;
    }  
}