import { Component, OnInit, ElementRef, Directive, HostListener, HostBinding, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService, UserAuthorizationService,CommonService, AlertService } from '../../services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { Church } from '../../model/church';
import { Currentprofile } from '../../model/currentprofile';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { UserAuthorization } from '../../model';
import { GigyaClass } from '../../util/gigya-class';
import { ErrorMessages } from '../../messages';
@Component({
  selector: 'app-app-layout-header',
  templateUrl: './app-layout-header.component.html',
  styleUrls: ['./app-layout-header.component.scss'],
  host: {
    '(document:click)': 'closeDropdown($event)',
  }
})
export class AppLayoutHeaderComponent implements OnInit, OnDestroy {
  awanaStore:string=environment.awanaStore;
  records: any;
  notificationIndex: any;
  churchId(arg0: any): any {
    throw new Error("Method not implemented.");
  }
  profilePic: string = "/assets/img/Default_Profile_Img.png";
  showProfileDropdown: boolean = false;
  showHeaderNotification:boolean=false;
  myChurchProfile: boolean = false;
  dataSource: any = [];
  churchSubscription: Subscription;
  profileChangeSubscription: Subscription;
  profileCurrentMesSubscription: Subscription;
  profileCurrentMessageOneSubscription: Subscription;
  isIndividual: boolean = true;
  isCurrentChurch: boolean = false;
  activeTab: string = "MyAccount";
  churchTitle: string = "My Church";
  userAccountActiveStatus: string = null;
  churchAccountActiveStatus: string = null;
  cProfile:object = { };
  message;
  messageOne;
  showNotificationCount:boolean=true;
  userAuthorization: UserAuthorization; // used to store the user role for autherization purpose.
  gigClass:GigyaClass;
  constructor(private router: Router, private _eref: ElementRef, private profile: ProfileService, 
    private common: CommonService, private _location: Location,
    private userAuthorizationSrvc: UserAuthorizationService , private alertService: AlertService) {
    this.profileCurrentMessageOneSubscription = this.profile.currentMessageOne.subscribe(messageOne => {
      this.messageOne = messageOne;
      console.log("messageOne", messageOne);
      if (this.messageOne == 'call church service again') {
        this.getMyChurchData();
      }
    },
    (error: any) => {
      this.alertService.error(ErrorMessages.observableError, true);
    });
    this.gigClass = new GigyaClass(this.profile);
  }
  ngOnInit() {
    this.profileChangeSubscription = this.profile.change.subscribe((result: any) => {
      console.log("Church Calling......");
      this.profileSetup();
      if (this.profile.currentProfile.selectedprofile !== "user")
      { 
        this.activeTab = 'MyChurch';
        this.churchTitle = this.profile.currentProfile.church.name;
      }     
    },
      (error: any) => {
        this.alertService.error(ErrorMessages.observableError, true);
      });
    this.profileCurrentMesSubscription = this.profile.currentMessage.subscribe(
      message => {
        this.message = message
      },
      (error: any) => {
        this.alertService.error(ErrorMessages.observableError, true);
      });
    
    if (!this.profile.currentProfile.user.UID) {
      if (localStorage.getItem('token')) {
        this.profile.currentProfile = JSON.parse(localStorage.getItem('profile'));
      } else {
        this.profile.currentProfile = new Currentprofile();
      }
    }
    if (this.profile.currentProfile) {
      if (this.profile.currentProfile.user.photoURL) {
        this.profilePic = this.profile.currentProfile.user.photoURL;
      }

      if (this.profile.currentProfile.selectedprofile == "user") {
        this.activeTab = 'MyAccount';
      } else {
        this.activeTab = 'MyChurch';
        this.churchTitle = this.profile.currentProfile.church.name;
      }
    }

    this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
    this.common.userAuthorization = this.userAuthorization;
    this.getMyChurchData();

    this.profileSetup();
    this.records=this.common.getNotificationRecords();
  }
  editUserProfile() {
    this.profile.editGeneralProf("Edit General");
  }
  editChurchProfile(){
     this.profile.changeMessage("Edit Church General");
  }
  newMessage() {
    this.profile.changeMessage("Hello from Sibling")
  }
  showSidebar() {
    console.log("hamburger clicked");
    this.common.showSidebar = "visible";
    this.common.navigationClose = "visible";
    window.scrollTo(0, 0);
    // document.body.style.overflowY = 'hidden';
  }

  showSidebarFromHeader() {
    console.log("clicked");
    this.common.showSidebar = "visible";
    this.common.navigationClose = "visible";
  
    // document.body.style.overflowY = 'hidden';
  }

