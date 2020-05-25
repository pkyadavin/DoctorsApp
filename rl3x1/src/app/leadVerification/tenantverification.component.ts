import { Component, ViewChild, Inject, NgZone  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TenantVerificationService } from '../leadVerification/tenantverification.service';
import { DOCUMENT } from '@angular/platform-browser';
 
import { Util } from '../app.util'
import { message } from '../controls/pop';
// var Toast = require('../../../Assets/toast/jquery.toast.js');
// var Wheel = require('../../../Assets/js/loadingwheel.js');
import { NgxUiLoaderService } from 'ngx-ui-loader';
declare var $: any;

@Component({
    selector: 'TenantVerification',
    providers: [TenantVerificationService],
    templateUrl: './tenantverification.html'
   
})

export class TenantVerificationComponent {

    headerMessage: string;
    detailMessage: string;
    vfcode: string;
    smsvfcode: string;
    currentemail: string;
    needverify: boolean = false;
    PopupHeader:string="";
    PopupBody:string="";
    type:string="";
  
    @ViewChild('pop') _popup: message;
    constructor(private myComponentService: TenantVerificationService, private _router: Router, private activatedRoute: ActivatedRoute,
        @Inject(DOCUMENT) private document, private _ngZone: NgZone,private _Util:Util, private ngxService: NgxUiLoaderService) {
        this.activatedRoute.queryParams.subscribe(queryParams =>
            this.currentemail = queryParams['email']
        );

        this.activatedRoute.queryParams.subscribe(queryParams =>           
            this.type= queryParams['type']            
        );        

        window['angularComponentRef'] = {
            zone: _ngZone,
            component: this
        };
    }
    ngOnDestroy() {
        window['angularComponentRef'] = null;
    }
    ngOnInit() {   
           
        this.vfcode = "";
        this.smsvfcode = "";
        this.headerMessage = "";
        this.detailMessage = "";
        
        this.activatedRoute.queryParams.subscribe(queryParams =>
            this.currentemail = queryParams['email']
        );

        if (typeof (history.pushState) != "undefined") {
            // var url = (this.activatedRoute.snapshot.url)[0].path;
            // history.pushState(null, null, url);
        }
        if(this.type!="" && this.type != undefined)
        {            
            this.PopupHeader="Congratulations!";

            if (this.type != 'pro') {
                this.PopupBody="Your application for Free Trial is being considered for approval. You will get an email as well SMS with your account access codes. Please enter your access codes in the relevant text box. If you do not see our mail in your Inbox, please check your spam folder as well, or email us at <a href=\"mailto:rl3demo@reverselogix.com\" style=\"color:blue;\">rl3demo@reverselogix.com</a>";
                
            }
            else  {
                this.PopupBody="Your application for PAID VERSION is being considered for approval. You will get an email as well as SMS with your account access codes on your registered email id and mobile phone number. If you do not see our mail in your Inbox within 2 working days, please check your spam folder as well, or email us at <a href=\"mailto:rl3demo@reverselogix.com\" style=\"color:blue;\">rl3demo@reverselogix.com</a>";            
            }

            $("#alertdiv").html(this.PopupBody);
            $("#myModal").modal();

            var uri = window.location.toString();
            if (uri.indexOf("?") > 0) {
                var clean_uri = uri.substring(0, uri.indexOf("?"));
                window.history.replaceState({}, document.title, clean_uri);
            }

            this.type="";
        }
     
    }
    goToLogin() {
        if (this.vfcode == undefined || this.vfcode == "") {
            this._Util.error("Email Access Code is required.", "error");
            return;
        }
        if (this.smsvfcode == undefined || this.smsvfcode == "") {
            this._Util.error("Text/SMS Access Code is required.", "error");
            return;
        }
        var me: any = this;
     
            this.ngxService.start();
            
            var reg = { email: this.currentemail, otp: this.vfcode, mobileotp: this.smsvfcode };
            this.myComponentService.TenantVerification(reg).subscribe(returnvalue => {
                this.ngxService.stop();
                this.vfcode="";
                this.smsvfcode="";

                if (returnvalue.data[0][0].status == "1") {  
                    // me._popup.Alert('Success', returnvalue.data[0][0].Message);
                    this.PopupHeader="success";
                    this.PopupBody= "<p>"+ returnvalue.data[0][0].Message +"</p>";
                    $("#alertdiv").html(this.PopupBody);
                    $("#myModal").modal();
                    // this._Util.success(returnvalue.data[0][0].Message,"success","success");                 
                    // this._router.navigate(['myaccount']);
                }
                else {
                    // me._popup.Alert('Alert', returnvalue.data[0][0].Message); 
                    this.PopupHeader="Alert";
                    this.PopupBody= "<p>"+ returnvalue.data[0][0].Message +"</p>";
                    $("#alertdiv").html(this.PopupBody);
                    $("#myModal").modal();
                    //this._Util.warning(returnvalue.data[0][0].Message,"Alert","Alert");   
                    //this._router.navigate(['myaccount']);
                }
            }, error => {
                // Wheel.loadingwheel(false);
                this._Util.error(error, "error");
            });
        
    }
    goToSignUp() {
        //Toast.successToast("Verification code successfully sent on registered email address.");
        this.ngxService.start();
        var reg = { email: this.currentemail };
        this.myComponentService.TenantReSendVerification(reg).subscribe(returnvalue => {
            this.ngxService.stop();
            if (returnvalue.data[0][0].status == "1") {
                // Toast.ShowAlertBox(0, "Success", "Verification code successfully sent on registered email address.", 1);
            }
            else {
                // Toast.ShowAlertBox(1, "Alert", returnvalue.data[0][0].Message, 1);
            }
        
        }, error => {
            // Wheel.loadingwheel(false);
            // Toast.ShowAlertBox(1, "Alert", error, 1);

            this.ngxService.stop();  
        });
    }

}