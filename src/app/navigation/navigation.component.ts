import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonService, ProfileService, UserAuthorizationService, AlertService } from '../services/index';
import { Church } from '../model/index';
import { Subscription } from 'rxjs/Subscription';
import { HttpErrorResponse } from '@angular/common/http';
import { navigationModuleMessages, ErrorMessages } from '../messages';
import { UserAuthorization } from '../model/user-authorization';
import { GigyaClass } from '../util/gigya-class';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  dataSource: any = [];
  cProfile = {};
  userProfile = {};
  show = true;
  isCurrentChurch: boolean = false;
  churchSubscription: Subscription;
  churchTitle: string = "My Church";
  myChurchProfile: boolean = false;
  pName: string = "user";
  showChurchOrProfile: boolean = false;
  churchSelected: boolean = false;
  messages = navigationModuleMessages;
  defaultImageChurch = "assets/img/Church_Default_Img.png";
  messageOne;
  userAuthorization: UserAuthorization; // used to store the user role for autherization purpose.
  currentElementClick: string;
  gigClass:GigyaClass;


  constructor(public route: Router, private common: CommonService, private profile: ProfileService, private userAuthorizationSrvc: UserAuthorizationService,private render:Renderer2,private alertService: AlertService
  ) {
    this.gigClass = new GigyaClass(this.profile);
    this.profile.currentMessageOne.subscribe(messageOne => {
      this.messageOne = messageOne;
      if (this.messageOne == 'call church service again') {
        this.getMyChurchData();
      }
    },
    (error: HttpErrorResponse) => {
      this.alertService.error(ErrorMessages.observableError, true);
    });
  }

  ngOnInit() {
    this.common.showSidebar = "visible";
    this.pName = this.profile.currentProfile.selectedprofile;
    this.profileSetup();
    
    this.onloadMenuSelection(this.route.url.split("/")[1]);
    this.getMyChurchData();

    this.userProfile = JSON.parse(localStorage.getItem('profile'));

    this.profile.change.subscribe((result: any) => {
      this.profileSetup();
      this.pName = this.profile.currentProfile.selectedprofile;
      if(this.route.url == "/dashboard"){
        this.show =false;
      }
    },
    (error: any) => {
      this.alertService.error(ErrorMessages.observableError, true);
    });

    if(this.route.events){
      this.route.events
      // .filter((event) => event instanceof NavigationEnd)
      .subscribe((event)=>{
        if(event['url'] == "/dashboard"){
          this.show =false;
        }
        if(event['url'] == "/church"){
          this.onloadMenuSelection('church');
        }
      },
      (error:any)=>{
        this.alertService.error(ErrorMessages.routerError, true);
      })
    }
  }

 /*
 Function Name : close
 Params        : Nil
 Functaionality: set side bar and navigation close hidden
 */
  close() {
    this.common.showSidebar = "hidden";
    this.common.navigationClose = 'hidden';
  }

 /*
 Function Name : updateShowChurchProfile
 Params        : bool
 Functaionality: set church or user profile and toggle the header based on boolean passed, Click function to display the mobile profile expand/collapse
 */
  updateShowChurchProfile(value) {
    this.showChurchOrProfile = value;
    if (value == true) {
      this.common.churchHeader = true;
    } else {
      this.common.churchHeader = false;
    }
  }

 /*
 Function Name : getAccountId
 Params        : Nil
 Functaionality: return church acount id from local storage
 */
  getAccountId() {
    if (localStorage.getItem('profile')) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      return profile.church.accountID;
    }
  }

 /*
 Function Name : profileSetup
 Params        : Nil
 Functaionality: Set up profile for user or church
 */
  profileSetup() {
    if (!this.profile.currentProfile.user.UID) {
      this.profile.currentProfile = JSON.parse(localStorage.getItem('profile'));
    }
    if (this.profile.currentProfile.selectedprofile == "user") {
      if(this.profile.currentProfile.user.photoURL)
      {
        this.profile.currentProfile.user.photoURL=this.profile.currentProfile.user.photoURL;
      }
      else{
        this.profile.currentProfile.user.photoURL="assets/img/Default_Profile_Img.png";
      }
      this.cProfile = {
        name: this.profile.currentProfile.user.FirstName + " " + this.profile.currentProfile.user.LastName,
        profilePic: this.profile.currentProfile.user.photoURL,
        profile: true
      }
    } else {
      this.getMyChurchData();
      this.cProfile = {
        name: this.profile.currentProfile.church.name,
        street: this.profile.currentProfile.church.billingStreet_1,
        state: this.profile.currentProfile.church.billingState,
        city: this.profile.currentProfile.church.billingCity,
        country: this.profile.currentProfile.church.billingCountry,
        postalcode: this.profile.currentProfile.church.billingPostalCode,
        profilePic: this.defaultImageChurch,
        profile: false
      }
      //get user Authorization Level, which will be used in html.
      this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
    }
  }

  
 /*
 Function Name : navigationListClick
 Params        : data (name of list clicked)
 Functaionality: Toggles side bar and shows current clicked element
 */
  navigationListClick(data){
    if(this.currentElementClick == data ){
      this.show = !this.show;
    }else if(this.currentElementClick != data && this.show==false){
      this.show = true;
      this.currentElementClick = data;
    }else{
      this.show = this.show;
      this.currentElementClick = data;
    }
    this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
  }

 /*
 Function Name : showProfileHead
 Params        : Nil 
 Functaionality: Shows Profile head and hide side bar
 */
  showProfileHead() {
    this.common.showHeaderProfile = true;
    this.common.showSidebar = "hidden";
  }

 /*
 Function Name : hideProfileHead
 Params        : Nil 
 Functaionality: Hides Profile Head and side bar
 */
  hideProfileHead() {
    this.common.showHeaderProfile = false;
    this.common.showSidebar = "hidden";
  }

 /*
 Function Name : closeSidebar
 Params        : Nil 
 Functaionality: Close Side Bar
 */
  closeSidebar() {
    this.common.showSidebar = "hidden";
  }

 /*
 Function Name : closeSidebar
 Params        : Nil 
 Functaionality: Selcting user profile back
 */
  selectUserProfile() {
    this.churchSelected = false;
    this.common.churchHeader = false;
    this.profile.currentProfile.selectedprofile = "user";
    localStorage.setItem('profile', JSON.stringify(this.profile.currentProfile));
    this.profile.profileUpdate();
    this.showChurchOrProfile = false;
    this.route.navigate(['/dashboard']);
  }

 /*
 Function Name : getMyChurchData
 Params        : Nil 
 Functaionality: get church data from API to side menu list/ dropdown
 */
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
          let streetStr = result.churchList.records[i].npe5__Organization__r.Physical_Street_1__c;
          if(result.churchList.records[i].npe5__Organization__r.Physical_Street_2__c){
            streetStr += ", "+ result.churchList.records[i].npe5__Organization__r.Physical_Street_2__c;
          }
          if(result.churchList.records[i].npe5__Organization__r.PhysicalStreet3__c){
            streetStr += ", "+ result.churchList.records[i].npe5__Organization__r.PhysicalStreet3__c;
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
    },
      (error: HttpErrorResponse) => {
        this.alertService.error(ErrorMessages.observableError, true);
      });
  }

 /*
 Function Name : selectChurch
 Params        : selected church item (object) 
 Functaionality: set church data passed to this function
 */
  selectChurch(item) {
    this.common.showHeaderProfile = false;
    this.common.showSidebar = "visible";
    this.churchSelected = true;
    this.showChurchOrProfile = !this.showChurchOrProfile;
    this.churchTitle = item.name;
    this.myChurchProfile = false;

    let church = new Church();
    church.accountID = item.accountID;
    church.name = item.name;
    church.phoneNumber = item.phoneNumber;
    church.billingCity = item.billingCity;
    church.billingCountry = item.billingCountry;
    church.billingPostalCode = item.billingPostalCode;
    church.billingState = item.billingState;
    church.billingStreet_1 = item.billingStreet_1;
    church.role = item.role;

    this.profile.currentProfile.church = church;
    this.profile.currentProfile.selectedprofile = "church";
    localStorage.setItem('profile', JSON.stringify(this.profile.currentProfile));
    this.profile.profileUpdate();
    this.pName = "church";

    this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
    if (this.userAuthorization.viewOrderHistory == false) {
      this.route.navigate(['/church']);
    } else {
      this.route.navigate(['/dashboard']);
    }
  }

  logout() {
    gigya.socialize.logout({ callback: this.gigClass.onLogoutResponse.bind(this) });
  }
 
 /*
 Function Name : showProfileHeader
 Params        : Nil 
 Functaionality: show profile header when church or user profile selected satisfying conditions
 */
  showProfileHeader() {
    this.common.showHeaderProfile = true;
    if (this.profile.currentProfile.selectedprofile == 'user') {
      this.route.navigateByUrl('/profile');
    }
    else {
      this.route.navigateByUrl('/church');
    }

    if (this.churchSelected == true) {
      this.common.churchHeader = true;
    } else {
      this.common.churchHeader = false;
    }
  }

 /*
 Function Name : gotoprofile
 Params        : Nil 
 Functaionality: change page to profile by route
 */
  gotoprofile() {
    this.profile.changeMessage("Hello from Sibling");
    this.route.navigateByUrl('/profile');
  }

  
 /*
 Function Name : onloadMenuSelection
 Params        : routerPath  
 Functaionality: set router path to currentElementclick; if router belongs from order,profile,church,manage-church then it will open the menu box.
 */
  onloadMenuSelection(routerPath:any){
    this.currentElementClick = routerPath;
    this.show = true;
  }

  ngOnDestroy() {
    if (this.churchSubscription) {
      this.churchSubscription.unsubscribe();
    }
  }
}
