import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ProfileService, AlertService } from '../services';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Register } from '../model/index';
import { FormGroup, FormControl, Validator,FormBuilder, Validators,NgModel,AbstractControl } from '@angular/forms';
import { sharedMessages, ErrorMessages } from '../messages';
// function for comparing new password & confirm password are same
function MatchValidator(c: AbstractControl): { [key: string]: boolean } | null {
  let Password = c.get('password');
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
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
  changeDetection:ChangeDetectionStrategy.Default
})
export class SocialComponent implements OnInit {

  showForm: boolean;
  LesserYear: boolean;
  constructor(private fb:FormBuilder, private profile:ProfileService, private router:Router,private acrouter: ActivatedRoute,private ref:ChangeDetectorRef,private alertService: AlertService) { 
    this.acrouter.params.subscribe(params => {    
      this.paramId = params.id;
      //this.paramId="b98e3b1228de413abef03bdd8df0acf4";
    })
  }
  registerUserForm:FormGroup;
  register:Register = new Register();
  profileData:any;
  error;
  loading: boolean = false;
  photoURL:string="assets/img/Default_Profile_Img.png";
  paramId: any;
  //model:any= this.register;
  months:any = this.register.getMonth();
  
  //declearation for invite user  
  lName: any;
  fName: any;
  contactName: any;
  emailid:any;
  emailDisable:boolean
  accountPurcheser: any;
  accountOwner: any;
  mozoRole: any;
  churchRole: any;
  accountId: any;
  awanaRole: any;
  contactId: any;
  senderName: any;
  email: any;
  id: any;
  messagesShared = sharedMessages;
  registerLinkExpire: boolean;
  formFieldDisable: any;
  ngOnInit() {
    if(this.paramId)
    {
      //invite new leader for manage leader functionality      
      this.inviteUserInfo();
    }
    else{
      //this.fName="";
      //this.lName="";
      //console.log("Social Start"+ this.register.getNumberMonth('November'),"Months :",this.months);
    let pageData=JSON.parse(localStorage.getItem("social"));
    if(pageData){
      this.profileData = pageData;
      this.photoURL = pageData.photoURL;
      if(pageData.firstName){
        this.fName = pageData.firstName;
      }
      if(pageData.lastName){
        this.lName = pageData.lastName;
      }
      if(pageData.email){
        this.emailid = pageData.email;
        this.emailDisable = true;
        //this.registerUserForm.get('socialemail').disable();
      }
    }else{
      this.router.navigate(["/login"]);
    }
    this.registerUserForm = this.fb.group({
      firstName:[pageData.firstName,[Validators.required,Validators.minLength(3),Validators.maxLength(40)]],
      lastName:[pageData.lastName,[Validators.required,Validators.minLength(3),Validators.maxLength(40)]],
      socialemail:[{value: this.emailid, disabled: this.emailDisable},[Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],      
      date:['',Validators.required],
      month:['',Validators.required],
      year:['',Validators.required],
      term:['',Validators.required]
    });
    this.showForm=true;
    this.registerUserForm.get('firstName').markAsDirty();
    this.registerUserForm.get('lastName').markAsDirty();
    }
  }
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
  chooseDateCount(year, month){
    let dateValue:any = [];
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
        return  dateValue;
    }
    else if(month=="02"){
        if(isLeap){
          dateValue.splice(-2);
          if(parseInt(this.registerUserForm.value.date) > dateValue.length){
            this.registerUserForm.controls['date'].setValue('01');
          }
          return dateValue;
        }
        else{
          dateValue.splice(-3);
          if(parseInt(this.registerUserForm.value.date) > dateValue.length){
            this.registerUserForm.controls['date'].setValue('01');
          }
          return dateValue;
        }
    }
    else{
      return [];
    }
  }
  get firstName() { return this.registerUserForm.get('firstName'); }
  get lastName() { return this.registerUserForm.get('lastName'); }
  get socialemail() { return this.registerUserForm.get('socialemail'); }
  get date() { return this.registerUserForm.get('date'); }
  get month() { return this.registerUserForm.get('month'); }
  get year() { return this.registerUserForm.get('year'); }
  get term() { return this.registerUserForm.get('term'); }

