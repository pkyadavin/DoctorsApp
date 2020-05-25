export class OrderTaskFlowModel {
    ModuleWorkFlowID: number;
    ModuleID: number;
    ModuleConfigNumber: string;
    //ModuleConfigDate: Date;
    //ActionXMLData: string;
    //ActionJSONData: string;
    TaskFlowDetails: any;
    constructor()
    constructor(taskflow: OrderTaskFlowModel)
    constructor(taskflow?: any) {
        this.ModuleID = taskflow && taskflow.ModuleID || 0;
        this.ModuleWorkFlowID = taskflow && taskflow.ModuleWorkFlowID || 0;
        this.ModuleConfigNumber = taskflow && taskflow.ModuleConfigNumber || 0;
        //this.ModuleConfigDate = taskflow && taskflow.ModuleConfigNumber || 0;
        //this.ActionXMLData = taskflow && taskflow.ModuleConfigNumber || "";
        //this.ActionJSONData = taskflow && taskflow.ModuleConfigNumber || "";
        this.TaskFlowDetails = taskflow && taskflow.TaskFlowDetails || [];
    }
}

export class TaskFlowDetail {
    ModuleWorkFlowDetailID: number;
    //ModuleID: number;
    //ActionID: number;
    ModuleWorkFlowID: number;
    CurrentModuleStatusMapID: number;
    NextModuleStatusMapID: number;
    ModuleActionMapID: number;
    ActionOrder: number;
    //IsActive: boolean;
    ActionRules: ActionRule[];
    constructor()
    constructor(tflowdetail: TaskFlowDetail)
    constructor(tflowdetail?: any) {
        //this.ModuleID = taskflow.ModuleID;
        this.ModuleWorkFlowDetailID = tflowdetail && tflowdetail.ModuleWorkFlowDetailID || 0;
        //this.ActionID = taskflow.ActionID;
        this.ModuleWorkFlowID = tflowdetail && tflowdetail.ModuleWorkFlowID || 0;
        this.CurrentModuleStatusMapID = tflowdetail && tflowdetail.CurrentModuleStatusMapID || 0;
        this.NextModuleStatusMapID = tflowdetail && tflowdetail.NextModuleStatusMapID || 0;
        this.ModuleActionMapID = tflowdetail && tflowdetail.ModuleActionMapID || 0;
        this.ActionOrder = tflowdetail && tflowdetail.ActionOrder || 0;
        this.ActionRules = tflowdetail && tflowdetail.ActionRules || [];
    }
}

export class ActionRule {
    ModuleWFDetailRuleMapID: number;
    ModuleWorkFlowDetailID: number;
    ModuleRuleMapID: number;
    constructor()
    constructor(actionrule: ActionRule)
    constructor(actionrule?: any) {
        this.ModuleWFDetailRuleMapID = actionrule && actionrule.ModuleWFDetailRuleMapID || 0;
        this.ModuleWorkFlowDetailID = actionrule && actionrule.ModuleWorkFlowDetailID || 0;
        this.ModuleRuleMapID = actionrule && actionrule.ModuleRuleMapID || 0;
    }
}

export class TaskDetail
{
    ActionID: number;
    CurrentState: number;
    NextState: number;
    ActionOrder: number;
    IsError: boolean;
    ErrorMessage: string;
    constructor()
    constructor(TaskDetail: TaskDetail)
    constructor(TaskDetail?: any) {
        this.ActionID = TaskDetail && TaskDetail.ActionID || 0;
        this.CurrentState = TaskDetail && TaskDetail.CurrentState || 0;
        this.NextState = TaskDetail && TaskDetail.NextState || 0;
        this.ActionOrder = TaskDetail && TaskDetail.ActionOrder || 0;
        this.IsError = TaskDetail && TaskDetail.IsError || false;
        this.ErrorMessage = TaskDetail && TaskDetail.ErrorMessage || '';
    }
}

//export class orderSettings {
//    Instructions: string
//    TabList: Array<TabList>
//    constructor()
//    constructor(settings?: any)
//    constructor(settings?: orderSettings) {
//        this.Instructions = settings.Instructions;
//        this.TabList = JSON.parse(settings.TabList.toString());
//    }

//}
//interface TabList {
//    TabName: string
//    TabControls: Array<TabControls>
//}
//interface TabControls {
//    ModuleConfigId: number
//    ControlType: string
//    ControlValueIds: string
//    ControlValue: string
//    ControlLabel: string
//    ControlCode: string
//    ControlOptions: Array<ControlOptions>
//    ChildControls: Array<ChildControls>
//}
//interface ChildControls {
//    ModuleConfigId: number
//    ControlType: string
//    ControlValueIds: string
//    ControlValue: string
//    ControlLabel: string
//    ControlCode: string
//    ControlOptions: Array<ControlOptions>
//}
//interface ControlOptions {
//    optionid: number
//    optiontext: string
//    isselected: boolean
//}