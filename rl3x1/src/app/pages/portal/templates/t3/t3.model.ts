import { _returnsObject, address, customer_display, address_display } from '../return.model'
import { Util } from 'src/app/app.util';
import { returnBase } from '../return.base';
import { ActivatedRoute, Router } from '@angular/router';
import { ReturnService } from '../return.service';
import { TemplateServices } from '../template.service';
import { Title } from '@angular/platform-browser/src/platform-browser';
import { NgxUiLoaderService } from 'ngx-ui-loader';

export class T3Model extends returnBase {
    constructor(private _activatedRoute1: ActivatedRoute
        , private _returnService1: ReturnService, private _utilily1: Util, private _router1: Router
        , private _templateService1: TemplateServices, private window1: Window
        , private titleService1: Title
        , ngxUiLoaderService: NgxUiLoaderService) {

        super(_activatedRoute1, _returnService1, _utilily1, _router1, _templateService1, window1,titleService1, ngxUiLoaderService);
    }

    setConfig() {
        //debugger;
        this.setBrandConfig().then(result => {
            console.log("result",result);
            this.customer_display = new customer_display(JSON.parse(JSON.stringify(this.order.customer)));
        });
    }
}