  onYearChange(data){
    this.LesserYear = false;
  }
  socialRegister(){
    this.loading = true;
    this.LesserYear=false;
    let enteredDate=new Date(this.registerUserForm.value.year+"/"+this.register.getNumberMonth(this.registerUserForm.value.month)+"/"+this.registerUserForm.value.date);
    var d1 = new Date();
    var one_day=1000*60*60*24;
    let reducDate = d1.getTime()-enteredDate.getTime();
    let diffDate = Math.round(reducDate/one_day);
    if(diffDate <= 4745){
      this.LesserYear = true;
      this.loading = false;
      return false;
    }
    if(this.paramId){
      if(!this.email)
      {
        this.email="";
      }    
      let userData={
        data:{
          "regUserObj":{
            "firstName":this.registerUserForm.value.firstName,
            "lastName": this.registerUserForm.value.lastName,
            "email": this.email,            
            "password": this.registerUserForm.value.passwordGroup.password,
            "country": "United States",
            "date": this.registerUserForm.value.date,
            "year": this.registerUserForm.value.year,
            "month": this.registerUserForm.value.month
          },
          "churchObj":{
            "accountId": this.accountId,
            "awanaRoles": this.awanaRole,
            "churchRoles": this.churchRole,
            "mozo_level":this.mozoRole,
            "accountOwner": this.accountOwner,
            "authorizedPurchaser": this.accountPurcheser
          }
        }
      }
      //this.loading = true;
      this.profile.registerUser(userData).subscribe((res:any)=>{
        this.loading = false;
        this.router.navigate(['login']);
       
      },(error:HttpErrorResponse)=>{
        this.alertService.error(ErrorMessages.serviceError, true);
        this.loading = false;
      })

    }
    else{
      if(this.registerUserForm.dirty && this.registerUserForm.valid){
        if(this.registerUserForm.value.term){
          let gigyaRegistration = {
                UID: this.profileData.UID,
                regToken:this.profileData.regToken,
                profile: {
                  firstName: this.registerUserForm.value.firstName,
                  lastName: this.registerUserForm.value.lastName,
                  email: this.registerUserForm.value.socialemail,
                  country: "United States",
                  birthDay: ""+this.registerUserForm.value.date,
                  birthMonth: ""+this.registerUserForm.value.month,
                  birthYear: ""+this.registerUserForm.value.year,
                },
                data: {
                  "terms":'true'
                },
                callback: this.setAccountInfoResponse.bind(this)
          };
          gigya.accounts.setAccountInfo(gigyaRegistration);        
        }
      }else{

      }

    }
    
  }

