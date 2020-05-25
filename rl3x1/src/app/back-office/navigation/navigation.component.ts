import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { GlobalVariableService } from "src/app/shared/globalvariable.service";
import { CommonService } from "src/app/shared/common.service";
import { User } from "../../shared/common.model";
import { ApplicationInsightsService } from "src/app/ApplicationInsightsService";
import { BsModalComponent } from "ng2-bs3-modal";
import { AuthService } from "../../authentication/auth.service";
import { message, modal } from "../../controls/pop";
import { Util } from "src/app/app.util";
declare var $: any;
@Component({
  selector: "app-navigation",
  templateUrl: "./navigation.component.html",
  styleUrls: ["./navigation.component.css"],
  providers: [AuthService, ApplicationInsightsService]
})
export class NavigationComponent implements OnInit {
  //Owner: Tenant;
  errorMessage: string;
  message: string;
  title: string;
  LogInUserName: string;
  LoggedInUserEmail: string;
  LogInUserPartnerName: string;
  LoginUserPartnerType: string;
  UserAssignLocation: string;
  UserAssignedRole: string;
  //LoggedIn
  LogInUserImageSrc: string = "assets/img/noimage.png";
  TrialMessage: string;
  IsShowTrialMessage: boolean = false;
  IsDashBordShow: boolean = false;
  @ViewChild("changePassword") pwdmodal: any;
  @ViewChild("modal1") modal: BsModalComponent;
  lastPing?: Date = null;
  toLogoutMessage: boolean = false;
  PartnerInfo: any;
  UserInfo = { UserImage: "", UserId: 0 };
  roleCount: number;
  AssignedRoles = [];
  havePartner: boolean = false;
  chatbar: boolean = false;
  PortalImageSrc: string;
  canChangeTheme: boolean = false;
  _subscription: Subscription;
_route:string;
  constructor(
    private _global: GlobalVariableService,
    private commonser: CommonService,
    private authService: AuthService,
    private _util: Util,
    private _appInsightService: ApplicationInsightsService
  ) {
    this.commonser.getDefaultPartner().subscribe(
      _res => {
        this._global.setItem("partnerinfo", _res);
        this.havePartner = true;
        this.PartnerInfo = this._global.getItem("partnerinfo");
        var data = this.PartnerInfo[Object.keys(this.PartnerInfo)[0]];
        this.UserInfo.UserImage = data.UserImage;
        this.UserInfo.UserId = data.UserId;
        this._appInsightService.setUserId(data.UserId);
        this.LogInUserImageSrc =
          this.UserInfo.UserImage == null || this.UserInfo.UserImage == ""
            ? "assets/img/noimage.png"
            : this.UserInfo.UserImage;
        this.PortalImageSrc = data.PortalIcon;
        if (data.DashBoardMasterID == 6) this.IsDashBordShow = false;
        else this.IsDashBordShow = true;

        var role = this.PartnerInfo[0]["RoleName"];
        this.AssignedRoles.push(role);
        this.roleCount = 1;
        this.LogInUserPartnerName = JSON.stringify(
          data.LogInUserPartnerName
        ).replace(/\"/g, "");
        this.LoginUserPartnerType = data.TypeCode;
        this.LogInUserName = data.LogInUserName;
        this.LoggedInUserEmail = JSON.stringify(data.LogInUserEmail).replace(
          /\"/g,
          ""
        );
        var UserAssignedRole = JSON.stringify(data.RoleName).replace(/\"/g, "");
        if (UserAssignedRole.indexOf("Admin") > -1) this.canChangeTheme = true;
        if (UserAssignedRole.indexOf(",") > -1) {
          var newuser = UserAssignedRole.split(",");
          this.UserAssignedRole = newuser[0] + ",...";
        } else {
          this.UserAssignedRole = UserAssignedRole;
        }
      },
      error => (this.errorMessage = <any>error)
    );
    
    // this._subscription = _global.ChangePartner.subscribe((value) => {
    //     this.PartnerInfo = value;
    // });
  }

  ngOnInit() {
    $.InitiateSideMenu();
    //this._route = sessionStorage.getItem("currentRoute");
        
  }

  signOut(): void {
    this._appInsightService.clearUserId();
    this.authService.logout();
  }
  triggerChangeImage() {
    $("#file").trigger("click");
  }
  UserImageValue: any;
  UserImage: FileList;
  handleInputChange(ctrl, e) {
    var file = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (file.length > 0) {
      var pattern = /image-*/;
      var reader = new FileReader();
      if (!file[0].type.match(pattern)) {
        this._util.error("invalid format", "Alert");
        return;
      }

      this.UserImage = file;
      let formData: FormData = new FormData();
      for (let i = 0; i < this.UserImage.length; i++) {
        formData.append("UserImage", this.UserImage[0]);
      }
      formData.append("UserID", this.UserInfo.UserId.toString());
      this.commonser.UploadUserImage(formData).subscribe(data => {
        if (data.result == "Success") {
          this.LogInUserImageSrc = data.url;
        }
      });
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file[0]);
    }
    // else if (file.length == 0) {
    //     this.LogInUserImageSrc = this.UserInfo.UserImage;
    // }
  }
  _handleReaderLoaded(e) {
    var reader = e.target;
    this.LogInUserImageSrc = reader.result;
  }

  cpUser: User = new User();
  ResetPassword(form) {
    this.cpUser = new User();
    form.reset();
    //this.pwdchangeData.newPassword = "";
    // this.pwdchangeData.oldPassword = "";
    //this.pwdchangeData.confirmPassword = "";
    this.pwdmodal.open();
  }
  Close() {
    this.cpUser = new User();
    this.pwdmodal.close();
  }
  isInvalidpassword: boolean = false;
  ValidateOldPassword(toSend) {
    if (toSend) {
      //   this.loginService.ValidateUserPassword(this.cpUser).subscribe(data => {
      //       if (data[0].IsExists == 0) {
      //           this.isInvalidpassword = true;
      //           //form.controls["Email"].valid = false;
      //       }
      //       else {
      //           this.isInvalidpassword = false;
      //       }
      //   });
    }
  }
  OnChange() {
    this.isInvalidpassword = false;
  }
  alertLabel: string = "";

  isSubmittedForPwdChange: boolean = false;
  ChangePassword() {
    if (this.cpUser.newPassword != this.cpUser.confirmPassword) {
      this._util.warning(
        "Confirm password is not same as password.",
        "warning"
      );
      return;
    }
    this.isSubmittedForPwdChange = true;
    this.authService.ChangePassword(this.cpUser).subscribe(
      data => {
        if (data.success == true) {
          this.alertLabel = "";
          this._util.success(
            "Password has been changed successfully.",
            "Success",
            "Success"
          );
          // alert('Password changed successfully.');
          //this.alertLabel = 'Password changed successfully.';
          this.pwdmodal.close();
          //this.callLogout();
        } else {
          this.alertLabel = "System error. Please try again later.";
        }
        this.isSubmittedForPwdChange = false;
      },
      error => this._util.error(error, "error")
    );
  }

  open() {
    this.modal.open();
  }
}
