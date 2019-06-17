import {Component, OnInit, AfterViewInit, OnChanges, Input, ChangeDetectionStrategy,ViewChild, HostListener, ElementRef, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
// import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService, ProfileService, SearchService, AlertService } from '../../services/index';
import 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { environment } from '../../../environments/environment';
import { profileInputValidations,myProfileLabelsAndMessages,ErrorMessages } from '../../messages';
import { commonRegex } from '../../regex';
import { User } from '../../model/user';
import { suggestAddress } from '../../model/suggestAddress';
import { Router } from '@angular/router';
import { PhoneNumberConverter } from '../../util/phoneNumberConverter';
import { WindowScrolling } from "../../services/windowScrolling.service";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { InsertCommaAndSpacePipe } from '../../pipes/appendCommaAndSpace.pipe'
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  animations: [
    trigger('scrollAnimation', [
      state('hide', style({
        opacity: 1,
        transform: "translateX(0)"
      })),
      state('show',   style({
        opacity: 0,
        transform: "translateX(-100%)"
      })),
      transition('show => hide', animate('700ms ease-out')),
      transition('hide => show', animate('700ms ease-in'))
    ])
  ]
})
export class DetailComponent implements OnInit, OnDestroy {
  disableCrossIcon: boolean=false;
  openEditAddressesPopup:boolean=false;
  BillingAddress:boolean=false;
  ShippingAddress:boolean=false;
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  removeChurchConnection: boolean = false;
  private windowScrolling: WindowScrolling;
  previousValues: any;
  churchState: any;
  awanaRole: any;
  churchPostalCode: any;
  churchCountry: any;
  churchCity: any;
  churchStreetName1: any;
  churchStreetName2: any;
  churchStreetName3: any;
  selectedChurch: any;
  @ViewChild('updateShippingForm') updateShippingForm;
  @ViewChild('updateBillingForm') updateBillingForm;
  LesserYear: boolean;
  WorkPhonePatternError: boolean;
  HomePhonePatternError: boolean;
  PhonePatternError: boolean;
  pendingChurches: any = [];
  loading: boolean = false;
  serviceError:boolean = false;
  serviceMessage:string = "Loading data, Please wait."
  billingShippingTab: boolean = true;
  showBillingAddress: boolean = false;
  showShippingAddress: boolean = false;
  showProfileDetail: boolean = true;
  showGeneralEditInfo: boolean = false;
  showEditProfilePic:boolean = false;
  openDeleteChurchPopup:boolean=false;
  showBillingAddressPopOver:boolean=false;
  showShippingAddressPopOver:boolean=false;
  openPhotoUpdatePopupOver:boolean=false;
  addressStyle: any;
  originalstreet: any;
  suggestedStreet:any;
  originalCityState: any;
  suggestedCityState:any;
  originalAddressSelection:any;
  suggestedAddressSelection:any;
  state = 'show'
  results: any;
  searchTerm$ = new Subject<string>();
  addressSuggestion: any = [];
  enableBillingAddress: boolean = false;
  enableShippingAddress: boolean = false;
  churchName;
  model = {
    FirstName: '',
    LastName: '',
    Phone: '',
    MailingStreet: '',
    MailingCity: '',
    MailingPostalCode: ''
  };
  passId;
  passAccountId;
  deleteUserFromChurch:boolean=false;
  messages = myProfileLabelsAndMessages;
  choosenMonthCount: number = 31;
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
          if(parseInt(this.userProfile.date) > dateValue.length){
            this.userProfile.date = '01';
          }
          return dateValue;
        }
        else{
          dateValue.splice(-3);
          if(parseInt(this.userProfile.date) > dateValue.length){
            this.userProfile.date = '01';
          }
          return dateValue;
        }
    }
  }
  choosenYearCount: number = new Date().getFullYear();
  ApplyBillingToShipping:boolean = false;
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
  currentMessageObsSubscribe:Subscription;
  changeMessageObsSubscribe:Subscription;
  removeChurchButton:boolean = true;
  //date formatter
  dateFormat(date) {
    var z= date.split("-").join("/");
    var d = new Date(z),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [month, day, year].join('-');
  }
  //creating function to get year in the year dropdown list
  createYearRange(number) {
    var itemss = [];
    for (var j = number; j >= 1920; j--) {
      let d=""+j;
      itemss.push(d);
    }
    return itemss;
  }
  //if user tries to change year, remove lesser year message
  clearLesserYear() {
    if (this.userProfile.year == '') {
      this.LesserYear = false;
    }
  }
  error = {};
  message;
  profileInputValidations = profileInputValidations;
  commonRegex = commonRegex;
  openEditFormDetails: boolean = false;
  serverError: boolean = false;
  errorMsg: string;
  updateSuccess: boolean = false;
  userProfile = new User();
  addressSuggession = new suggestAddress();
  profilePictureUpdate: boolean = false;
  States: Array<Object>;
  @Input() profilePic: string = '/assets/img/Default_Profile_Img.png';
  showDialog: boolean = false;
  phoneNumberConverter: PhoneNumberConverter = new PhoneNumberConverter();
  receiveMessage($event) {
    this.showDialog = $event;
  }
  openDialog() {
    this.showDialog = true;
  }

  imageData: any;
  imageName: string = "";
  cropperSettings: CropperSettings;
  cropPhotoPopup:boolean = false;
  profileFileGetterImage:any;

  constructor(
    private common: CommonService,
    private profile: ProfileService,
    private router: Router,
    public el: ElementRef,
    private searchService: SearchService,
    windowScrolling: WindowScrolling,
    private alertService: AlertService
  ) {
      this.cropperSettings = new CropperSettings();
      this.cropperSettings.width = 100;
      this.cropperSettings.height = 100;
      this.cropperSettings.croppedWidth = 100;
      this.cropperSettings.croppedHeight = 100;
      this.cropperSettings.canvasWidth = 250;
      this.cropperSettings.canvasHeight = 250;
      this.cropperSettings.allowedFilesRegex = /.(jpe?g|png)$/i;

      this.imageData = {};
      this.windowScrolling = windowScrolling;
    // For each keyup event this will subscribe the obervable subject and update the results from SmartyStreets
        if(this.searchTerm$)
        {
        this.searchService.searchAddress(this.searchTerm$)
        .subscribe(
        (result: any) => {
          if(!result.suggestAddressResponse || result.message)
          {
            this.addressSuggestion= [];
          }else {
            if (result.suggestAddressResponse.suggestion.length > 0)
            {
              this.addressSuggestion= [];
              let resultObj = JSON.stringify(result);
              let addresses = JSON.parse(resultObj);
              for (let i = 0; i < addresses.suggestAddressResponse.suggestion.length; i++) {
                let addressSuggestion = {
                                          "name": null,
                                          "street":null,
                                          "city": null,
                                          "state": null
                                        };
                addressSuggestion.name = addresses.suggestAddressResponse.suggestion[i].text;
                addressSuggestion.street = addresses.suggestAddressResponse.suggestion[i].streetLine;
                addressSuggestion.city = addresses.suggestAddressResponse.suggestion[i].city;
                addressSuggestion.state = addresses.suggestAddressResponse.suggestion[i].state;
                this.addressSuggestion.push(addressSuggestion);
              }
            }else
            {
              this.addressSuggestion= [];
            }
          }

        },
        (error: HttpErrorResponse) => {
          this.addressSuggestion= [];
          this.alertService.error(ErrorMessages.serviceError, true);
        }
      );
    }
   }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const componentPosition = this.el.nativeElement.offsetTop
    const scrollPosition = window.pageYOffset
    if (scrollPosition <= 400) {
      this.state = 'show'
     }
    else {
      this.state = 'hide'
    }

  }

  profileUpdate() {
    if (!this.profile.currentProfile.user.UID) {
      this.profile.currentProfile = JSON.parse(localStorage.getItem('profile'));
    }
    if (this.profile.currentProfile) {
      if (this.profile.currentProfile.selectedprofile == 'user') {
        if(this.profile.currentProfile.user.photoURL)
        {
          this.profilePic = this.profile.currentProfile.user.photoURL;
        }
        else{
          this.profilePic="assets/img/Default_Profile_Img.png";
        }
      }
        else {
        this.profilePic = this.profile.currentProfile.church.photoURL;
      }
    }
    this.getFormData();
  }
  newMessage() {
    this.profile.changeMessage("default message")
  }
  ngOnInit() {
    this.profile.currentProfile.selectedprofile = "user";
    this.profile.profileUpdate();
    if(localStorage.getItem('profileUpdate')=='true'){
      this.alertService.success(this.messages.messages.profileUpdate, true);
     // this.updateSuccess=true;
      setTimeout(()=>{
       // this.updateSuccess=false;
        localStorage.removeItem('profileUpdate');
      },3000);
    }
    this.currentMessageObsSubscribe = this.profile.currentMessage.subscribe(
      message => {
        this.message = message;
        if (this.message == 'Hello from Sibling') {
          this.openEditFormDetails = false;
        }
        else {
          this.openEditFormDetails = true;
          this.message = 'default message';
        }
      }
    )
    this.currentMessageObsSubscribe = this.profile.currentMessage.subscribe(
      (data: string) => {
        if (data === "Edit General" && this.router.url == "/profile/detail/edit-general") {
          this.editGeneralAddress();
        }
        else {

        }
      }
    )

    this.currentMessageObsSubscribe = this.profile.currentMessage.subscribe(
      (data: string) => {
        if (data === "Edit General" && this.router.url == "/profile/detail/edit-profile-pic") {
          this.editProfilePic();
        }
        else {

        }
      }
    )
    
    this.loading = true;
    this.serviceError = true;
    if(this.router.url=="/profile/detail/edit"){
      this.openEditFormDetails = true;
    }
    else if(this.router.url == "/profile/detail/edit-general"){
      this.editGeneralAddress();
    }
    else if( this.router.url == "/profile/detail/edit-billing"){
      this.editBillingAddress();
    }
    else if(this.router.url == "/profile/detail/edit-shipping"){
      this.editShippingAddress();
    }
    else if(this.router.url == "/profile/detail/edit-profile-pic"){
      this.editProfilePic();
    }
    else if(this.router.url == "/profile/detail"){
      this.openEditFormDetails = false;
      this.GeneralCloseEditForm();
    }
    this.getMyChurchData();
    window.scrollTo(0, 0);
    this.getStates();
    this.getToken();
    this.profileUpdate();
   this.changeMessageObsSubscribe =  this.profile.change.subscribe(
      result => {
        /** Routing Logic fromchurch to user profile */
        if (
          this.router.url == '/profile/detail' ||
          this.router.url == '/church/profile'
        ) {
          if (this.profile.currentProfile.selectedprofile == 'user') {
            this.router.navigate(['/profile/detail']);
            this.profileUpdate();
          } else if (this.profile.currentProfile.selectedprofile == 'church') {
            this.router.navigate(['/church/profile']);
          }
        }
      },
      (error: any) => {
        this.alertService.error(ErrorMessages.observableError, true);
      }
    );
    //getting previous values on initialisation--this would be updated once 'apply billing to all'is checked
    this.profile.getUserInfoProfile().subscribe(
      (result: any) => {
        if (result) {
          this.previousValues=result.userProfileDetails;
        }
      },
      error => {
        this.alertService.error(ErrorMessages.serviceError, true);
      }
    );
  }

  ngOnDestroy(){
    this.currentMessageObsSubscribe.unsubscribe();
    this.changeMessageObsSubscribe.unsubscribe();
  }
  getToken() {
    return localStorage.getItem('token');
  }

  getFormData() {
    if(this.openEditAddressesPopup){
      this.loading=false;
    }
    else{
      this.loading = true;
    }
    this.serviceError = true;
    if (this.profile.currentProfile) {
      if (this.profile.currentProfile.user.UID) {
        this.profile.getUserInfoProfile().subscribe(
          (result: any) => {
            if (result) {
              this.userProfile = result.userProfileDetails;
              var gettingdateofBirth = result.userProfileDetails.Birthdate.split("-");
              this.userProfile.year = gettingdateofBirth[0];
              this.userProfile.month = gettingdateofBirth[1];
              this.userProfile.date = gettingdateofBirth[2];
              this.userProfile.BillingCountry = 'United States';
              this.userProfile.ShippingCountry = 'United States';
              this.passId=result.userProfileDetails.Id;
              this.passAccountId=result.userProfileDetails.AccountId;
            }
            this.loading = false;
            this.serviceError = false;
          },
          error => {
            this.loading = false;
            this.serviceError = false;
            this.alertService.error(ErrorMessages.serviceError, true);
            // Error statement
          }
        );
      }
    }
  }

  getStates() {
    this.common.getStates().subscribe(
      (result: any) => {
        this.States = result.data.state;
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.serviceError = false;
        this.alertService.error(ErrorMessages.serviceError, true);
      }
    );
  }

  //updating shipping address same as billing address functionality
  updateAddrs(event){

    if(event.target.checked){
      this.ApplyBillingToShipping = true;
      this.userProfile.ShippingStreet_1=this.userProfile.BillingStreet_1;
      this.userProfile.ShippingStreet_2=this.userProfile.BillingStreet_2;
      this.userProfile.ShippingStreet_3=this.userProfile.BillingStreet_3;
      this.userProfile.ShippingCity=this.userProfile.BillingCity;
      this.userProfile.ShippingState=this.userProfile.BillingState;
      this.userProfile.ShippingPostalCode=this.userProfile.BillingPostalCode;
      this.userProfile.ShippingCountry=this.userProfile.ShippingCountry;

    }
    else{
      this.ApplyBillingToShipping = false;
      this.userProfile.ShippingStreet_1=this.previousValues.ShippingStreet_1;
      this.userProfile.ShippingStreet_2=this.previousValues.ShippingStreet_2;
      this.userProfile.ShippingStreet_3=this.previousValues.ShippingStreet_3;
      this.userProfile.ShippingCity=this.previousValues.ShippingCity;
      this.userProfile.ShippingState=this.previousValues.ShippingState;
      this.userProfile.ShippingPostalCode=this.previousValues.ShippingPostalCode;
      this.userProfile.ShippingCountry='United States';
    }
  }

  updateProfile(form) {
    let userData = this.userProfile;
    let enteredDate = new Date(userData.year + "/" + userData.month + "/" + userData.date);
    var d1 = new Date();
    var one_day = 1000 * 60 * 60 * 24;
    let reducDate = d1.getTime() - enteredDate.getTime();
    let diffDate = Math.round(reducDate / one_day);
    if (diffDate > 4745) {
      let profileObj = {
        //added as per new designs requirement
        AccountId:this.passAccountId,
        FirstName: userData.FirstName,
        LastName: userData.LastName,
        MobilePhone: userData.MobilePhone,
        HomePhone: userData.HomePhone,
        WorkPhone: userData.WorkPhone,
        BillingStreet_1: userData.BillingStreet_1,
        BillingStreet_2: userData.BillingStreet_2,
        BillingStreet_3: userData.BillingStreet_3,
        BillingCity: userData.BillingCity,
        BillingState: userData.BillingState,
        BillingPostalCode: userData.BillingPostalCode,
        BillingCountry: userData.BillingCountry,
        ShippingStreet_1: userData.ShippingStreet_1,
        ShippingStreet_2: userData.ShippingStreet_2,
        ShippingStreet_3: userData.ShippingStreet_3,
        ShippingCity: userData.ShippingCity,
        ShippingState: userData.ShippingState,
        ShippingPostalCode: userData.ShippingPostalCode,
        ShippingCountry: userData.ShippingCountry,
        BirthDate: userData.year + "-" + userData.month + "-" + userData.date,
        UID: this.profile.currentProfile.user.UID
      };
     let ContactId=this.passId;
      this.profile.UpdateUserInfo(ContactId, profileObj).subscribe(
        (result: any) => {
          if (result) {
              this.profile.currentProfile.user.FirstName = profileObj.FirstName;
              this.profile.currentProfile.user.LastName = profileObj.LastName;
              //extra parameters adding to show in general information page
              this.profile.currentProfile.user.MobilePhone = profileObj.MobilePhone;
              this.profile.currentProfile.user.HomePhone = profileObj.HomePhone;
              this.profile.currentProfile.user.WorkPhone = profileObj.WorkPhone;
              this.profile.currentProfile.user.BillingStreet_1 = profileObj.BillingStreet_1;
              this.profile.currentProfile.user.BillingStreet_2 = profileObj.BillingStreet_2;
              this.profile.currentProfile.user.BillingStreet_3 = profileObj.BillingStreet_3;
              this.profile.currentProfile.user.BillingCity = profileObj.BillingCity;
              this.profile.currentProfile.user.BillingState = profileObj.BillingState;
              this.profile.currentProfile.user.BillingPostalCode = profileObj.BillingPostalCode;
              this.profile.currentProfile.user.BillingCountry = profileObj.BillingCountry;
              this.profile.currentProfile.user.ShippingStreet_1 = profileObj.ShippingStreet_1;
              this.profile.currentProfile.user.ShippingStreet_2 = profileObj.ShippingStreet_2;
              this.profile.currentProfile.user.ShippingStreet_3 = profileObj.ShippingStreet_3;
              this.profile.currentProfile.user.ShippingCity = profileObj.ShippingCity;
              this.profile.currentProfile.user.ShippingState = profileObj.ShippingState;
              this.profile.currentProfile.user.ShippingPostalCode = profileObj.ShippingPostalCode;
              this.profile.currentProfile.user.ShippingCountry = profileObj.ShippingCountry;
              this.profile.currentProfile.user.Birthdate = profileObj.BirthDate;
              localStorage.setItem(
                'profile',
                JSON.stringify(this.profile.currentProfile)
              );
              this.profile.profileUpdate();
              this.profilePictureUpdate = false;
              this.serverError = false;
              this.serviceError = false;
              localStorage.setItem('profileUpdate','true');
              this.closeEditForm();
              this.GeneralCloseEditForm();
              this.alertService.success(this.messages.messages.profileUpdate, true);
            }
           else {
          }
        },
        (error: HttpErrorResponse) => {
          this.profilePictureUpdate = false;
          this.updateSuccess = false;
          this.loading = false;
          this.serviceError = false;
          this.alertService.error(ErrorMessages.serviceError, true);
        }
      );
      window.scrollTo(0, 0);
    }
    else {
      this.loading = false;
      this.alertService.warning(this.messages.messages.lesserYear, true);
      this.openEditFormDetails = true;
      this.getFormData();
    }
  }
