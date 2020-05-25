import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
// import { User } from 'src/app/shared/common.model';
import { Util } from '../../app.util';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  loginLoader:boolean;
  pwdchangeData = { 
    newPassword:'', 
    confirmPassword: '',    
    token:''
  };

  constructor(private router: Router, private authService: AuthService, private _util: Util, private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activateRoute.params.subscribe(
      (param: any) => {
          if (param['code'])
              this.pwdchangeData.token = param['code'];
      });
  }

  ChangePassword() {

    if(this.pwdchangeData.token.length == 0)
    {
      this._util.error('Invalid Request.', "error");
      return;
    }

    if (this.pwdchangeData.newPassword == "" || this.pwdchangeData.newPassword == undefined || this.pwdchangeData.confirmPassword == "" || this.pwdchangeData.confirmPassword == undefined) {
      this._util.warning('Both fields are required.', "warning");
      return;
    }

    if (this.pwdchangeData.newPassword != this.pwdchangeData.confirmPassword) {
      this._util.warning('Confirm password is not same as password.', "warning");
      return;
    }  

    var number = /([0-9])/;
    var alphabets = /([a-zA-Z])/;
    var special_characters = /([~,!,@,#,$,%,^,&,*,-,_,+,=,?,>,<])/;
    var val = this.pwdchangeData.newPassword;

    if (val.length < 8) {
      this._util.warning('Password should be atleast 8 characters.', "warning");
      return;
    }

    if (val.match(number) && val.match(alphabets) && val.match(special_characters)) {
      
      this.loginLoader=true;

      this.authService.ResetPassword(this.pwdchangeData)
      .subscribe((data) => {
        this.loginLoader=false;
        if(data.message == 'success')
        {
          this._util.success('Password reset successfully. Please login with your new Password.', 'success');
          this.router.navigate(['/auth/login']);
        }
        else
        {
          this._util.error(data.message, 'error');
        }
      },error => {
        this._util.error(error, 'error');
        this.loginLoader=false;
      });
    }
    else
    {
      this._util.warning('Your password must be of minimum 8 character long and contains one upper case and one lower case alphabet with at least one number and one special character.', "warning");
    }
  }
}
