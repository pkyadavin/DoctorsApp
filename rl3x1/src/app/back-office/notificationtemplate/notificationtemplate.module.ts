import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NotificationTemplateGrid } from './notificationtemplate.component';
import { NotificationTemplateService } from './notificationtemplate.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { NotificationTemplateRoutingModule } from './notificationtemplate-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MessageModule } from 'src/app/controls/pop/component/message.module';
import { CKEditorModule } from 'ngx-ckeditor';
import { ImageColumnComponent } from 'src/app/shared/image-column.component';
import { AnalyticsService } from '../analytics/analytics.service';
@NgModule({
    imports: [NotificationTemplateRoutingModule,
         FormsModule, AgGridModule.withComponents([ImageColumnComponent]), SharedModule, MessageModule, CommonModule, CKEditorModule],
    declarations: [NotificationTemplateGrid],
    providers: [NotificationTemplateService, AnalyticsService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NotificationTemplateModule { }