  ngOnDestroy() {
    this.churchSubscription.unsubscribe();
    this.profileChangeSubscription.unsubscribe();
    this.profileCurrentMessageOneSubscription.unsubscribe();
    this.profileCurrentMesSubscription.unsubscribe();
  }
  showProfile() {
    console.log(this.showProfileDropdown);
    this.showProfileDropdown = !this.showProfileDropdown;
  }
  showNotification(){
    this.showNotificationCount=false;
    this.showHeaderNotification=!this.showHeaderNotification;
  }
  navigateBackHead() {
    this._location.back();
  }
  closeDropdown(event) {
    // console.log(event.target.tagName);
    // console.log(event.target.className);
    //  if(!this._eref.nativeElement.contains(event.target)){
    //    this.showProfileDropdown =false;
    //  }else if(event.target.tagName == "IMG"){
    //    this.showProfileDropdown =true;
    //  }else if(event.target.className == "icon-icon_arrow_down dropdown-arrow" && event.target.tagName == "SPAN"){
    //    this.showProfileDropdown =true;
    //  }else if(event.target.firstElementChild){
    //   if(event.target.firstElementChild.className == "profile-dropdown" || event.target.firstElementChild.className == "profile-img"){
    //     this.showProfileDropdown =true;
    //   }else{
    //     this.showProfileDropdown =false;
    //   }
    //  }else{
    //   this.showProfileDropdown =false;
    //  }
    const x = this.showProfileDropdown;
    const y = this.myChurchProfile;
    const z= this.showHeaderNotification;
    this.showProfileDropdown = false;
    this.myChurchProfile = false;
    this.showHeaderNotification=false;
    if (event.target.className == "img-profile" || event.target.className == "profile-img bor-radius" || event.target.className == "icon-icon_arrow_down dropdown-arrow") {
      this.showProfileDropdown = x;
    }
    if (event.target.className == "text-ellipsis church-txt" || event.target.className == "icon-icon_arrow_down dropdown-arrow icn_churh") {
      this.myChurchProfile = y;
    }
    if(event.target.className =="icon-bell-o" || event.target.className =="icons notify icon-bell-o"){
      this.showHeaderNotification = z;
      if(this.showNotificationCount==true){
        this.showNotificationCount=false;
      }
    }

  }
  logout() {
    gigya.socialize.logout({ callback: this.gigClass.onLogoutResponse.bind(this) });
  }
  /**
   * Get Church list which is display on the top of header as a dropdown.
   * 
   * */
  getMyChurchData() {
    let data: any;
    if (this.profile.currentProfile) {
      data = {
        contactid: this.profile.currentProfile.user.ContactId
      };
    }
    this.churchSubscription = this.profile.getchurchs(data).subscribe((result: any) => {
      this.dataSource = [];
      this.isCurrentChurch = false;
      for (let i = 0; i < result.churchList.records.length; i++) {
        if (result.churchList.records[i].npe5__Status__c == "Current") {
          let church = new Church();
          church.accountID = result.churchList.records[i].npe5__Organization__c;
          church.name = result.churchList.records[i].npe5__Organization__r.Name;
          church.phoneNumber = result.churchList.records[i].npe5__Organization__r.Phone;
          church.billingCity = result.churchList.records[i].npe5__Organization__r.Physical_City__c;
          church.billingCountry = result.churchList.records[i].npe5__Organization__r.PhysicalCountry__c;
          church.billingPostalCode = result.churchList.records[i].npe5__Organization__r.Physical_Zip__c;
          church.billingState = result.churchList.records[i].npe5__Organization__r.Physical_State__c;
          church.organizationOwner = result.churchList.records[i].Organization_Owner__c;
          church.authorizedPurchaser = result.churchList.records[i].Authorized_Purchaser__c;
          church.registrationLevel = result.churchList.records[i].Registration_Level__c;
          let streetStr = result.churchList.records[i].npe5__Organization__r.Physical_Street_1__c;
          if(result.churchList.records[i].npe5__Organization__r.Physical_Street_2__c){
            streetStr += " "+ result.churchList.records[i].npe5__Organization__r.Physical_Street_2__c;
          }
          if(result.churchList.records[i].npe5__Organization__r.PhysicalStreet3__c){
            streetStr += " "+ result.churchList.records[i].npe5__Organization__r.PhysicalStreet3__c;
          }
          church.billingStreet_1 = streetStr;
          if(result.churchList.records[i].Awana_Role__c)
          {
            church.role = result.churchList.records[i].Awana_Role__c.replace(';',', ');
          }
          else{
            church.role = "";
          }         
          this.dataSource.push(church);
          this.isCurrentChurch = true;
        }
      }

      //Set the all the churches data to the user authorization service.
      this.userAuthorizationSrvc.setUserChurchesData(this.dataSource);
    },
      (error: HttpErrorResponse) => {
        this.alertService.error(ErrorMessages.observableError, true);
      });
  }

