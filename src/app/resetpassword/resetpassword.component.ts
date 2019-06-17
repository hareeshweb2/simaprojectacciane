import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { AuthService, ProfileService, AlertService } from '../services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { query } from '@angular/core/src/animation/dsl';
import { sharedMessages, ErrorMessages } from '../messages';
// function for comparing new password & confirm password are same
function passwordMatchValidator(c: AbstractControl): { [key: string]: boolean } | null {
  let Password = c.get('newPassword');
  let confirmPassword = c.get('confirmPassword');
  if (Password.pristine || confirmPassword.pristine) {
    return null;
  }
  if (Password.value === confirmPassword.value) {
    return null;
  }
  return { 'match': true };
}

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  pwtoken: any;
  PasswordLinkError: boolean = false;
  bearerToken: any;
  name: any;
  lastName: any;
  paramId: any;
  resetPasswordForm: FormGroup;
  error;
  email;
  showSuccess: boolean = false;
  oldPasswordError: boolean = false;
  accessToken;
  isGotUseInfo: boolean = false;
  sharedMessages = sharedMessages;
  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService, private acrouter: ActivatedRoute, private profile: ProfileService, private alertService: AlertService) {
    //route param required for to get user details to reset the password
    this.acrouter.params.subscribe(params => {
      this.paramId = params.id;
      //this.paramId="b98e3b1228de413abef03bdd8df0acf4";
    }, (error) => {
      this.alertService.error(ErrorMessages.routerError, true);
    });
    this.acrouter.queryParams.subscribe(query => {
      this.pwtoken = query.pwrt;
    }, (error) => {
      this.alertService.error(ErrorMessages.routerError, true);
    });
  }

  ngOnInit() {
    this.getUserInfo();
  }

  //function to check that the entered password does not contain white space-client side validation
  charValidate(control: AbstractControl) {
    let newPassword = control.value; // to get value in input tag
    var chars = [" "];
    for (var i = 0; i < chars.length; i++) {
      let match = chars[i];
      if (newPassword.indexOf(match) >= 0) {
        return { charValidation: true };
      }
    }
    return null;
  }

  // function for form submission
  resetPassword() {
    this.getToken();
    this.killSession();
  }

  //function for get access token to reset password
  getToken() {
    if (this.pwtoken) {
      this.bearerToken = this.pwtoken;
      //localStorage.setItem("accessToken", result.passwordResetToken);
      this.changePassword();
    } else {
      this.bearerToken = "";
      console.log("access Token fetch:error");
    }
  }

  //function for reset the password
  changePassword() {
    //this.accessToken = localStorage.getItem("accessToken");  
    if (this.bearerToken) {
      this.auth.authchangepassword(this.bearerToken, this.resetPasswordForm.value.passwordGroup.newPassword, this.email).subscribe((result: any) => {
        if (result.internalResponseCode === 200) {
          this.showSuccess = true;
        }
        else if (result.internalResponseCode === 401) {
          this.alertService.error(this.sharedMessages.LastThreePasswordSet, true);
        }
        else if(result.internalResponseCode === 400){
          this.alertService.error(this.sharedMessages.forgotPasswordLinkExpired, true);
        }
      }, (error) => {
        this.alertService.error(ErrorMessages.serviceError, true);
      });
    }

  }
  //function to kill the session
  killSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('UID');
    localStorage.removeItem('AccountId')
    localStorage.removeItem("accessToken");
    // this.router.navigateByUrl('/login');
  }

  //To get user information using the unique key received through  url
  getUserInfo() {
    let dataobj = { "UID": this.paramId }
    this.profile.reSetPasswordUserinfo(dataobj).subscribe((res: any) => {
      if (res) {
        this.email = res.data.Email;
        this.resetPasswordForm = this.fb.group({
          email: res.data.Email,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          passwordGroup: this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(8), this.Passwordvalidate, this.charValidate]],
            confirmPassword: ['', Validators.required],
          }, { validator: passwordMatchValidator })
        });

        this.isGotUseInfo = true;
      }
      else {
        this.resetPasswordForm = this.fb.group({
          email: "",
          firstName: "",
          lastName: "",
          passwordGroup: this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(8), this.Passwordvalidate, this.charValidate]],
            confirmPassword: ['', Validators.required],
          }, { validator: passwordMatchValidator })
        });
        this.isGotUseInfo = true;
        let errorObj = {
          detail: res.errorDetails,
          message: res.errorMessage,
          statusCode: res.statusCode,
          reason: res.statusReason
        }
        this.error = errorObj.message;
        console.log("error of fetching the userinfo");
      }
    }, (error: HttpErrorResponse) => {
      this.isGotUseInfo = true;
      this.resetPasswordForm = this.fb.group({
        email: "",
        firstName: "",
        lastName: "",
        passwordGroup: this.fb.group({
          newPassword: ['', [Validators.required, Validators.minLength(8), this.Passwordvalidate, this.charValidate]],
          confirmPassword: ['', Validators.required],
        }, { validator: passwordMatchValidator })
      });
      this.alertService.error(ErrorMessages.serviceError, true);
    });
  }
  //method to validate password ---change 

  Passwordvalidate(control: AbstractControl) {
    let email = "";
    let firstName = "";
    let lastName = "";
    if (control.parent) {
      if (control.parent.parent) {
        if (control.parent.parent.value) {
          email = control.parent.parent.value.email;
          firstName = control.parent.parent.value.firstName;
          lastName = control.parent.parent.value.lastName;
        }
      }
    }
    let newPassword = control.value;
    if (newPassword !== '') {
      let pattern = /^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/;
      if (pattern.test(newPassword)) {
        var commonPasswordSet = ["123456", "sima.kundu@Accionlabs.com", "Simakundu1", "123456789", "qwerty", "12345678", "111111", "1234567890", "1234567", "password", "123123"];
        for (var i = 0; i < commonPasswordSet.length; i++) {
          let match = commonPasswordSet[i];
          if (match == newPassword) {
            return { commonPasswordSet: true };
          }
          else {
            if ((firstName !== '' && (newPassword.toLowerCase()).indexOf(firstName.toLowerCase()) !== -1) || (lastName !== '' && (newPassword.toLowerCase()).indexOf(lastName.toLowerCase()) !== -1) || (email !== '' && (newPassword.toLowerCase()).indexOf(email.toLowerCase()) !== -1)) {
              return { containFirstLastEmail: true };
            }
            else {
              return null;
            }
          }
        }
      }
      else {
        return { pattern: true };
      }
    }
    else {
      return null;
    }
    return null;
  }

}
