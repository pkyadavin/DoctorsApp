import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from 'src/app/shared/common.model';
import { message } from 'src/app/controls/pop';
import { Util } from '../../app.util';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent implements OnInit {
  model: User;
  forgetPassword: boolean = false;
  userName: string ="";

  constructor(private authService: AuthService, private _util: Util) {
    this.model = new User();
  }
  ngOnInit() {
  }

  onForgotPassword() {
    this.model.userName=this.userName;
    this.authService.GetPasswordForUserName(this.model)
      .subscribe((data) => {
        if (data.success == false) {
          this._util.error('Invalid Email.',"Error");
          console.log( data.message);
        }
        else {
          var me = this;
          this._util.success("Instruction to reset password has been sent to your registered Email ID.", "Success")
        }
      });
  }
}
