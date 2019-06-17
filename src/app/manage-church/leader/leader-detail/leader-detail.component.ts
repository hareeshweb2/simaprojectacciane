import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ProfileService,AuthService, CommonService, UserAuthorizationService, AlertService } from '../../../services/index';
import { Subscription } from 'rxjs/Subscription';
import { churchLeadersModuleMessages, ErrorMessages } from '../../../messages';
import { UserAuthorization } from '../../../model';


@Component({
  selector: 'app-leader-detail',
  templateUrl: './leader-detail.component.html',
  styleUrls: ['./leader-detail.component.scss']
})
export class LeaderDetailComponent implements OnInit {
  joinStrAwana: string;
  mozoDropDown=[];
  mozoLicenceAvailable:string;
  mozoLicenceUsed:string;
  licenseExceed:boolean=false;
  mozoRegLevel:string;
  mozoLevel:string;
  accOwner: boolean=false;
  authPurchese: boolean=false;
  userExistsFlag:boolean=false;
  alreadyAssociatedMember:any;
  loading: boolean = false;
  disableFlag:boolean=true;
  popUpAccountOwner:boolean=false;
  popUpAuthpurcheser:boolean=false;
  submitObj: any;
  fName:string;
  lName:string;
  newAccID: any;
  newcontactID: any;
  contactid: any;
  isNew: boolean=true;
  gigiyaId: any;
  accountId: any;  
  userDetails: any;
  emailAlreadyExists: boolean;
  addLeaderForm: FormGroup;
  emailSubscription:Subscription;
  successInviteLeader:boolean=false;
  selectedItems=[];
  selectedChurches='';
  mozoLevelFull:boolean=false;
  messages = churchLeadersModuleMessages;
  userAuthorization: UserAuthorization; // used to store the user role for autherization purpose.
  constructor(private auth:AuthService,
    private fb: FormBuilder,
    private router:Router,
    private profile:ProfileService , 
    private common:CommonService,
    private userAuthorizationSrvc: UserAuthorizationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {  
    //check user authorization level and redirect to forbidden page if the user is not authorized.
    this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
    if(this.userAuthorization.editManageLeaders == false){
        this.router.navigate(['/forbidden']);
    }
    window.scrollTo(0, 0); 
     //  Cliend side validation
     this.addLeaderForm = this.fb.group({
      email: ['', [Validators.required,Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      firstName: ['', [Validators.required,Validators.minLength(3),Validators.pattern(/^[-\sa-zA-Z]+$/)]],
      lastName: ['', [Validators.required,Validators.minLength(3),Validators.pattern(/^[-\sa-zA-Z]+$/)]],
      awanaRole: [[], [Validators.required]],
      churchRole: [''],
      mozoLevel: [''],
      accountOwner: [false],
      authPurchaser: [false]
       });      
       this.getAWanaRolesInLeaders();
       this.getChurchRolesInLeaders();
       this.getChurchRegistrationLevel();
       //backheader
       this.showBackHearder();
  }
  ngOnDestroy(){
    if(this.emailSubscription){
      this.emailSubscription.unsubscribe();
    }
  }

  getAccountId() {
    if (localStorage.getItem('profile')) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      return profile.church.accountID;
    }
  }

   //check current user a valid user or not
   checkExistingEmailId(){
    this.userExistsFlag=false;
   if(this.addLeaderForm.value.email && this.addLeaderForm.controls["email"].valid)
   {
    let churchId=this.profile.currentProfile.church.accountID;
    this.loading=true;
    this.profile.checkExistingEmailForManageleader(this.addLeaderForm.value.email,churchId).subscribe((res: any) => {  
    if(res)
      {
      this.alreadyAssociatedMember=res.data.UserExists;     
      this.loading=false; 
       this.fName=res.data.FirstName;       
       this.lName=res.data.LastName;  
       this.addLeaderForm.value.lastName=res.data.LastName;  
       this.accountId=res.data.AccountId;
       this.gigiyaId=res.data.Gigya_UID;
       this.isNew=false;
       this.contactid=res.data.Id;
       if(this.alreadyAssociatedMember==="True")
        {
          this.userExistsFlag=true;
          this.alertService.warning(this.messages.selfinviteValidation, true);
        }      
      }  
      else{
        this.loading=false;
        this.disableFlag=false; 
        this.alreadyAssociatedMember="false";
      }
    }, (error: HttpErrorResponse) => {     
      console.log(error); 
      this.fName="";
      this.lName="";
      this.addLeaderForm.get('firstName').markAsUntouched();
      this.addLeaderForm.get('firstName').markAsPristine();
      this.isNew=true;
      this.loading=false;
      this.alreadyAssociatedMember="false";
      //this.disableFlag=false;
      this.alertService.error(ErrorMessages.serviceError, true);
    });
   }    

  }
  saveUser(){
    if(this.isNew==true)
    {
      this.newcontactID="";
      this.newAccID=this.profile.currentProfile.church.accountID;
    }
    else{
      this.newcontactID= this.contactid;
      this.newAccID=this.profile.currentProfile.church.accountID;
    }
    let data={
      "email": this.addLeaderForm.value.email,
      "first_name":this.addLeaderForm.value.firstName,
      "last_name": this.addLeaderForm.value.lastName,
      "sender_name":this.profile.currentProfile.user.FirstName + ' ' + this.profile.currentProfile.user.LastName,
      "token": localStorage.getItem('token'),
      "isNew": this.isNew,
      "contactId": this.newcontactID,
      "accountId":this.newAccID,
      "awanaRoles": "",
      "churchRoles": this.addLeaderForm.value.churchRole,
      "mozo_level":this.addLeaderForm.value.mozoLevel,
      "accountOwner": (this.addLeaderForm.value.accountOwner).toString(),
      "authorizedPurchaser": (this.addLeaderForm.value.authPurchaser).toString(),
      "status": 'Current',
      "church_name":this.profile.currentProfile.church.name
    }
    console.log("Awana Count"+this.addLeaderForm.value.awanaRole.length);

    if(this.addLeaderForm.value.awanaRole.length>1){
      this.addLeaderForm.value.awanaRole.forEach(element => {
        data.awanaRoles=data.awanaRoles+element.itemName+"; ";
      });
    }else{
      this.addLeaderForm.value.awanaRole.forEach(element => {
        data.awanaRoles=data.awanaRoles+element.itemName;
      });
    }
    
    data.awanaRoles=data.awanaRoles.replace(/,\s*$/, "");
    this.loading=true;
    this.profile.inviteUser(data).subscribe((res: any) => { 
      this.loading=false;     
      let result=res.data.message;
      this.alertService.success(this.messages.inviteUserSuccess, true);
      this.router.navigate(['manage-church/leaders']); 
      this.addLeaderForm.markAsPristine();
      this.addLeaderForm.markAsUntouched();     
    }, (error: HttpErrorResponse) => {     
      this.loading=false;
      this.alertService.error(ErrorMessages.serviceError, true);
    });
  }
  
  tempRolesInLeaders:any = [];
  getAWanaRolesInLeaders(){ 
    this.profile.getAwanaRoles().subscribe((res: any) => {
      for (let i = 0; i <= res.AwanaRolesResults.AwanaRoles.length; i++) {
        if (res.AwanaRolesResults.AwanaRoles[i]) {
          this.tempRolesInLeaders.push(res.AwanaRolesResults.AwanaRoles[i].data);
          this.tempRolesInLeaders[i]['id'] = i + 1;
          this.tempRolesInLeaders[i]['itemName'] =
            res.AwanaRolesResults.AwanaRoles[i].data.Role;
        }
      }

    },(error: HttpErrorResponse) => {
      this.alertService.error(ErrorMessages.serviceError, true);
    });
  }
  mozoDropVal:any="";
  tempChurchRolesInLeaders:any = [];
  getChurchRolesInLeaders(){   
    this.profile.getChurchRoles().subscribe((res: any) => {
      for (let i = 0; i <= res.ChurchRolesResults.ChurchRoles.length; i++) {
        if (res.ChurchRolesResults.ChurchRoles[i]) {
          this.tempChurchRolesInLeaders.push(
            res.ChurchRolesResults.ChurchRoles[i].data
          );
          this.tempChurchRolesInLeaders[i]['id'] = i + 1;
          this.tempChurchRolesInLeaders[i]['itemName'] =
            res.ChurchRolesResults.ChurchRoles[i].data.Role;
        }
      }

    },(error: HttpErrorResponse) => {
      this.alertService.error(ErrorMessages.serviceError, true);
    });
  }

  //Retrive the Church Regsitration & Mozo Level
  getChurchRegistrationLevel(){
    let data = {
      "accountId": this.getAccountId()
    };

    this.profile.getChurchRegistrationLevel(data).subscribe((res: any) => {

    var mozoDropDownStr       = res.churchLevelResult.mozoDropDown;
    var mozoDropDownArray     = mozoDropDownStr.split(',');
    
    for(var i = 0; i < mozoDropDownArray.length; i++) {
      this.mozoDropDown.push(mozoDropDownArray[i]) ;      
    }


    this.mozoLicenceAvailable  = res.churchLevelResult.numberOfLicences;
    this.mozoLicenceUsed       = res.churchLevelResult.licencesUsed;
    this.mozoRegLevel          = res.churchLevelResult.registrationLevel;
    this.mozoLevel             = res.churchLevelResult.mozoLevel;
    },
    (error: HttpErrorResponse) => {
      this.alertService.error(ErrorMessages.serviceError, true);
    });
  }
  
  getChurchMozoLevel(value){
    if(value=="FULL" || value =="Full"){

      if(this.mozoRegLevel == "M1" && this.mozoLicenceUsed >= "15"){
        this.licenseExceed = true;
      }else if(this.mozoLevel == "M2" && this.mozoLicenceUsed >= "25"){
        this.licenseExceed = true;
      }else if(this.mozoLevel == "M3" && this.mozoLicenceUsed >= "40"){
        this.licenseExceed = true;
      }else if(this.mozoRegLevel == "M4"){
        this.mozoLevelFull = false;
      }
      
      if(this.mozoRegLevel != "M4") {
        this.mozoLevelFull = true;
      }else{
        this.mozoLevelFull = false;
        this.licenseExceed = false;
      }
    }
    else{
      this.mozoLevelFull = false;
      this.licenseExceed = false;
    }
   }
    showBackHearder(){
      this.common.backHeader = true;
      this.common.backHeaderName = "Add New User";
    }
      //Awana Role Onchange function
      onItemSelect(item:any){  
        this.authPurchese= false;
        this.accOwner=false;      
        this.joinStrAwana=this.selectedItems.map(function(elem){
        return elem.Role;
        }).join(",");
        this.updateRoles();
      }
      updateRoles(){
        if(this.joinStrAwana && this.joinStrAwana!==''){
          if(this.selectedChurches==''){
            if((this.joinStrAwana.indexOf('Commander') !== -1) && (this.joinStrAwana.indexOf('Club Secretary') !== -1 ))
            {
              this.authPurchese= true;
              this.accOwner=true;
            }
            else if(this.joinStrAwana.indexOf('Club Secretary') !== -1)
            {
              this.authPurchese= true;
              this.accOwner=false;
            }
            else if(this.joinStrAwana.indexOf('Commander') !== -1){
              this.authPurchese= true;
              this.accOwner=true;
            }
            else{
              this.authPurchese= false;
              this.accOwner=false;
            }
          }
          else{
              this.authPurchese= true;
               this.accOwner=true;
          }
        }
        else if(this.selectedChurches && this.selectedChurches!==''){
              if(this.joinStrAwana ==''){
                this.authPurchese= true;
                this.accOwner=true;
              }
        }
        else if(this.joinStrAwana=='' && this.selectedChurches==''){
            this.authPurchese= false;
            this.accOwner=false;
        }
      }
        OnItemDeSelect(item:any){
          this.onItemSelect(item);       
        }
}
