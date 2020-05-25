import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseValidationComponent } from './case-validation.component';
import { RouterModule } from '@angular/router';
import { routing } from './case-validation.routes';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { EditComponent } from 'src/app/shared/edit.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule, ModalModule } from 'ngx-bootstrap';
@NgModule({
  imports: [routing, FormsModule, AgGridModule.withComponents(
    [
      EditComponent
    ]), SharedModule, NgxPaginationModule, CommonModule, BsDatepickerModule.forRoot(), ModalModule.forRoot()],
  declarations: [CaseValidationComponent],
  exports: [
    RouterModule
  ]
})
export class CaseValidationModule { }
