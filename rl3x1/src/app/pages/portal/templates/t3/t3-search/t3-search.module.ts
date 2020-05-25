import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { T3SearchRoutingModule } from './t3-search-routing.module';
import { T3SearchComponent } from './t3-search.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [T3SearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    T3SearchRoutingModule,
    NgxUiLoaderModule
  ]
})
export class T3SearchModule { }
