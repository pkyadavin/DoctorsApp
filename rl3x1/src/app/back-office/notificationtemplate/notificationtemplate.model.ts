export class NotificationTemplate {
    ID: number;
    LanguageID: number;
    TemplateCode: string;
    TemplateName: string;
    TemplateSubject: string;
    TemplateBody: string;
    EnableSchedule: boolean;
    NotificationScheduleID: number;
    IsTextNotification: boolean;
    IsEmailNotification: boolean;
    SchdeuleDayTypeLookUpID1: number;
    SchdeuleDayTypeLookUpID2: number;
    SchdeuleDayTypeLookUpID3: number;
    IsActive: boolean;
    CreatedBy: string;
    CreatedDate: Date;
    ModifyBy: string;
    ModifyDate: Date;
    MessageSetUpKeyValueData: string;
    BrandID: number;
}


export class MessageSetUpKeyValueData {
    KeyValueID: number;
    KeyName: string;
    KeyValue: string;
}