// Update mobile
updateMobileGeneralProfile() {
  this.loading = true;
  this.serviceError = true;
  let userData = this.userProfile;
  let enteredDate = new Date(userData.year + "/" + userData.month + "/" + userData.date);
  var d1 = new Date();
  var one_day = 1000 * 60 * 60 * 24;
  let reducDate = d1.getTime() - enteredDate.getTime();
  let diffDate = Math.round(reducDate / one_day);
  if (diffDate > 4745) {
    let profileObj = {
      //added as per new designs requirement
      AccountId:this.passAccountId,
      FirstName: userData.FirstName,
      LastName: userData.LastName,
      MobilePhone: userData.MobilePhone,
      HomePhone: userData.HomePhone,
      WorkPhone: userData.WorkPhone,
      BirthDate: userData.year + "-" + userData.month + "-" + userData.date,
      UID: this.profile.currentProfile.user.UID
    };
   let ContactId=this.passId;
    this.profile.UpdateUserInfoMobile(ContactId, profileObj).subscribe(
      (result: any) => {
        this.loading = false;
        if (result) {
            this.profile.currentProfile.user.FirstName = profileObj.FirstName;
            this.profile.currentProfile.user.LastName = profileObj.LastName;
            //extra parameters adding to show in general information page
            this.profile.currentProfile.user.MobilePhone = profileObj.MobilePhone;
            this.profile.currentProfile.user.HomePhone = profileObj.HomePhone;
            this.profile.currentProfile.user.WorkPhone = profileObj.WorkPhone;
            this.profile.currentProfile.user.Birthdate = profileObj.BirthDate;
            this.profile.profileUpdate();
            this.profilePictureUpdate = false;
            this.serverError = false;
            this.serviceError = false;
            this.GeneralCloseEditForm();
            this.alertService.success(this.messages.messages.profileUpdate, true);
          }
        else {
        }
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.profilePictureUpdate = false;
        this.updateSuccess = false;
        this.serviceError = false;
        this.alertService.error(ErrorMessages.serviceError, true);
      }
    );
    window.scrollTo(0, 0);
  }
  else {
    this.loading = false;
    this.alertService.warning(this.messages.messages.lesserYear, true);
    this.openEditFormDetails = true;
    this.getFormData();
  }
}

