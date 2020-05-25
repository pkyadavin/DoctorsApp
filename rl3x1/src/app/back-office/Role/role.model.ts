
import { Menu } from '../sidebar/menu.model';
declare var $: any;
export class Role {
    RoleID: number;
    RoleName: string;
    DashBoardMasterID: number;
    DashBoardDescription: string;
    Authorization: Menu[];
    UserType: string;
}

export class DashBoard {
    DashBoardMasterID: number;
    DashBoardCode: string;
    DashBoardDescription: string;
    ListType: string;
}