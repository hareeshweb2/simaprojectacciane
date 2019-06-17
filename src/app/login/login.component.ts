import { Component, OnInit, OnDestroy, OnChanges, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { AuthService, CommonService, ProfileService, AlertService } from '../services/index';
import { Router, ActivatedRoute } from '@angular/router';

//Importing pipes
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { HttpErrorResponse } from '@angular/common/http';
import { Headers, Http } from '@angular/http';
import { userMessages, loginInputValidations, ErrorMessages} from '../messages';
import { Subscription } from 'rxjs/Subscription';
import { Register } from '../model';
import { NgModel } from '@angular/forms';
import { environment } from '../../environments/environment';
import { GigyaClass } from '../util/gigya-class';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LoginComponent implements OnInit,AfterViewInit, OnDestroy {
  errorMessage: string=" ";
  emailInvalidPattern: boolean;
  displaySessionTimeOutError:boolean = false;
  sessionTimeOutMessage : string = "";
  model = { email: "", password: "", keepme:false };
  error = {};
  loginInputValidations = loginInputValidations;
  userMessages = userMessages;
  displayServerError:boolean=false;
  loading: boolean = false;
  loginSubs: Subscription;
  socialLoginSubs: Subscription;
  register:Register = new Register();
  @ViewChild('password') password: NgModel;
  gigClass:GigyaClass;
  constructor(private auth: AuthService, private router: Router,private activateRoute:ActivatedRoute, private profile: ProfileService,private ref:ChangeDetectorRef , private alertService: AlertService) { 
    this.gigClass = new GigyaClass(this.profile);
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
    this.activateRoute.params.subscribe(params => {
      if(params && params.expire == 403){
        this.alertService.info(ErrorMessages.sessionTimeOut , true);
        gigya.socialize.logout({ callback: this.gigClass.onLogoutResponse.bind(this) });
      }
    }, (error:HttpErrorResponse)=>{
      this.alertService.error(ErrorMessages.routerError, true);
    });
    
  }

  ngAfterViewInit(){
    //let param = { enableSSOToken : true, autoLogin : true,forceAuthentication:true };
    //gigya.socialize.getUserInfo(param,{ callback: this.getAccountInfoResponse.bind(this) });
    gigya.accounts.getAccountInfo({ callback: this.getAccountInfoResponse.bind(this) });
  }
  DisplayEventMessage(evt){
    console.log("Init Event",evt);
  }

  ngOnDestroy() {
    if (this.loginSubs) {
      this.loginSubs.unsubscribe();
    }
  }
  sociallogin(evt) {
    this.loading = true;
    if (evt) {
      let params = {
        provider: evt,
        pendingRegistration: false,
        callback: this.onLoginHandler.bind(this)
      }
      gigya.socialize.login(params);
    }

  }

  getAccountInfoResponse(response) {
    //gigya.accounts.setSSOToken({redirectURL: window.location.href});
    // Calling method when Gigya SSO Login
    if(response.status != "FAIL"){
      if (response.data && response.data.ContactId) {
        let userdetails = {
          UID: response.UID,
          ContactId: response.data.ContactId,
          thumbnailURL: response.profile.thumbnailURL,
          photoURL: response.profile.photoURL,
          email: response.profile.email,
          firstName: response.profile.firstName,
          lastName: response.profile.lastName
        }
        
        this.socialLoginSubs = this.profile.socialLogin(userdetails).subscribe((result: any) => {
          if (result) {
            this.afterLoginSuccess(result);
          }
        },(error:HttpErrorResponse)=>{
          this.loading=false;
          this.alertService.error(ErrorMessages.observableError, true);
        //  this.displayServerError = true;
         // this.error = { detail:"Something went wrong, Please contact Administrator."};
          this.ref.detectChanges();
        });
        //this.afterLoginSuccess(data);

      } else {

        let data:any={
          UID: response.UID,
          regToken: response.requestParams.regToken,
          firstName : response.profile.firstName,
          lastName : response.profile.lastName,
          email : response.profile.email,
          photoURL : response.profile.photoURL,
          thumbnailURL : response.profile.thumbnailURL,
          country: "United States"
        };
        localStorage.setItem("social",JSON.stringify(data));
        //this.router.navigate(["/social"]);
        //this.sfRegistration(response);
        //location.reload(true);
        window.location.pathname = "/social";
      }
    }else{
      gigya.socialize.logout({ callback: this.gigClass.onLogoutResponse.bind(this) });
    }
    // 
  }
  onLoginHandler(eventObj) {
    //console.log("Login Response:", eventObj);
    if(eventObj.status !== "FAIL"){
      gigya.accounts.getAccountInfo({ callback: this.getAccountInfoResponse.bind(this) });
    }else{
      gigya.accounts.getAccountInfo({ 
        UID: eventObj.UID,
        regToken:eventObj.regToken,
        callback: this.getAccountInfoResponse.bind(this) 
      });  
    }
  }

  /** 
   * Function: user register in salesforce and get contact-id update in the gigya account info.
   */

  // sfRegistration(userData) {
  //   console.log("SF Registration", userData);
  //   if (!userData.profile.firstName) {
  //     userData.profile.firstName = "Test"
  //   } else if (userData.profile.firstName == "") {
  //     userData.profile.firstName = "Test"
  //   }
  //   if (!userData.profile.lastName) {
  //     userData.profile.lastName = "Test"
  //   } else if (userData.profile.lastName == "") {
  //     userData.profile.lastName = "Test"
  //   }
  //   let data = {
  //     UID: userData.UID,
  //     email: userData.profile.email,
  //     firstName: userData.profile.firstName,
  //     lastName: userData.profile.lastName,
  //     phone: "0123456789",
  //     country: "United State",
  //     DOB: "2000-01-01"
  //   }
  //   this.profile.socialConnect(data).subscribe((res: any) => {
  //     console.log("SF Response:", res);
  //     if (res.message.statusCode == 200) {
  //       //this.router.navigate(['dashboard']);
  //       gigya.accounts.getAccountInfo({ callback: this.getAccountInfoResponse.bind(this) });
  //     }
  //   }, (error: HttpErrorResponse) => {
  //     console.log("SF Error Response:", error);
  //     this.error = {
  //       detail: error.error.message
  //     }
  //   })
  // }

  login() {
    this.loading = true;
    this.getProfileData(this.model);
  }
  ssologin(){
    this.loading = true;
      let params = {
        loginID: this.model.email,
        password:this.model.password,
        'include':'data',
        callback: this.onSSOLoginHandler.bind(this)
      }
      gigya.accounts.login(params);
  }
  onSSOLoginHandler(eventObj) {
    this.loading = false;
    if(eventObj.status !=="FAIL"){
      gigya.accounts.getAccountInfo({ callback: this.getAccountInfoResponse.bind(this) });
    }else{
      this.loading = false;
      this.displayServerError = true;
      this.error = true;
      this.errorMessage="Please enter valid email and correct password.";
      //this.alertService.error(eventObj.errorDetails, true);
      
      this.model.password = "";
      this.password.control.markAsPristine();
      this.password.control.markAsUntouched();
      this.ref.detectChanges();
    }
    // if(eventObj.status !== "FAIL"){
    //   gigya.accounts.getAccountInfo({ callback: this.getAccountInfoResponse.bind(this) });
    // }else{
    //   gigya.accounts.getAccountInfo({ 
    //     UID: eventObj.UID,
    //     regToken:eventObj.regToken,
    //     callback: this.getAccountInfoResponse.bind(this) 
    //   });  
    // }
  }
  getProfileData(data) {
    this.loginSubs = this.auth.gigyaLogin(data).subscribe((result: any) => {
      if (result) {
        this.afterLoginSuccess(result);
      } else {
        this.loading = false;
        this.error = {
          detail: result.errorRes.errorDetails,
          message: result.errorRes.errorMessage,
          statusCode: result.errorRes.statusCode,
          reason: result.errorRes.statusReason
        }
        //this.model.password = "";
      }
    }, (error: HttpErrorResponse) => {
      // Need to maintain the service down issue check the statuscode 0
      this.displaySessionTimeOutError = false;
      if(error.status == 0){
        this.loading = false;
        this.displayServerError = true;
        this.error = {
          detail: "Something went wrong, Please try again."
        }
      }else{
        this.loading = false;
        let data = error.error;
        if(data.errorRes.errorDetails){
            this.displayServerError = true;
            this.model.password = "";
            this.password.control.markAsPristine();
            this.password.control.markAsUntouched();
        }
        this.error = {
          detail: data.errorRes.errorDetails,
          message: data.errorRes.errorMessage,
          statusCode: data.errorRes.statusCode,
          reason: data.errorRes.statusReason
        }
        this.errorMessage="Please enter valid email and correct password.";
      }
    });
  }
  change(pass){
    if(pass !=='' && this.displayServerError==true){
      this.displayServerError=false;
    }
  }

  textAreaEmpty() {
    if (this.model.email == '' || this.model.password == '') {
      this.error = null;
    }
  }


  //validating email 
  validateEmail(email){
    var pattern=/[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/;
    if(pattern.test(email)){
        this.emailInvalidPattern=false;
    }
    else{
      this.emailInvalidPattern=true;
    }
  }

  //if email has existing invalid pattern error,remove it
  removeEmailErrors(email){
    if(email!=='' && this.displayServerError==true){
      this.displayServerError=false;
    }
    else{
      this.displayServerError=true;
    }
    let pattern=/[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}/;
    if(this.emailInvalidPattern=false && pattern.test(this.model.email)){
      this.emailInvalidPattern=true;
    }
    else{
      this.emailInvalidPattern=false;
    }
  }
  checkServerError(password){
    if(password!=='' && this.displayServerError==true){
      this.displayServerError=false;
    }
    else{
      this.displayServerError=true;
    }
  }
  afterLoginSuccess(result: any) {
    if (result.userdetails.token) {
      let userData:any=this.register.setAfterLoginData(result.userdetails.userObj);
      this.profile.currentProfile.user = userData;
      if (result.userdetails.loginObj.thumbnailURL) {
        this.profile.currentProfile.user['thumbnailURL'] = result.userdetails.loginObj.thumbnailURL;
        this.profile.currentProfile.user['photoURL'] = result.userdetails.loginObj.photoURL;
      }
      this.profile.currentProfile.user['UID'] = result.userdetails.loginObj.UID;
      this.profile.currentProfile.user['ContactId'] = result.userdetails.loginObj.ContactId;
      this.profile.currentProfile.token = result.userdetails.token;
      localStorage.setItem('token', result.userdetails.token);
      localStorage.setItem("profile", JSON.stringify(this.profile.currentProfile));
      var params = {
        redirectURL: environment.app_url+"/dashboard"
      };
      gigya.setSSOToken(params);
      //this.router.navigate(["/dashboard"]);
      // location.reload(true);
      //window.location.pathname = "/dashboard";
      this.loading = false;
    } 
  }
  gotoRegisterPage(){
    window.scrollTo(0,0);
    this.router.navigate(['/register']);
  }
}
