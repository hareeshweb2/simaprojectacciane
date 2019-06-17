import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService,ProfileService, AlertService } from '../services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import {OnReturnDirective} from '../pipes/enterTab';
import { Register } from '../model';
import { RegistrationInputValidations, ErrorMessages } from '../messages';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  changeDetection:ChangeDetectionStrategy.Default
})
export class RegistrationComponent implements OnInit,OnDestroy {
  callregisterservice: boolean=false;
  PasswordMismatchError: boolean;
  RegistrationInputValidations = RegistrationInputValidations;
  captchaError: boolean = false;
  error = {};
  emailData={};
  loading: boolean = false;
  model={
    firstName:'',
    lastName:'',
    email:'',
    month:'',
    date:'',
    year:'',
    dob:'',
    agree:'',
    password:'',
    reenterpassword:'',
    captchaResponse:''
  }
  captchaResponse:string='';
  monthValue: any = [
    { 'label': 'January', 'value': '01' },
    { 'label': 'February', 'value': '02' },
    { 'label': 'March', 'value': '03' },
    { 'label': 'April', 'value': '04' },
    { 'label': 'May', 'value': '05' },
    { 'label': 'June', 'value': '06' },
    { 'label': 'July', 'value': '07' },
    { 'label': 'August', 'value': '08' },
    { 'label': 'September', 'value': '09' },
    { 'label': 'October', 'value': '10' },
    { 'label': 'November', 'value': '11' },
    { 'label': 'December', 'value': '12' }
  ];
  showNonLeapYearMessage:boolean=false;
  nonLeapYearMessage;
  chooseDateCount(year, month){
    var dateValue = [];
    for(var i=1;i<=31;i++){
      if(i<=9){
        dateValue.push("0"+i);
      }
      else{
        dateValue.push(""+i);
      }
   }
    var isLeap = ((year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0));
    if(month=="01" || month=="03"|| month=="05" || month=="07" || month=="08" || month=="10" || month=="12"){
      return dateValue;
    }
    else if(month=="04" || month=="06" || month=="09" || month=="11"){
        dateValue.pop();
        return dateValue;
    }
    else if(month=="02"){
        if(isLeap){
          dateValue.splice(-2);
          if(parseInt(this.model.date) > dateValue.length){
            this.model.date = '01';
          }
          return dateValue;
        }
        else{
          dateValue.splice(-3);
          if(parseInt(this.model.date) > dateValue.length){
            this.model.date = '01';
          }
          return dateValue;
        }
    }
  }
  FirstNamePatternError;
  LastNamePatternError;
  EmailPatternError;
  datePatternError;
  passwordPasswordError;
  PasswordCompareError:boolean=false;
  choosenMonthCount:number = 31;
  choosenYearCount:number = new Date().getFullYear();
  LesserYear:boolean=false;
  serverError:boolean=false;
  registrationSuccessfulPage:boolean=false;
  emailAlreadyExists:boolean=false;
  registerSubscription:Subscription;
  passwordDisplayMessage1:string=""; //to display first error message
  passwordDisplayMessage2:string=""; //to display second error message
  catpchaError:string='init';
  socialLoginSubs:Subscription;
  registerClass:Register = new Register();
  constructor(private profile:ProfileService,private common: CommonService ,private router:Router, private alertService: AlertService) {

   }

  ngOnInit() {
    
  }
  sociallogin(evt) {
    //console.log(evt);
    if (evt) {
      let params = {
        provider: evt,
        pendingRegistration: false,
        callback: this.onLoginHandler.bind(this)
      }
      gigya.socialize.login(params);
    }

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
  getAccountInfoResponse(response) {
    //console.log("Account Info:",response);
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
      });
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
      // this.router.navigate(["/social"]);
      // location.reload(true);
      window.location.pathname = "/social";
    }
    // 
  }

  afterLoginSuccess(result: any) {
    //console.log("After Login Success:",result);
    /** gigya info need to storage in the user */
    if (result.userdetails.token) {
      let userData:any=this.registerClass.setAfterLoginData(result.userdetails.userObj);
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
      // this.router.navigate(["/dashboard"]);
      // location.reload(true);
      window.location.pathname = "/dashboard";
    } 
    //this.loading = false;
  }


  ngOnDestroy(){
    if(this.registerSubscription){
      this.registerSubscription.unsubscribe();
    }
  }

   //creating function to get dates in the date dropdown list
  createDateRange(number){
    var items = [];
    for(var i = 1; i <= number; i++){
      let d = '' + i
       items.push(d);
    }
    return items;
  }

  
  //creating function to get year in the year dropdown list
  createYearRange(number){
    var itemss: number[] = [];
    for(var j = number; j >= 1920; j--){
       itemss.push(j);
    }
    return itemss;
  }

