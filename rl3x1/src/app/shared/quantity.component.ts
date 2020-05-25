import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
@Component({
    selector: 'edit-quantity',
    styleUrls: ['./quantity.css'],
    templateUrl: './quantity.template.html'
})
export class QuantityComponent implements OnInit {
    @Input() min: number;
    @Input() max: number;
    @Input() value: number;
    @Output() valueChange = new EventEmitter();
    @Output('onIncrease') valueUp = new EventEmitter();
    @Output('onDecrease') valueDown = new EventEmitter();

    @Input() disableTextBox:boolean;
    @Input() disableControl:boolean;

    oldQuantity:number=1;
    ngOnInit() {
        if (!this.value || this.value < this.min)
            this.value = this.min;
    }
    OnUp() {
        if (this.value >= this.max)
            return;
        this.value += 1;
        this.valueChange.emit(this.value);
        this.valueUp.emit();
    }
    OnDown() {
        if (this.value <= this.min)
            return;        
        this.value -= 1;
        this.valueChange.emit(this.value);
        this.valueDown.emit();
    }
    OnChangeStart() {
        this.oldQuantity = this.value;
    }
    OnChange() {
        if (!this.value || this.value < this.min)
            this.value = this.min;
        if (this.value >= this.max)
            this.value = this.max;
        this.valueChange.emit(this.value);
    }
    OnBlur() {
        // if (!this.value)
        //     this.value = 0;
        // this.valueChange.emit(this.value);
    }
}