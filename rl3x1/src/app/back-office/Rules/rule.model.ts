export class Rule {
    RuleID: number;
    RuleCode: string;
    RuleName: string;
    RuleDescription: string;
    RuleFunction: string;
    RuleTypeID: number;
    RuleType: any;
    ControlTypeID: number;
    isActive: boolean=true;
    CreatedBy: number;
    CreatedDate: string;
    ModifyBy: number;
    ModifyDate: string;
    ddlItems: Array<ddlItem>;
    RuleGroupID: number;
    UserInput: boolean;
    //RuleGroup: any;

    constructor();
    constructor(Rule: Rule)
    constructor(Rule?: any) {
        this.RuleID = Rule && Rule.RuleID || 0;
        this.RuleCode = Rule && Rule.RuleCode || 'AUTO';
        this.RuleName = Rule && Rule.RuleName || '';
        this.RuleDescription = Rule && Rule.RuleDescription || '';

        this.RuleFunction = Rule && Rule.RuleFunction || '';
        this.RuleTypeID = Rule && Rule.RuleTypeID || 0;
        this.RuleType = Rule && JSON.parse(Rule.RuleType)[0] || new Array<any>();
        this.ControlTypeID = Rule && Rule.ControlTypeID || 0;
        this.isActive = Rule && Rule.isActive || true;
        this.UserInput = Rule && Rule.UserInput;

        this.CreatedDate = Rule && Rule.RegionID || new Date().getUTCDate;
        this.ModifyDate = Rule && Rule.ModifyDate || new Date().getUTCDate;
        this.CreatedBy = Rule && Rule.CreatedBy || 0;
        this.ModifyBy = Rule && Rule.ModifyBy || 0;
        this.ddlItems = Rule && JSON.parse(Rule.ddlItems) || new Array<ddlItem>();

        this.RuleGroupID = Rule && Rule.RuleGroupID || null;
        //this.RuleGroup = Rule && JSON.parse(Rule.RuleGroup)[0] || new Array<any>();
    }

}

export class ddlItem {
    ID: number;
    DisplayValue: string;
    Value: string;
    constructor();
    constructor(ddlItem: ddlItem)
    constructor(ddlItem?: any) {
        this.ID = ddlItem && ddlItem.ID || + new Date();
        this.DisplayValue = ddlItem && ddlItem.DisplayValue || '';
        this.Value = ddlItem && ddlItem.Value || '';
    }
}