updateMobileBillingProfile() {
  this.loading = true;
  this.serviceError = true;
  let userData = this.userProfile;
  let profileObj = {
      //added as per new designs requirement
      AccountId:this.passAccountId,
      BillingStreet_1: userData.BillingStreet_1,
      BillingStreet_2: userData.BillingStreet_2,
      BillingStreet_3: userData.BillingStreet_3,
      BillingCity: userData.BillingCity,
      BillingState: userData.BillingState,
      BillingPostalCode: userData.BillingPostalCode,
      BillingCountry: userData.BillingCountry,
      UID: this.profile.currentProfile.user.UID
    };
   let ContactId=this.passId;
   if(this.ApplyBillingToShipping){
     this.updateMobileShippingProfile();
   }
    this.profile.UpdateUserInfoMobile(ContactId, profileObj).subscribe(
      (result: any) => {
        this.loading = false;
        this.serviceError = false;
        if (result) {
            this.profile.currentProfile.user.BillingStreet_1 = profileObj.BillingStreet_1;
            this.profile.currentProfile.user.BillingStreet_2 = profileObj.BillingStreet_2;
            this.profile.currentProfile.user.BillingStreet_3 = profileObj.BillingStreet_3;
            this.profile.currentProfile.user.BillingCity = profileObj.BillingCity;
            this.profile.currentProfile.user.BillingState = profileObj.BillingState;
            this.profile.currentProfile.user.BillingPostalCode = profileObj.BillingPostalCode;
            this.profile.currentProfile.user.BillingCountry = profileObj.BillingCountry;
            this.profile.profileUpdate();
            this.profilePictureUpdate = false;
            this.serverError = false;
            this.GeneralCloseEditForm();
            //used to close popup if popup was opened
            if(this.openEditAddressesPopup){
              this.closeEditAddressForm();
            }
            this.alertService.success(this.messages.messages.profileUpdate, true);
          }
         else {
        }
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.profilePictureUpdate = false;
        this.updateSuccess = false;
        this.serviceError = false;
        this.alertService.error(ErrorMessages.serviceError, true);
      }
    );
    window.scrollTo(0, 0);
}