  setAccountInfoResponse(res){
    if(res.errorCode === 0 && res.status == "OK"){
      gigya.accounts.finalizeRegistration({regToken:res.requestParams.regToken});
      gigya.accounts.getAccountInfo({ 
        UID: this.profileData.UID,
        regToken:this.profileData.regToken,
        callback: this.getAccountInfoResponse.bind(this) });
    }else{
      if(res.status == "FAIL"){
        this.setAccountFail({errorDetails:res.errorDetails});
      }
    }
  }
  setAccountFail(data){
    this.loading = false;
    this.alertService.error(data.errorDetails, true);
    this.ref.detectChanges();
  }
 sfRegistration(data){
    this.profile.socialConnect(data).subscribe((res:any)=>{
      if(res.message.statusCode == 200){
        //this.router.navigate(['dashboard']);
        gigya.accounts.getAccountInfo({ callback: this.getAccountInfoResponse.bind(this)});
      }
    },(error:HttpErrorResponse)=>{
      this.alertService.error(ErrorMessages.serviceError, true);
    })
 }
 getAccountInfoResponse(response){
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
    
    this.profile.socialLogin(userdetails).subscribe((result: any) => {
      if (result) {
        this.afterLoginSuccess(result);
      }
    },(error:HttpErrorResponse)=>{
      this.loading = false;
      this.alertService.error("Something Went Wrong. Please conatct Administrator", true);
      this.ref.detectChanges();
    });
  }else{
    let sfUserData={
        UID: response.UID,
        email: this.registerUserForm.get('socialemail').value,
        firstName: this.registerUserForm.value.firstName,
        lastName: this.registerUserForm.value.lastName,
        country: "United States",
        DOB:this.registerUserForm.value.year+"-"+this.register.getNumberMonth(this.registerUserForm.value.month)+"-"+this.registerUserForm.value.date
      }

    this.sfRegistration(sfUserData);
    }
  }
  afterLoginSuccess(result: any) {
    /** gigya info need to storage in the user */
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
      localStorage.removeItem("social");
      this.loading=false;
      // this.router.navigate(['dashboard']);
      // location.reload(true);
      window.location.pathname = "/dashboard";
    }
  }
  ngOnDestroy(){

  }
  //invite user code start 
  inviteUserInfo(){
    if(this.paramId)
    {
      this.profile.inviteUserDetails(this.paramId).subscribe((res:any)=>{
        if(res.data)
        {
          this.contactName=res.data.Contact_Name__c.split("-");
          this.id=res.data._id;
          this.email=res.data.npe5__Contact__r.Email;
          this.fName=this.contactName[0].trim();
          this.lName=this.contactName[1].trim();
          this.senderName=res.data.invitedBy;
          this.accountId=res.data.Id;
          this.awanaRole=res.data.Awana_Role__c;
          this.churchRole=res.data.Church_Role__c;
          this.mozoRole=res.data.Mozo_User_Level__c;
          this.accountOwner=res.data.Organization_Owner__c;
          this.accountPurcheser=res.data.Authorized_Purchaser__c;
          if(res.data.npe5__Status__c == 'Declined')
          {
              this.registerLinkExpire = true;
              this.formFieldDisable ='form-fields disabled';

          } else{
            this.registerLinkExpire = false;
            this.formFieldDisable ='form-fields';
          }

        }
        
        this.registerUserForm = this.fb.group({
          firstName:[this.fName,[Validators.required,Validators.minLength(3),Validators.maxLength(40),Validators.pattern(/^[a-zA-Z]+$$/)]],
          lastName:[this.lName,[Validators.required,Validators.minLength(3),Validators.maxLength(40),Validators.pattern(/^[a-zA-Z]+$$/)]],      
          date:['',Validators.required],
          month:['',Validators.required],
          year:['',Validators.required],
          term:['',Validators.required],
          email:this.email,
          registerLinkExpire: this.registerLinkExpire,          
          passwordGroup: this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8),this.Passwordvalidate]],
            confirmPassword: ['', Validators.required],
          }, { validator: MatchValidator })
        });
        this.showForm=true;
        this.registerUserForm.get('firstName').markAsDirty();
        this.registerUserForm.get('lastName').markAsDirty();
      },(error:HttpErrorResponse)=>{
        this.registerUserForm = this.fb.group({
          firstName:['',[Validators.required,Validators.minLength(3),Validators.maxLength(40),Validators.pattern(/^[a-zA-Z]+$$/)]],
          lastName:['',[Validators.required,Validators.minLength(3),Validators.maxLength(40),Validators.pattern(/^[a-zA-Z]+$$/)]],      
          date:['',Validators.required],
          month:['',Validators.required],
          year:['',Validators.required],
          term:['',Validators.required],
          email:'',
          passwordGroup: this.fb.group({
            password: ['', [Validators.required, Validators.minLength(8),this.Passwordvalidate]],
            confirmPassword: ['', Validators.required],
          }, { validator: MatchValidator })
        });
        this.showForm=true;
        this.registerUserForm.get('firstName').markAsDirty();
        this.registerUserForm.get('lastName').markAsDirty();
        this.alertService.error(ErrorMessages.serviceError, true);
      })
    }

  }

 

  //invite user code end 
  // function to check that the password entered is not comes under common password list
  avoidPasswordSet(control: AbstractControl) {
    let email = "";
    let firstName = "";
    let lastName = "";
    if (control.parent) {
      if (control.parent.parent) {
        if (control.parent.parent.value) {
          email =control.parent.parent.value.email;;
          firstName = control.parent.parent.value.firstName;
          lastName = control.parent.parent.value.lastName;
        }
      }
    }

    let newPassword = control.value; // to get value in input tag
    var aviodList = [email, firstName, lastName, "123456", "123456789", "qwerty", "12345678", "111111", "1234567890", "1234567", "password", "123123"];
    for (var i = 0; i < aviodList.length; i++) {
      let match = aviodList[i];
      if (match == newPassword) {
        return { avoidSet: true };
      }
    }
    return null;
  }

  //method to validate password standards 
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
              if((firstName!=='' && (newPassword.toLowerCase()).indexOf(firstName.toLowerCase())!==-1)||(lastName!=='' && (newPassword.toLowerCase()).indexOf(lastName.toLowerCase())!==-1)||(email!=='' && (newPassword.toLowerCase()).indexOf(email.toLowerCase())!==-1)){
                return {containFirstLastEmail : true} ;
              }
              else{
                return null ;
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
    return null ;
  }

}
