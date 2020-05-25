import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { SharedModule } from './shared/shared.module';
import { BackOfficeModule } from './back-office/back-office.module';
import { LeadsModule } from './leads/leads.module';
import { RlManagerModule } from './rl-manager/rl-manager.module';
import { HttpClientModule } from '@angular/common/http';
import { ControlsModule } from './controls/controls.module';
import { HttpClient } from 'selenium-webdriver/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { utils } from 'protractor';
import { Util } from './app.util';
import { WINDOW_PROVIDERS } from './app.window';
import { CKEditorModule } from 'ngx-ckeditor';
import { LeadVerificationModule } from './leadVerification/leadVerification.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HighchartsChartModule } from '../app/highcharts-angular/src/lib/highcharts-chart.module';
import { LoaderComponent } from './loader/loader.component';
@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent
  ],
  exports: [
    
  ],
  imports: [
    HighchartsChartModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    SharedModule,
    BackOfficeModule,
    LeadsModule,
    RlManagerModule,    
    HttpClientModule, 
    FormsModule,
    ControlsModule,
    BrowserAnimationsModule,
    LeadVerificationModule,
    ToastrModule.forRoot({
      "closeButton": true,
      "newestOnTop": true,
      "progressBar": true,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "timeOut": 10000,
      "extendedTimeOut": 1000
    }),
    CKEditorModule
  ],
  providers: [
    Util,
    WINDOW_PROVIDERS
    // {
    //   provide: RECAPTCHA_SETTINGS,
    //   useValue: { siteKey: '6LfCtckUAAAAAGFJgCdqUokaAcwPQm5cO8AnyfPX' } as RecaptchaSettings,
    // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
