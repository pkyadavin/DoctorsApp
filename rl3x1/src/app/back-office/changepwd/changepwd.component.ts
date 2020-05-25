import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import { Router } from '@angular/router';
import { Util } from '../../app.util';
import { GlobalVariableService } from '../../shared/globalvariable.service';
import { ChangePwdService } from './changepwd.service';

@Component({
  selector: 'password-change',  
  templateUrl: './changepwd.component.html',
  styleUrls: ['./changepwd.component.css']
})
export class ChangepwdComponent implements OnInit {  
  encryptionKey: string = "$aS^AmR$@Cx2o19!";
  pwdchangeData = {
    modalShown: false,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    userId: 0,
    actualpassword:''
  };
  constructor(private _auth:AuthService, private _router:Router, private _util: Util, private _globalService: GlobalVariableService, private pwdService: ChangePwdService) { }

  ngOnInit() {
    
  }

  ChangePassword() {

    if (this.pwdchangeData.newPassword == "" || this.pwdchangeData.newPassword == undefined || this.pwdchangeData.confirmPassword == "" || this.pwdchangeData.confirmPassword == undefined) {
      this._util.warning('Both fields are required.', "warning");
      return;
    }

    if (this.pwdchangeData.newPassword != this.pwdchangeData.confirmPassword) {
      this._util.warning('Confirm password is not same as password.', "warning");
      return;
    }

    var partnerinfo = this._globalService.getItem('partnerinfo')[0];
    this.pwdchangeData.userId = partnerinfo.UserId;
    
    var encrypted = this.pwdService.setEncryption(this.encryptionKey, this.pwdchangeData.newPassword);
    debugger;
    
    var number = /([0-9])/;
    var alphabets = /([a-zA-Z])/;
    var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;
    var val = this.pwdchangeData.newPassword;
    this.pwdchangeData.actualpassword =  this.pwdchangeData.newPassword;
    this.pwdchangeData.newPassword = encrypted;
    this.pwdchangeData.confirmPassword = encrypted;

    if (val.length < 8) {
      this._util.warning('Password should be atleast 8 characters.', "warning");
      return;
    }

    if (val.match(number) && val.match(alphabets) && val.match(special_characters)) {
      this.pwdService.ChangePassword(this.pwdchangeData).subscribe(returnvalue => {
        debugger;
        if (returnvalue.result == "Success") {
          this._util.success('Password changed successfully. Please login again.', "Success", "Success"); 
           this._auth.logout(); 
          this._router.navigate(['/auth/login']);        
        }
        else {
          this._util.error(returnvalue.result, "Alert");
        }
      }, error => this._util.error(error, 'error'));
    }
    else {
      this._util.warning('Your password must contain at least 8 characters including numbers and special characters.', "warning");
    }
  }
  
}