  selectChurch(item) {
    this.churchTitle = item.name;
    this.myChurchProfile = false;
    this.profile.currentProfile.church = item;
    this.profile.currentProfile.selectedprofile = "church";
    localStorage.setItem('profile', JSON.stringify(this.profile.currentProfile));
    this.profile.profileUpdate();

    //check user authorization level and redirect to appropriate page
    this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
    if (this.userAuthorization.viewOrderHistory == false) {
      this.router.navigate(['/church']);
    } else {
      this.router.navigate(['/dashboard']);
    }

    
  }

  getAccountId() {
    if (localStorage.getItem('profile')) {
        let profile = JSON.parse(localStorage.getItem('profile'));
        return profile.church.accountID;
    }
  }

  selectUserProfile() {
    this.churchTitle = "My Church";
    this.activeTab = 'MyAccount';
    this.myChurchProfile = false
    this.profile.currentProfile.selectedprofile = "user";
    localStorage.setItem('profile', JSON.stringify(this.profile.currentProfile));
    this.profile.profileUpdate();
    this.router.navigate(['/dashboard']);
  }

  profileSetup() {
    if (!this.profile.currentProfile) {
      this.profile.currentProfile = JSON.parse(localStorage.getItem('profile'));
    }
    if (this.profile.currentProfile.selectedprofile == "user") {
      this.cProfile = {
        name: this.profile.currentProfile.user.FirstName + " " + this.profile.currentProfile.user.LastName,
        accountId : this.profile.currentProfile.user.AccountId,
        email : this.profile.currentProfile.user.Email,
        mobileNo : this.profile.currentProfile.user.MobilePhone,
        homeNo : this.profile.currentProfile.user.HomePhone,
        workNo : this.profile.currentProfile.user.WorkPhone,
        DOB : this.profile.currentProfile.user.Birthdate,
        profile: true
      }
      if(this.profile.currentProfile.user.photoURL){
        this.profilePic = this.profile.currentProfile.user.photoURL;
      }else{
        this.profilePic = "/assets/img/Default_Profile_Img.png";
      }
    } else {
      this.getMyChurchData();
      this.cProfile = {
        name: this.profile.currentProfile.church.name,
        street1: this.profile.currentProfile.church.billingStreet_1,
        street2:this.profile.currentProfile.church.billingStreet_2,
        street3:this.profile.currentProfile.church.billingStreet_3,
        state: this.profile.currentProfile.church.billingState,
        city: this.profile.currentProfile.church.billingCity,
        country: this.profile.currentProfile.church.billingCountry,
        postalcode: this.profile.currentProfile.church.billingPostalCode,
        profilePic: this.profile.currentProfile.church.photoURL,
        profile: false
      }
    }
  }

  /**
   * To refresh the navigation page, when user selects the 'MY PROFILE'
   * @author Siva Sanker Reddy on 30-Jan-2018.
   */
  refreshAccountProfile() {
    this.churchTitle = "My Church";
    this.activeTab = 'MyAccount';
    this.myChurchProfile = false;
    this.profile.currentProfile.selectedprofile = "user";
    localStorage.setItem('profile', JSON.stringify(this.profile.currentProfile));
    this.profile.profileUpdate();
    this.newMessage();
  }


  onFileChange($event) {
    console.log('Imhere', $event)
    if ($event.target.files[0]) {
      let formData = new FormData();
      formData.append("userId", this.profile.currentProfile.user.UID);
      formData.append("profilepic", $event.target.files[0], $event.target.files[0].name);
      
      this.profile.updateProfilePic(formData).subscribe((data) => {
        if (data) {
          let profile = data['profile'];
          this.profilePic = profile['photoURL'];
          //let obj = JSON.parse(localStorage.getItem('user'));
          this.profile.currentProfile.user.photoURL = profile['photoURL'];
          this.profile.currentProfile.user.thumbnailURL = profile['thumbnailURL'];
          localStorage.setItem('profile', JSON.stringify(this.profile.currentProfile));
          this.profile.profileUpdate();
        } else {
          console.log('error');
        }
      },
      (error: any) => {
        this.alertService.error(ErrorMessages.serviceError, true);
      });
    }
  }
  goToNotification(){
    this.router.navigate(['/notifications']);
  }
  goToParticularPage(notification){
    const existedItem = this.records.find(x => x === notification); 
    if (existedItem) {
      this.notificationIndex = this.records.indexOf(existedItem);
      this.records[this.notificationIndex].read='true';
    }
    console.log("records",this.records);
    if(notification.Page=='Recent Orders'){
      this.router.navigate(['/dashboard']);
    }
    else if(notification.Page=='Add your church'){
      this.router.navigate(['/addChurch']);
    }
    else if(notification.Page=='Order History'){
      this.router.navigate(['/order/history']);
    }
    else if(notification.Page=='My Profile'){
      this.router.navigate(['/profile/detail']);
    }
  }
}
