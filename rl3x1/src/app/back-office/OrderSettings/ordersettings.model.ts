import { TypedJson } from '../../app.util';
declare var $: any;

export class orderSettings {  
    IsShowTab: boolean;
    Instructions: string    
    TabList: Array<TabList>
    constructor()
    constructor(settings?: any)
    constructor(settings?: orderSettings) {

        var me: any = this;
        me.Instructions = settings.Instructions;
        me.TabList = TypedJson.parse<Array<TabList>>(settings.TabList);

        $.each(me.TabList[0].TabControls, function (i, v) { 
                   
            if (v.ModuleStatus == true) {                
                me.IsShowTab = true;               
            }
        });               
    }

}
interface TabList {    
    TabName: string
    TabControls: Array<TabControls>
}
interface TabControls {
    ModuleConfigId: number
    ControlType: string
    ControlValueIds: string
    ControlValue: string
    ControlLabel: string
    ControlCode: string
    ControlOptions: Array<ControlOptions>
    ChildControls: Array<ChildControls>
}
interface ChildControls {
    ModuleConfigId: number
    ControlType: string
    ControlValueIds: string
    ControlValue: string
    ControlLabel: string
    ControlCode: string
    ControlOptions: Array<ControlOptions>
}
interface ControlOptions {
    optionid: number
    optiontext: string
    isselected: boolean
}