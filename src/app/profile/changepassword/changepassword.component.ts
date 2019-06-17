import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn,FormArray } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { CommonService, AlertService } from '../../services';
import { sharedMessages, ErrorMessages } from '../../messages';

// function for comparing new password & confirm password are same
function passwordMatchValidator(c: AbstractControl): {[key: string]: boolean} | null {
  let newPassword = c.get('newPassword');
  let confirmPassword = c.get('confirmPassword');
  if (newPassword.pristine || confirmPassword.pristine) {
    return null;
  }
  if (newPassword.value === confirmPassword.value) {
      return null;
  }
  return { 'match': true };
}

 //function to check the current password is not same as old password used in client side validation
 function checkWithOldPassword(c: AbstractControl) {
  let newPassword = c.get('passwordGroup.newPassword').value; // to get value in input tag
  let currentPassword = c.get('currentPassword').value;
  if (newPassword == currentPassword) { return{ MatchPasswordCurrentNew: true } }
  else
    return null
}


@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  emailId: string;
  lname: string;
  fName: string;
  isProcessing: boolean=true;
  sharedMessages = sharedMessages;
  resetPasswordForm: FormGroup;
  mismatchPassword: boolean = false;
  updatePass: any;
  error;
  uid: string = localStorage.getItem("UID");
  email: string = this.profile.currentProfile.user.Email;
  accessToken;   
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,private profile:ProfileService , private common:CommonService , private alertService: AlertService) { }
  ngOnInit() {   
    window.scrollTo(0, 0);  
    this.hideProfileHead();
    //  Cliend side validation
    this.resetPasswordForm = this.fb.group({
      email: this.profile.currentProfile.user.Email,
      firstName: this.profile.currentProfile.user.FirstName,
      lastName: this.profile.currentProfile.user.LastName,
      currentPassword: ['', [Validators.required]],
      passwordGroup: this.fb.group({
        newPassword: ['', [Validators.required,Validators.minLength(8), this.Passwordvalidate,this.charValidate]],
        confirmPassword: ['', Validators.required],
    }, {validator: passwordMatchValidator})     
    }, {validator: checkWithOldPassword});
  }

  // function for update new password
  updatePassword() {
    // console.log(this.resetPasswordForm);
    // console.log('Saved: ' + JSON.stringify(this.resetPasswordForm.value));
    this.getToken();
  }
  // function for checking new password are not same as current password
  checkCurrentPass() {
    this.isProcessing=true; 
    let data={
      loginID:this.email,
      Password:this.resetPasswordForm.value.currentPassword
    }   
    this.updatePass = this.auth.gigyaLoginChangePassword(data).subscribe((result: any) => {      
      this.isProcessing=false;
      if (result.internalResponseCode == 403) {   
        this.alertService.error("Please enter correct password", true);    
      } 
      else {
        
      }
    }, (error) => {          
      this.alertService.error(ErrorMessages.observableError, true);
    });
  }

  // function to get  access token for change password
  getToken() {
    if(this.isProcessing){
    return false;
  }
    this.auth.gigyaChangePasswordToken(this.email).subscribe((result: any) => {
      if (result.data.passwordResetToken) {
        localStorage.setItem("accessToken", result.data.passwordResetToken);
        this.changePassword();

      } else {       
        console.log('error');       
      }
    }, (error) => {
      this.alertService.error(ErrorMessages.serviceError, true);
    });
  }
  // function for update the change password bearing the access token
  changePassword() {
    this.accessToken = localStorage.getItem("accessToken");
    this.auth.authchangepassword(this.accessToken, this.resetPasswordForm.value.passwordGroup.newPassword, this.email).subscribe((result: any) => {
      if (result.internalResponseCode === 200) {
        this.alertService.success(this.sharedMessages.successPasswordChange, true);
        setTimeout(() => {         
          this.killSession();
        }, 3000);
      } else if (result.internalResponseCode === 401) { 
        this.alertService.error(this.sharedMessages.LastThreePasswordSet, true);
      }
    }, (error) => {
      this.alertService.error(ErrorMessages.serviceError, true);
    });
  }
 
  // function to clear all the session items
  killSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('UID');
    localStorage.removeItem('AccountId')
    localStorage.removeItem("accessToken");
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

// function to check the entered password does not contain any  white space- client validation
  charValidate(control: AbstractControl) {
    let newPassword = control.value; // to get value in input tag
    var chars = [" "];
    for (var i = 0; i < chars.length; i++) {
      let match = chars[i];
      if (newPassword.indexOf(match)>=0) {
        return { charValidation: true };
      }
    }
    return null;
  }


  //method to validate password ---change 

  Passwordvalidate(control: AbstractControl){
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
    if(newPassword!==''){
      let pattern=/^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/;
      if (pattern.test(newPassword)) {
        var commonPasswordSet = ["123456","sima.kundu@Accionlabs.com","Simakundu1", "123456789", "qwerty", "12345678", "111111", "1234567890", "1234567", "password", "123123"];
          for (var i = 0; i < commonPasswordSet.length; i++) {
            let match = commonPasswordSet[i];
            if (match == newPassword) {
              return { commonPasswordSet: true };
            }
            else{
              //return { commonPasswordSet: false };
              if((firstName!=='' && (newPassword.toLowerCase()).indexOf(firstName.toLowerCase())!==-1)||(lastName!=='' && (newPassword.toLowerCase()).indexOf(lastName.toLowerCase())!==-1)||(email!=='' && (newPassword.toLowerCase()).indexOf(email.toLowerCase())!==-1)){
                  return {containFirstLastEmail : true} ;
              }
              else{
                return null;
              }
            }
          }
      }
      else{
        return {pattern:true} ;
      }
    }
    else{
        return null;
    }
    return null;
  }
  hideProfileHead() {
    this.common.showHeaderProfile = false;
  }
}
