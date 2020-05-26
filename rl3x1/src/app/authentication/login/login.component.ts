import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { Property, Util, TypedJson } from '../../app.util';
import { Menu } from 'src/app/back-office/sidebar/menu.model';
import { SidebarService } from 'src/app/back-office/sidebar/sidebar.service';
import { UserService } from 'src/app/back-office/user/User.Service';
import { LoaderService } from '../../loader/loader.service';

declare var $: any;
declare var grecaptcha: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService],
})

export class LoginComponent implements OnInit {
  CurrentUser: string = "";
  password: string = "";
  loginLoader: boolean = false;
  elementpwd: HTMLElement; elementmail: HTMLElement;
  returnUrl: string;
  Menus: Menu[];
  encryptionKey: string = "$aS^AmR$@Cx2o19!";
  sitekey: string = "6Lf1P_wUAAAAACzZCAxbq9CIZJ_vgk-mHgTA7UZX";
  constructor(private _sidebar: SidebarService, private _util: Util, private _auth: AuthService, private router: Router,
    private route: ActivatedRoute, private userService: UserService,private loaderService: LoaderService) {
    if (this._auth.getAuthorizationToken()) {
      this.gohome();
    }
  }

  ngOnInit() {
    this.router.navigate(['/login']);
debugger;
/// NEW
    $(".login-control").toggleClass("step");
   // this.elementpwd.focus();
    grecaptcha.render($('.g-recaptcha')[0], { sitekey: this.sitekey });
/// NEW


    this.elementmail = document.getElementById('txt_email') as HTMLElement;
    this.elementpwd = document.getElementById('txt_password') as HTMLElement;
    this.elementmail.focus();

    var me: any = this
    this.elementmail.onkeypress = function (event) {
      if (event.key == 'Enter' && event.target['id'] == 'txt_email') {
        me.Continue();
      }
    }
    this.elementpwd.onkeypress = function (event) {
      if (event.key == 'Enter' && event.target['id'] == 'txt_password') {
        me.Login();
      }
    }
  }

  Continue() {
    this.loginLoader = true;
    console.log(this.CurrentUser)
    if (this.CurrentUser.length > 0 && this.isValid(this.CurrentUser)) {
      this._auth.lookup(this.CurrentUser).subscribe(
        response => {
          debugger;
          console.log(response)
          this.CurrentUser=response[0].Email.toLowerCase();
          if (response[0] && this.CurrentUser.toLowerCase() == response[0].Email.toLowerCase()) {
            debugger;
            this.loginLoader = false;
            $(".login-control").toggleClass("step");
            this.elementpwd.focus();
            grecaptcha.render($('.g-recaptcha')[0], { sitekey: this.sitekey });
          }
          else {
            debugger;
            this._util.error('Your account is inactive. Please contact your System Administrator.', "Error");
            this.loginLoader = false;
            this.elementmail.className = "req form-control";
          }
        }
      )
    } else if (this.CurrentUser.length <= 0) {
      this._util.error('Incorrect Email formate.', "Error");
      this.loginLoader = false;
      this.elementmail.className = "req form-control";
    } else if (this.CurrentUser.length > 0 && !this.isValid(this.CurrentUser)) {
      this._util.error('Please provide a valid user name.', "Error");
      this.loginLoader = false;
      this.elementmail.className = "req form-control";
    }
    else {
      this._util.error('Your account is inactive. Please contact your System Administrator.', "Error");
      this.loginLoader = false;
      this.elementmail.className = "req form-control";
    }
  }

  gohome() {
    var loginF = sessionStorage.getItem('loginfrst');
    // var pwdexpiry = sessionStorage.getItem('passwrdExp');
    // debugger;
    // || pwdexpiry != null
    if (loginF == 'true') {
      sessionStorage.setItem('loginfrst', '');
      //sessionStorage.setItem('expiry', null);
      this.router.navigate(['/back-office/resetpwd']);
    }
    else {
      this.router.navigate(['/back-office/home']);
    }

    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // if (this.returnUrl != '/')
    //   this.router.navigateByUrl(this.returnUrl);
    // else if (this._auth.getScope() == 'manage')
    //   this.router.navigate(['/manage/home']);
    // else
    //   this.router.navigate(['/back-office/home']);
  }

  goPasswordRecover() {
    this.router.navigateByUrl('auth/password')
  }

  goPasswordreset() {
    this.router.navigateByUrl('auth/resetpwd/rohit');
  }

  Login() {

    const response = grecaptcha.getResponse();
    if (response.length === 0) {
      this._util.error('Captcha not verified.', "Error");
      return;
    }

    this.loginLoader = true;
    this.elementpwd = document.getElementById('txt_password') as HTMLElement;
    this.elementmail = document.getElementById('txt_email') as HTMLElement;
    if (this.isValid(this.CurrentUser)) {
      if (this.password.length > 0) {
        var encrypted = this.userService.setEncryption(this.encryptionKey, this.password);
        this._auth.login(this.CurrentUser, encrypted).subscribe(
          r => {
            debugger;
            this.loginLoader = false;
            this.loaderService.display(true);
            if (r) {
              //=============Clear menus=======//
              localStorage.removeItem('routes');
              this._sidebar.menus = null;

              if (this._sidebar.menus)
              {
                this.gohome();
                this.loaderService.display(false);
              }
              else
              {
                this.populateMenu();
                this.loaderService.display(false);
              }
            }
            else {
              this.elementpwd.className = "req form-control";
              this.elementmail.className = "req form-control";
              //this._util.error('Your Credentials are invalid.', "Error");
              return false;
            }
          })
      }
      else {
        this.elementpwd.className = "req form-control";;
      }
    }
    else {
      this.elementmail.className = "req form-control";;
    }
  }

  populateMenu() {
    this._sidebar.getDyMenu()
      .subscribe(
        _Menus => {
          this.gohome();
        });
  }

  private isValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

}
