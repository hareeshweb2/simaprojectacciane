import { Component, OnInit,EventEmitter, Output, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
//import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService,ProfileService, AlertService } from '../services/index';
import { Subscription } from 'rxjs/Subscription';
import { sharedMessages , ErrorMessages } from '../messages';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
  changeDetection:ChangeDetectionStrategy.Default
})
export class ForgotpasswordComponent implements OnInit,OnDestroy {
  loading: boolean=false;
  forgotPasswordForm:FormGroup;
  emailAlreadyExists:boolean;
  emailSendScreen:boolean=false;
  emailId;
  error;
  emailSubscription:Subscription;
  callRunning:boolean=false;
  messages = sharedMessages;
  constructor(private auth:AuthService,private fb: FormBuilder,private router:Router,private profile:ProfileService,private alertService: AlertService) { }

  ngOnInit() {   
    //  Cliend side validation
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]        
    });
  }

  ngOnDestroy(){
    if(this.emailSubscription){
      this.emailSubscription.unsubscribe();
    }
  }


  //check current user a valid user or not
  checkExistingEmailId(){
    if(this.forgotPasswordForm.controls["email"].valid)
    {
      this.callRunning=true;
        this.emailSubscription=this.profile.checkExistingEmail(this.forgotPasswordForm.value.email).subscribe((res: any) => {  
          this.callRunning=false;    
          if (res) {
                this.emailAlreadyExists=true;               
              } 
              else {
                console.log("error");
                this.emailAlreadyExists=false;
              }    
      }, (error: HttpErrorResponse) => {     
        this.callRunning=false;
        this.loading=false;
        this.alertService.error(ErrorMessages.serviceError, true);
      });
    }  

  }

//form submission
  submitEmail(){
    if(this.forgotPasswordForm.invalid)
    return;
    this.emailId=this.forgotPasswordForm.value.email;     
     let data={
      "emailID":this.forgotPasswordForm.value.email     
   }
   this.loading=true;
     this.profile.triggerEmail(data).subscribe((res: any) => {      
      if (res.statusCodeValue==200) { 
          this.emailSendScreen=true;
          this.loading=false;
      } 
      else if(res.statusCodeValue == 412) {
        this.emailSendScreen=false;
        this.loading = false;
      }
    }, (error: HttpErrorResponse) => {     
      this.emailSendScreen=false;
      this.loading = false;
      this.alertService.error(ErrorMessages.serviceError, true);
    }); 
  }
  backToLogin(){
    localStorage.removeItem('user');
    localStorage.removeItem('UID');
    localStorage.removeItem('AccountId')
    localStorage.removeItem("accessToken");
    this.router.navigateByUrl('/login');
  }
  
}