updateMobileShippingProfile() {
  this.loading = true;
  this.serviceError = true;
  let userData = this.userProfile;
    let profileObj = {
      //added as per new designs requirement
      AccountId:this.passAccountId,
      ShippingStreet_1: userData.ShippingStreet_1,
      ShippingStreet_2: userData.ShippingStreet_2,
      ShippingStreet_3: userData.ShippingStreet_3,
      ShippingCity: userData.ShippingCity,
      ShippingState: userData.ShippingState,
      ShippingPostalCode: userData.ShippingPostalCode,
      ShippingCountry: userData.ShippingCountry
    };
   let ContactId=this.passId;
    this.profile.UpdateUserInfoMobile(ContactId, profileObj).subscribe(
      (result: any) => {
        this.loading = false;
        this.serviceError = false;
        if (result) {
            this.profile.currentProfile.user.ShippingStreet_1 = profileObj.ShippingStreet_1;
            this.profile.currentProfile.user.ShippingStreet_2 = profileObj.ShippingStreet_2;
            this.profile.currentProfile.user.ShippingStreet_3 = profileObj.ShippingStreet_3;
            this.profile.currentProfile.user.ShippingCity = profileObj.ShippingCity;
            this.profile.currentProfile.user.ShippingState = profileObj.ShippingState;
            this.profile.currentProfile.user.ShippingPostalCode = profileObj.ShippingPostalCode;
            this.profile.currentProfile.user.ShippingCountry = profileObj.ShippingCountry;
            this.profile.profileUpdate();
            this.profilePictureUpdate = false;
            this.serverError = false;
            this.GeneralCloseEditForm();
            //used to close popup if popup was opened
            if(this.openEditAddressesPopup){
              this.closeEditAddressForm();
            }
            this.alertService.success(this.messages.messages.profileUpdate, true);
          }
        else {
        }
      },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.profilePictureUpdate = false;
        this.updateSuccess = false;
        this.errorMsg = error.message;
        this.serviceError = false;
        this.alertService.error(ErrorMessages.serviceError, true);
      }
    );
    window.scrollTo(0, 0);
}
  onFileChange($event) {
    if ($event.target.files[0]) {
      let formData = new FormData();
      formData.append('userId', this.profile.currentProfile.user.UID);
      formData.append(
        'profilepic',
        $event.target.files[0],
        $event.target.files[0].name
      );
      //formData.append('profilePicUrl', $event.target.files[0].name);
      // formData.append('userKey', environment.app_userkey);
      // formData.append('secret', environment.app_secret);
      this.loading = true;
      this.serviceError = true;
      this.profile.updateProfilePic(formData).subscribe((result:any) => {
        this.loading = false;
        if (result) {
          this.serviceError = false;
          let profile = result.data['profile'];
          this.profilePic = profile['photoURL'];
          this.profile.currentProfile.user.photoURL = profile['photoURL'];
          this.profile.currentProfile.user.thumbnailURL = profile['thumbnailURL'];
          localStorage.setItem('profile',JSON.stringify(this.profile.currentProfile));
          this.profile.profileUpdate();
          this.alertService.success(this.messages.messages.pictureupdate, true);
          // setTimeout(() => {
          //   this.profilePictureUpdate = true;
          // }, 1000);

          // setTimeout(() => {
          //   this.profilePictureUpdate = false;
          // }, 6000);
          this.updateSuccess = false;
          this.serverError = false;
        } else {
          
        }
      },(error: HttpErrorResponse) => {
        this.loading = false;
        this.profilePictureUpdate = false;
        this.updateSuccess = false;
        //this.errorMsg = error.message;
        this.serviceError = false;
        this.alertService.error(ErrorMessages.serviceError, true);
      }
    );
    }
  }
  //opening edit form and closing generaral information
  openEditForm() {
    this.openEditFormDetails = true;
    this.router.navigate(["profile/detail/edit"]);
  }

  //close edit form
  closeEditForm() {
    this.openEditFormDetails = false;
    this.router.navigate(["profile/detail"]);
  }

  //show pending list of churches in my Profile page
  getMyChurchData() {
    let data: any;
    if (this.profile.currentProfile) {
      data = {
        contactid: this.profile.currentProfile.user.ContactId
      };
    }
    this.profile.getchurchs(data).subscribe((result: any) => {
      if (result) {
        this.loading = false;
        this.serviceError = false;
        this.pendingChurches = result.churchList.records;
      }
    },
      (error: HttpErrorResponse) => {
        this.loading = false;
        this.serviceError = false;
        this.alertService.error(ErrorMessages.serviceError, true);
      });
  }

  //check mobile format in blur
  checkMobileFormat(phone) {
    let pattern = /(\(\d{3}\) )?(\s\d{3}-){1,2}(\d{4})/;
    if (phone !== '') {
      if (pattern.test(phone)) {
        this.PhonePatternError = false;
      }
      else {
        this.PhonePatternError = true;
      }
    }
    else {
      this.PhonePatternError = false;
    }
  }
  //removing the errors if any for mobile number
  checkPhone() {
    let pattern = /(\(\d{3}\) )?(\s\d{3}-){1,2}(\d{4})/;
    if (this.PhonePatternError = false && pattern.test(this.userProfile.MobilePhone)) {
      this.PhonePatternError = true;
    }
    else {
      this.PhonePatternError = false;
    }
  }
  //check home phone number format in blur
  checkHomeFormat(phone) {
    let pattern = /(\(\d{3}\) )?(\s\d{3}-){1,2}(\d{4})/;
    if (phone !== '') {
      if (pattern.test(phone)) {
        this.HomePhonePatternError = false;
      }
      else {
        this.HomePhonePatternError = true;
      }
    }
    else {
      this.HomePhonePatternError = false;
    }
  }
  //removing the errors if any for home number
  checkHomePhone() {
    let pattern = /(\(\d{3}\) )?(\s\d{3}-){1,2}(\d{4})/;
    if (this.HomePhonePatternError = false && pattern.test(this.userProfile.HomePhone)) {
      this.HomePhonePatternError = true;
    }
    else {
      this.HomePhonePatternError = false;
    }
  }
  //check work phone number format in blur
  checkWorkFormat(phone) {
    let pattern = /(\(\d{3}\) )?(\s\d{3}-){1,2}(\d{4})/;
    if (phone !== '') {
      if (pattern.test(phone)) {
        this.WorkPhonePatternError = false;
      }
      else {
        this.WorkPhonePatternError = true;
      }
    }
    else {
      this.WorkPhonePatternError = false;
    }
  }
  //removing the errors if any for work number
  checkWorkPhone() {
    let pattern = /(\(\d{3}\) )?(\s\d{3}-){1,2}(\d{4})/;
    if (this.WorkPhonePatternError = false && pattern.test(this.userProfile.WorkPhone)) {
      this.WorkPhonePatternError = true;
    }
    else {
      this.WorkPhonePatternError = false;
    }
  }
  DeleteChurch(selectedChurch){
    this.windowScrolling.disable();
    this.openDeleteChurchPopup=true;
    this.selectedChurch=selectedChurch;
    this.churchName=this.selectedChurch.npe5__Organization__r.Name;
    this.churchStreetName1=this.selectedChurch.npe5__Organization__r.Physical_Street_1__c;
    this.churchStreetName2=this.selectedChurch.npe5__Organization__r.Physical_Street_2__c;
    this.churchStreetName3=this.selectedChurch.npe5__Organization__r.PhysicalStreet3__c;
    this.churchCity=this.selectedChurch.npe5__Organization__r.Physical_City__c;
    this.churchState=this.selectedChurch.npe5__Organization__r.Physical_State__c;
    //this.churchCountry=this.selectedChurch.npe5__Organization__r.BillingCountry;
    this.churchPostalCode=this.selectedChurch.npe5__Organization__r.Physical_Zip__c;
    this.awanaRole=this.selectedChurch.Awana_Role__c;
  }

  closeRemoveChurchPopup(){
      this.openDeleteChurchPopup=false;
      this.windowScrolling.enable();
  }
  //This function is used to remove church from profile
  removeChurchProfile() {
    this.removeChurchButton = false;
    this.loading = true;
    this.deleteUserFromChurch=true;
    this.disableCrossIcon=true;
    let data = {
      "AffiliationId": this.selectedChurch.Id
    }
    if(this.deleteUserFromChurch==true){
      this.profile.removeChurch(data).subscribe((result: any) => {
        if (result && result.removeUserAffiliation) {
          this.getMyChurchData();
          //this.openDeleteChurchPopup=false;
          if (this.selectedChurch.npe5__Status__c == 'Current') {
            this.dataToCallChurchAgain();
          }
        }
        this.closeRemoveChurchPopup();
        this.removeChurchButton = true;
        this.loading = false;
        this.alertService.success(this.messages.messages.churchDeleteSuccess + " "+ this.churchName , true);
        this.disableCrossIcon=false;
      },
        (error: HttpErrorResponse) => {
          this.loading = false;
          this.removeChurchButton = true;
          this.alertService.error(ErrorMessages.serviceError, true);
          this.disableCrossIcon=false;
      });
    }
    else{
      this.removeChurchButton = true;
      this.loading = false;
    }
  }

  //call service again after removing churches
  dataToCallChurchAgain() {
    this.profile.callChurchService("call church service again");
  }
  //Edit Billing Mobile
  editBillingAddress() {
    this.showBillingAddress = true;
    this.showShippingAddress = false;
    this.showProfileDetail = false;
    this.common.backHeader = true;
    this.showGeneralEditInfo = false;
    this.showEditProfilePic = false;
    this.common.backHeaderName = "Edit Billing Address";
    this.hideProfileHead();
    this.router.navigate(["profile/detail/edit-billing"]);
  }
  //Edit Shipping Mobile
  editShippingAddress() {
    this.showShippingAddress = true;
    this.showBillingAddress = false;
    this.showProfileDetail = false;
    this.common.backHeader = true;
    this.showGeneralEditInfo = false;
    this.showEditProfilePic = false;
    this.common.backHeaderName = "Edit Shipping Address";
    this.hideProfileHead();
    this.router.navigate(["profile/detail/edit-shipping"]);
  }
  //Edit General Mobile
  editGeneralAddress(){
    this.showGeneralEditInfo = true;
    this.showShippingAddress = false;
    this.showBillingAddress = false;
    this.showProfileDetail = false;
    this.showEditProfilePic = false;
    this.common.backHeader = true;
    this.common.backHeaderName = "Edit General Information";
    this.hideProfileHead();
    this.router.navigate(["profile/detail/edit-general"]);
  }
  //Edit Profile Pic
  editProfilePic(){
    this.showGeneralEditInfo = false;
    this.showShippingAddress = false;
    this.showBillingAddress = false;
    this.showProfileDetail = false;
    this.showEditProfilePic = true;
    this.common.backHeader = true;
    this.common.backHeaderName = "Change Photo";
    this.hideProfileHead();
    this.router.navigate(["profile/detail/edit-profile-pic"]);
  }
  hideProfileHead() {
    this.common.showHeaderProfile = false;
    this.common.showSidebar = "hidden";

  }
  showProfileHead() {
    this.common.showHeaderProfile = true;
    this.common.showSidebar = "hidden";
    this.common.churchHeader = false;
  }
  // General Close Form - Mobile
  GeneralCloseEditForm() {
    this.showProfileDetail = true;
    this.showShippingAddress = false;
    this.showBillingAddress = false;
    this.showGeneralEditInfo = false;
    this.common.backHeader = false;
    this.common.showHeaderProfile = true;
    this.common.churchHeader = false;
    this.profile.currentProfile.selectedprofile == "user";
  }
  // Delete Shipping Billing Address
  deleteBillinShippinAddress(Address) {
    if (Address === 'shipping') {
      this.userProfile.ShippingStreet_1 = '';
      this.userProfile.ShippingStreet_2 = '';
      this.userProfile.ShippingStreet_3 = '';
      this.userProfile.ShippingCity = '';
      this.userProfile.ShippingPostalCode = '';
      this.userProfile.ShippingState = '';
      this.userProfile.ShippingCountry = '';
      this.updateMobileShippingProfile();
    }
    else if (Address === 'billing') {
      this.userProfile.BillingStreet_1 = '';
      this.userProfile.BillingStreet_2 = '';
      this.userProfile.BillingStreet_3 = '';
      this.userProfile.BillingCity = '';
      this.userProfile.BillingState = '';
      this.userProfile.BillingPostalCode = '';
      this.userProfile.BillingCountry = '';
      this.updateMobileBillingProfile();
    }
  }
  // Just to hide the div element while clicking the close button
  closeSuggession()
  {
    this.showBillingAddressPopOver = false;
    this.showShippingAddressPopOver = false;
  }

  // Based on radio button selection, Original or Sugested values will be assigned to the corresponding text fields
  onSelectionChange(id)
  {
    if(id == 'Original')
    {
      this.originalAddressSelection = 'Original';
      this.suggestedAddressSelection = '';
    }
    else{
      this.suggestedAddressSelection = 'Suggested';
      this.originalAddressSelection = '';
    }
  }

  // Based on radio button selection, Original or Sugested values will be assigned to the corresponding text fields
  continueSuggession(type)
  {
    this.showBillingAddressPopOver = false;
    this.showShippingAddressPopOver = false;

    if(type == 'billing')
    {
    if(this.suggestedAddressSelection == 'Suggested')
    {
      this.userProfile.BillingStreet_1 = this.addressSuggession.suggestedStreet;
      this.userProfile.BillingCity = this.addressSuggession.suggestedCity;
      this.userProfile.BillingState = this.addressSuggession.suggestedState;
      this.userProfile.BillingPostalCode = this.addressSuggession.suggestedZipcode
    }
  }
    if (type == 'shipping')
    if(this.suggestedAddressSelection == 'Suggested')
    {
      this.userProfile.ShippingStreet_1 = this.addressSuggession.suggestedStreet;
      this.userProfile.ShippingCity = this.addressSuggession.suggestedCity;
      this.userProfile.ShippingState = this.addressSuggession.suggestedState;
      this.userProfile.ShippingPostalCode = this.addressSuggession.suggestedZipcode
    }

  }

 // This function is used to not show the list of address entries if clicked outside the
  onClickedOutside(e: Event) {
    this.enableBillingAddress= false;
    this.enableShippingAddress = false;
  }

    //This function is used to empty Address Entries from Address Line 1 if the focus out of street line 1
    emptyAddressEntries()
      {
        this.enableBillingAddress= false;
        this.enableShippingAddress = false;
      }

  // This function is used to fill the address selected by user into Street 1, City and State
  completeAddress(street,city,state,type){

     if(type == 'billing')
    {
      this.userProfile.BillingStreet_1 = street;
      this.userProfile.BillingCity = city;
      this.userProfile.BillingState = state;
      this.addressSuggestion= [];
      this.enableBillingAddress = false;
    } else {
      this.userProfile.ShippingStreet_1 = street;
      this.userProfile.ShippingCity = city;
      this.userProfile.ShippingState = state;
      this.addressSuggestion= [];
      this.enableShippingAddress = false;
    }
    let data = {
      street: street,
      city: city,
      state: state
    };

    this.profile.getPostalcode(data).subscribe(
      (result: any) => {
        if (!result.suggestZipcodeResponse.zipcode) {
        }else{
          if(type == 'billing')
          {
          this.userProfile.BillingPostalCode= result.suggestZipcodeResponse.zipcode+result.suggestZipcodeResponse.pluscode;
          } else
          {
            this.userProfile.ShippingPostalCode= result.suggestZipcodeResponse.zipcode+result.suggestZipcodeResponse.pluscode;
          }
        }
      },
      error => {
        this.loading = false;
        this.alertService.error(ErrorMessages.serviceError, true);
      }
    );
  }

  // This function is used to show the complete address entries in BillingStreet 1 field or BillingStreet field 2
  enableAddress(type){
    if(type == 'billing')
    {
    this.enableBillingAddress = true;
    this.enableShippingAddress = false;
    }
    else{
      this.enableShippingAddress = true;
      this.enableBillingAddress = false;
    }
  }

  // Fetch the Zipcode using Zipcode API
  getZipCode(street_1,city,state,type) {
    this.showBillingAddressPopOver = false;
    this.showShippingAddressPopOver = false;
      let data = {
        street: street_1,
        city: city,
        state: state
      };

      this.profile.getPostalcode(data).subscribe(
        (result: any) => {
          if (!result.suggestZipcodeResponse.zipcode) {
          }else{
            if(type == 'billing')
            {
             this.userProfile.BillingPostalCode= result.suggestZipcodeResponse.zipcode+'-'+result.suggestZipcodeResponse.pluscode;
            } else
            {
              this.userProfile.ShippingPostalCode= result.suggestZipcodeResponse.zipcode+'-'+result.suggestZipcodeResponse.pluscode;
            }
          }
        },
        error => {
          this.loading = false;
          this.alertService.error(ErrorMessages.serviceError, true);
        }
      );
    }


  // Validate the US Address by Street 1 and Postal code. Based on the results from SmartyStreets
  // div element of Address suggeession will be shown
  validateAddress(street_1,street_2,street_3,city,state,postalCode,country,type) {
    this.showBillingAddressPopOver = false;
    this.showShippingAddressPopOver = false;
    if(street_1 && postalCode)
    {
      let data = {
        street: street_1,
        city: city,
        state: state,
        zipcode:postalCode
      };

      this.profile.getSuggestedAddress(data).subscribe(
        (result: any) => {
          if (result.validaddressResponse) {
            this.addressSuggession.suggestedStreet= result.validaddressResponse.suggestedStreet;
            this.addressSuggession.suggestedCity = result.validaddressResponse.suggestedCity;
            this.addressSuggession.suggestedState = result.validaddressResponse.suggestedState;
            this.addressSuggession.suggestedZipcode = result.validaddressResponse.suggestedZipcode;
            if(street_2 && !street_3)
            {
                this.originalstreet = street_1+', '+street_2;
            }
            else if(!street_2 && street_3)
            {
                this.originalstreet = street_1+', '+street_3;
            }
            else if(!street_2 && !street_3)
            {
                this.originalstreet = street_1;
            }
            else
            {
                this.originalstreet = street_1+', '+street_2+', '+street_3
            }
            this.originalCityState =city+', '+state+' '+postalCode
            this.suggestedCityState = this.addressSuggession.suggestedCity+', '+this.addressSuggession.suggestedState +' '+this.addressSuggession.suggestedZipcode

            if(street_2 && !street_3)
            {
                this.suggestedStreet = this.addressSuggession.suggestedStreet+', '+street_2;
            }
            else if(!street_2 && street_3)
            {
                this.suggestedStreet = this.addressSuggession.suggestedStreet+', '+street_3;
            }
            else if(!street_2 && !street_3)
            {
                this.suggestedStreet = this.addressSuggession.suggestedStreet;
            }
            else
            {
                this.suggestedStreet = this.addressSuggession.suggestedStreet+', '+street_2+', '+street_3
            }

            if(type == 'billing' )
            {

                if(street_1 == result.validaddressResponse.suggestedStreet && city == result.validaddressResponse.suggestedCity && state == result.validaddressResponse.suggestedState && postalCode == result.validaddressResponse.suggestedZipcode)
                {
                    this.showBillingAddressPopOver = false;
                    this.showShippingAddressPopOver = false;
                }
                else {
                    this.addressStyle = "adrs-verfy animated fadeInRight billing-address";
                    this.showBillingAddressPopOver = true;
                }
            }
            else if(type == 'shipping')
            {
              if(street_1 == result.validaddressResponse.suggestedStreet && city == result.validaddressResponse.suggestedCity && state == result.validaddressResponse.suggestedState && postalCode == result.validaddressResponse.suggestedZipcode)
              {
                  this.showShippingAddressPopOver = false;
                  this.showBillingAddressPopOver = false;
              }
              else {
                  this.addressStyle = "adrs-verfy animated fadeInRight shipping-address";
                  this.showShippingAddressPopOver = true;

              }
            }
            else {
              this.showShippingAddressPopOver = false;
              this.showBillingAddressPopOver = false;
            }
          }
        },
        error => {
          this.loading = false;
          this.alertService.error(ErrorMessages.serviceError, true);
        }
      );
    }
}

  
  profileFileGetter() {
    let __this = this;
    let element: HTMLElement = document.querySelector('.ng2-imgcrop > input') as HTMLElement;

    element.onchange = function(event?: Event){
        let file = (<HTMLInputElement>event.target).files[0];
        __this.imageName = file.name;

        if(/\.(jpe?g|png)$/i.test(__this.imageName)){
            __this.cropPhotoPopup = true;
            __this.common.backHeaderName = "Crop Your Photo";
        } else {
            __this.alertService.error(ErrorMessages.imageTypeError, true);
        }
    }
    
    element.click();
  }

  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
        type: 'image/jpg'
    });
  }

  saveProfileImage(){
    var myFile:Blob=this.dataURItoBlob(this.imageData.image);
    if (this.imageData) {
      let imageUploadData = new FormData();
      imageUploadData.append('userId', this.profile.currentProfile.user.UID);
      imageUploadData.append(
        'profilepic',
        myFile,
        this.imageName
      );
      this.loading = true;
      this.serviceError = true;
      this.profile.updateProfilePic(imageUploadData).subscribe((result:any) => {
        if (result) {
          this.loading = false;
          this.serviceError = false;
          let profile = result.data['profile'];
          this.profilePic = profile['photoURL'];
          this.profile.currentProfile.user.photoURL = profile['photoURL'];
          this.profile.currentProfile.user.thumbnailURL = profile['thumbnailURL'];
          localStorage.removeItem("profile");
          localStorage.setItem('profile',JSON.stringify(this.profile.currentProfile));
          this.profile.profileUpdate();
          this.alertService.success(this.messages.messages.pictureupdate, true);
          this.updateSuccess = false;
          this.serverError = false;
          this.openPhotoUpdatePopupOver=false; 
          this.cropPhotoPopup=false;
          this.router.navigate(['/profile/detail']);
        } else {
          console.log('error');
          this.loading = false;
        }
      },(error: HttpErrorResponse) => {
        this.loading = false;
        this.profilePictureUpdate = false;
        this.updateSuccess = false;
        this.errorMsg = error.message;
        this.serviceError = false;
        this.alertService.error(ErrorMessages.serviceError, true);
        this.openPhotoUpdatePopupOver=false; 
        this.cropPhotoPopup=false;
      }
    );
    }
  }
  //open Edit address popup in My Profile Detail Page
  openEditAddressPopup(PopupName){
    this.openEditAddressesPopup=true;
    this.windowScrolling.disable();
    this.getFormData();
    if(PopupName=='Billing'){
      console.log(this.openEditAddressesPopup);
      this.BillingAddress=true;
      this.ShippingAddress=false;
    }
    else if(PopupName=='Shipping'){
      this.ShippingAddress=true;
      this.BillingAddress=false;
    }
  }

  //delete adress from address card in My Profile Page
  deleteAddress(PopupName){

  }

  //Submit action in edit address in My Profile Page
  submitEditAddress(){
    //reset values to false after submit
    if(this.BillingAddress==true){
      this.updateMobileBillingProfile();
    }
    else if(this.ShippingAddress==true){
      this.updateMobileShippingProfile();
    }
  }

  //close edit address form in My Profile Page
  closeEditAddressPopup(){
    this.openEditAddressesPopup=false;
    this.BillingAddress=false;
    this.ShippingAddress=false;
    this.windowScrolling.enable();
  }

  //continue suggestion modified
  continueSuggestionAddress(){
    if(this.BillingAddress){
      this.continueSuggession('billing');
    }
    else if(this.ShippingAddress){
      this.continueSuggession('shipping');
    }
  }

  //close edit address form 
  closeEditAddressForm(){
    this.closeEditAddressPopup();
    this.BillingAddress=false;
    this.ShippingAddress=false;
  }
}
