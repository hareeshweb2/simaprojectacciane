import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Currentprofile } from '../model/currentprofile';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class ProfileService {

  currentProfile: Currentprofile;
  @Output() change: EventEmitter<Currentprofile> = new EventEmitter();
  private messageSource = new BehaviorSubject<string>("default message");
  currentMessage = this.messageSource.asObservable();
  
  currentPage: number = 1;
  currentSort;
  prevSort;
  isAsc: boolean = true;
  previousSelectedLeader: any;
  previousSelectedPendingLeader: any; // +/- Button Manupulation in pending leaders list
  // private messageSourceChurch = new BehaviorSubject<string>("default message");
  // currentMessagechurch = this.messageSourceChurch.asObservable();

  private messageSourceOne = new BehaviorSubject<string>("default church");
  currentMessageOne = this.messageSourceOne.asObservable();
  callChurchService(messageOne: string) {
    this.messageSourceOne.next(messageOne);
  }

  constructor(private _http: HttpClient) {
    this.currentProfile = new Currentprofile();
  }
  changeMessage(message: string) {
    this.messageSource.next(message);
  }
  editGeneralProf(message: string) {
    this.messageSource.next(message);
  }
  editChruchProf(message: string) {
    this.messageSourceOne.next(message);
  }
  DeleteChurchAddr(message: string){
    this.messageSourceOne.next(message);
  }
  
  profileUpdate() {
    this.change.emit(this.currentProfile);
  }

  getToken() {
    return localStorage.getItem('token');
  }
  logout() {
    return this._http.get(environment.services.user.url + "logout");
  }
  hello() {
    return this._http.get(environment.services.user.url + "hello");
  }
  getUserInfoProfile() {
    return this._http.get(environment.services.user.url + "getUserInfo");
  }
  getSuggestedAddress(data) {
    return this._http.post(environment.services.user.url + "validateAddress", data);
  }
  getPostalcode(data) {
    return this._http.post(environment.services.user.url + "suggestZipcode", data);
  }
  socialLogin(data) {
    return this._http.post(environment.services.user.url + "sociallogin", data);
  }
  socialConnect(data) {
    return this._http.post(environment.services.user.url + "updateSocialUserInfo", data);
  }

  updateProfilePic(data) {
    //return this._http.post(environment.api_url + "gigya/picupload", data);
    return this._http.post(environment.services.user.url + "uploadprofile", data);
  }

  UpdateUserInfo(contactId, body) {
    body.Id = contactId;
    let bodyString = JSON.stringify(body);
    return this._http.post(environment.services.user.url + "UpdateUserInfo", body);
  }
  UpdateUserInfoMobile(contactId, body) {
    body.Id = contactId;
    let bodyString = JSON.stringify(body);
    return this._http.post(environment.services.user.url + "UpdateUserInfoMobile", body);
  }
  registration(data) {
    return this._http.post(environment.services.user.url + "register", data);
  }
  // checkUserEmailIdExists(email) {
  //   return this._http.post(environment.api_url + "gigya/userexists", email);
  // }
  forgotpassword(data) {
    //forgotPassword
    return this._http.post(environment.services.user.url + "forgotPassword", data);
  }
  /**
   * get church list of associated loggedin user.
   * @param data {object} sould have token and contactid.
   */

  //adding this to add churches as per new status(Current Or pending)
  getchurchs(data) {
    return this._http.post(environment.services.church.url + "getChurchAccountlist", data);
  }
  triggerEmail(data) {
    return this._http.post(environment.services.user.url + "forgotPassword", data);
  }

  getUserDetails(data) {
    return this._http.post(environment.services.user.url + "getUserInfo", data);
  }

  //MYAW-581--search church by name and zip
  getChurchBynameZipcode() {
    return this._http.get(environment.services.church.url + "getChurchlist");
  }

  //asssociate church with user
  affiliateUserWithChurch(data) {
    return this._http.post(environment.services.church.url + "addUser", data);
  }

  //get awana roles
  getAwanaRoles() {
    return this._http.get(environment.services.church.url + "getAwanaRoles");
  }

  //get Church Roles
  getChurchRoles() {
    return this._http.get(environment.services.church.url + "getChurchRoles");
  }

  //get Church Registration  Level
  getChurchRegistrationLevel(data) {
    return this._http.post(environment.services.church.url + "authorizeChurchLevel", data);
  }  

  //manage leader functionality start
  leaderGridList(data) {
    return this._http.post(environment.services.church.url + "getChurchMembers", data);
  }
  //invite user functionality
  checkExistingEmail(emailId) {
    let param = new URLSearchParams();
    param.append('email', emailId);
    return this._http.get(environment.services.user.url + "verifyUserExists?" + param);
  }

  inviteUser(data) {
    return this._http.post(environment.services.user.url + "affiliateUserInvite", data);

  }
  recordRemove(data) {
    return this._http.post(environment.services.church.url + "updateUserRoles", data);
  }

  //get user info for manage leader after + icon hit
  getLeaderDetailsAdditional(data) {
    return this._http.post(environment.services.church.url + "viewLeaderDetails", data);
  }
  // get image from gigiya
  getImage(data) {
    return this._http.post(environment.services.church.url + "getLeaderPhoto", data);
  }
//get details of invite leader for social component
inviteUserDetails(data){
  let param = new URLSearchParams();
  param.append('id', data);
  return this._http.get(environment.services.user.url + "getInviteUserData?" + param);
}

//for register the user for invite leader
registerUser(data){  
  return this._http.post(environment.services.user.url + "inviteUserRegistration", data);
}

  /**
   * These setter and getter is used to display approval successfull message on manage leaders page..
   * @author Siva Sanker Reddy on 14 Feb 2018
   */
  private approvalDisplayMessage: string;
  setApprovalDisplayMessage(message): void {
    this.approvalDisplayMessage = message;
  }
  getApprovalDisplayMessage(): string {
    return this.approvalDisplayMessage;
  }
  //manage leader functionality end
  //removing church affiliation
  removeChurch(data) {
    return this._http.post(environment.services.church.url + "removeUserAffiliation", data);
  }
  //get userinfo for reset password
  reSetPasswordUserinfo(data) {
    return this._http.post(environment.services.user.url + "getUIDInfo", data);
  }
  
  // used to check the existing user registered for particular church
  checkExistingEmailForManageleader(emailId,churchid) {
    let param = new URLSearchParams();
    param.append('email', emailId);
    param.append('churchid', churchid);
    return this._http.get(environment.services.user.url + "verifyUserExists?" + param);
  }

  /**
   * @function Removes the pending invitation.
   * @param data which will be used by the API for identification purpose.
   */
  removePendingInvitation(data) {
    return this._http.post(environment.services.church.url + "removePendingInvitation", data);
  }
}
