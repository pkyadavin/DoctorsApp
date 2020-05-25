import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineItems } from '../controls/OrderTabManager/LineItem/LineItem.Component';

@NgModule({
  declarations: [LineItems],
    imports: [
    CommonModule, 
    
  ],
  
  providers: [
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class BackOfficeModule { } 
