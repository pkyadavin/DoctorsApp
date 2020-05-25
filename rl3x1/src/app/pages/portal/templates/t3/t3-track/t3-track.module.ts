import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { T3TrackRoutingModule } from './t3-track-routing.module';
import { T3TrackComponent } from './t3-track.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [T3TrackComponent],
  imports: [
    CommonModule,
    T3TrackRoutingModule, SharedModule,
    FormsModule,
    NgxUiLoaderModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class T3TrackModule { }
