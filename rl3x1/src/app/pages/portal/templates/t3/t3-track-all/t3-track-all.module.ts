import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { T3TrackAllRoutingModule } from './t3-track-all-routing.module';
import { T3TrackAllComponent } from './t3-track-all.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [T3TrackAllComponent],
  imports: [
    CommonModule,
    T3TrackAllRoutingModule, SharedModule,
    FormsModule,
    NgxUiLoaderModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class T3TrackAllModule { }