// this will be called on form submit,if age > 13 then registration can be done
  register(registrationForm:NgForm){
    this.loading = true;
    let enteredDate=new Date(registrationForm.value.year+"/"+registrationForm.value.month+"/"+registrationForm.value.date);
    var d1 = new Date();
    var one_day=1000*60*60*24;
    let reducDate = d1.getTime()-enteredDate.getTime();
    let diffDate = Math.round(reducDate/one_day);
    if(diffDate > 4745){
      let data={
         "firstName":registrationForm.value.firstName,
         "lastName":registrationForm.value.lastName,
         "email":registrationForm.value.email,
         "password":registrationForm.value.password,
         "date":registrationForm.value.date,
         "year":(registrationForm.value.year).toString(),
         "month":registrationForm.value.month
      };    
      if(this.captchaResponse!=""){
        this.catpchaError='success';
      }
      else{
        this.catpchaError='error';
        this.loading = false;
      }
     if(registrationForm.valid && this.captchaResponse && this.callregisterservice){
        this.captchaError = false;
        this.registerSubscription=this.profile.registration(data).subscribe((res:any)=>{
          if(res.data){
            //console.log(res);
            this.registrationSuccessfulPage=true;
            this.loading = false;
            window.scrollTo(0, 0);
          }
          else{
            this.error={
              detail:res.errorDetails,
              message:res.errorMessage,
              statusCode:res.statusCode,
              reason:res.statusReason
            }
            this.serverError=true;
          } 
        },(error:HttpErrorResponse)=>{
          this.alertService.error(ErrorMessages.serviceError, true);
          this.loading = false;
        });
      }else{
        // form and captcha condition validation
        //console.log(registrationForm.valid,"captch",this.captchaResponse);
      }
    }else{
      //create a flag to display error msg
      
      this.LesserYear=true;
      this.loading = false;
    }
  }

  /**validations for registration form **/

  // First Name Validations-- checking that firstname contains only alphabets on blur
  validateFirstName(fName){
    let pattern=/^[-\sa-zA-Z]+$/;
    if(fName!==''){
      if (pattern.test(fName)) {
        this.FirstNamePatternError=false;    
      }
      else{
        this.FirstNamePatternError=true;
      }
    }
    else{
      this.FirstNamePatternError=false;
    }
  }

  // First Name Validations-- removing the existing errors on focus from firstName field
  checkFirstName(){
    let pattern=/^[-\sa-zA-Z]+$/;
    if(this.FirstNamePatternError=false && pattern.test(this.model.firstName)){
      this.FirstNamePatternError=true;
    }
    else{
      this.FirstNamePatternError=false;
    }
  }


  // Last Name Validations--checking that lastname contains only alphabets on blur
  validateLastName(lName){
    let pattern=/^[-\sa-zA-Z]+$/;
    if(lName!==''){
      if (pattern.test(lName)) {
        this.LastNamePatternError=false;    
      }
      else{
        this.LastNamePatternError=true;
      }
    }
    else{
      this.LastNamePatternError=false;
    }
  }

  // Last Name Validations--removing the existing errors on focus from lastName field
  checkLastName(){
    let pattern=/^[-\sa-zA-Z]+$/;
    if(this.LastNamePatternError=false && pattern.test(this.model.lastName)){
      this.LastNamePatternError=true;
    }
    else{
      this.LastNamePatternError=false;
    }
  }


   //email validations-- checking the email pattern and if pattern matches, call gigya service to check if email exists in gigya or not
   validateEmailId(email){
    let pattern=/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if(email!==''){      
      if (pattern.test(email)) {
        this.EmailPatternError=false;
        this.loading=true;
        this.profile.checkExistingEmail(this.model.email).subscribe((res: any) => {
            if (res) {
              this.emailAlreadyExists=true;
              if(this.emailAlreadyExists==true){
                this.callregisterservice=false;
                this.loading=false;
              }
              else{
                this.callregisterservice=true;
                this.loading=false;
              }
            } 
            else {
              this.emailAlreadyExists=false;
              this.loading=false;
              if(this.emailAlreadyExists==false){
                this.callregisterservice=true;
              }
              else{
                this.callregisterservice=false;                
              }
            }
          }, (error: HttpErrorResponse) => {
            this.alertService.error(ErrorMessages.serviceError, true);
            this.callregisterservice=true;
            this.loading = false;
          });
      }
      else{
        this.EmailPatternError=true; 
      }
    }
    else{
      this.EmailPatternError=false;
    }
  }

  //email validation--removing email error pattern(if any) on focus
  checkEmailId(){
    let pattern=/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if(this.EmailPatternError=false && pattern.test(this.model.email)){
      this.EmailPatternError=true;
      this.emailAlreadyExists=false;
    }
    else if(this.emailAlreadyExists==true){
      this.emailAlreadyExists=false;
    }
    else{
      this.EmailPatternError=false;
    }
  }

  //password validation-password validation for password length on blur
  validatePassword(password){
    if(password!==''){
      //pattern to check atleast three of following uppercase, lowercase, numbers, special characters.
      let pattern=/^(?:(?=.*[a-z])(?:(?=.*[A-Z])(?=.*[\d\W])|(?=.*\W)(?=.*\d))|(?=.*\W)(?=.*[A-Z])(?=.*\d)).{8,}$/;
      if (pattern.test(password)) {
        this.passwordDisplayMessage1 ="";
        //checking if password is same as firstName,lastName, loginId
        if((this.model.firstName!=='' && (password.toLowerCase()).indexOf((this.model.firstName).toLowerCase())!==-1)||(this.model.lastName!=='' && (password.toLowerCase()).indexOf((this.model.lastName).toLowerCase())!==-1)||(this.model.email!=='' && (password.toLowerCase()).indexOf((this.model.email).toLowerCase())!==-1)){
          this.passwordDisplayMessage1 ="";
          this.passwordDisplayMessage2 = 'Password cannot contain first name, last name or LoginID in it.';
        }
        else{
          this.passwordDisplayMessage2="";
          this.passwordDisplayMessage1 ="";
        }
      }
      else{
        this.passwordDisplayMessage1 = 'Password should contain at least three of following: uppercase, lowercase, numbers, special characters.';
        this.passwordDisplayMessage2 ="";
      }
    }
    else{
      this.passwordDisplayMessage1 ="";
      this.passwordDisplayMessage2="";
    }
  }

  //password validation-removing password errors(if any) on focus
  checkPassword(){
    if(this.passwordDisplayMessage2!=''){
      this.passwordDisplayMessage2='';
    }
    else if(this.passwordDisplayMessage1!=''){
      this.passwordDisplayMessage1='';
    }
  }


  //validating password and re-enter password(if they matches or not)
  comparePassword(password,reenterpassword){
    if(reenterpassword!==''){
      if(password!==reenterpassword){
        this.PasswordCompareError=true;
      }
      else{
        this.PasswordCompareError=false;
      }
    }
    else{
      this.PasswordCompareError=false;
    }
  }

  //re-enter password---clear errors(if any) on focus
  checkReenterpassword(){
    if(this.model.reenterpassword!==''){
      if(this.PasswordCompareError==true){
        this.PasswordCompareError=false;
      }
    }
    else{
      this.PasswordCompareError=false;
    }
  }

  //if user tries to change year, remove lesser year message
  clearLesserYear(){
      this.LesserYear=false;
      this.loading = false;
  }
  resolved(captchaResponse: string) {
      this.captchaResponse = captchaResponse;
      this.catpchaError='init';
      this.loading = false;
      //console.log(`Resolved captcha with response ${captchaResponse}:`);
  }

  /** handling mobile functionalities here**/
  goToRegisterForm(){
    this.common.mobileRegistrationForm=true;
    window.scrollTo(0,0);
    if(this.model.firstName!=='' || this.model.lastName!=='' || this.model.date!=='' || this.model.month!=='' || this.model.year!=='' || this.model.password!=='' || this.model.reenterpassword!=='' || this.model.agree!==''){
      this.model.firstName='';
      this.FirstNamePatternError=false;
      this.model.lastName='';
      this.LastNamePatternError=false;
      this.model.email='';
      this.EmailPatternError=false;
      this.emailAlreadyExists=false;
      this.model.date='';
      this.model.month='';
      this.model.year='';
      this.model.password='';
      this.passwordDisplayMessage1='';
      this.passwordDisplayMessage2='';
      this.model.reenterpassword='';
      this.PasswordCompareError=false;
      this.model.agree='';
    }
  }
}
