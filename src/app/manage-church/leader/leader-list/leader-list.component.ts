import { Component, OnInit } from '@angular/core';
import { retry } from 'rxjs/operators/retry';
import { Router } from '@angular/router';
import { ProfileService, AuthService, UserAuthorizationService, AlertService } from '../../../services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { churchLeadersModuleMessages, ErrorMessages } from '../../../messages';
import { CommonService } from '../../../services/common.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UserAuthorization } from '../../../model/user-authorization';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { WindowScrolling } from "../../../services/windowScrolling.service";
import { GigyaClass } from '../../../util/gigya-class';

@Component({
    selector: 'app-leader-list',
    templateUrl: './leader-list.component.html',
    styleUrls: ['./leader-list.component.scss']
})

export class LeaderListComponent implements OnInit {
    churchId: any;
    clickMoreAwana: boolean = false;
    clickMoreChurch: boolean = false;
    dataSource: any;
    gigClass:GigyaClass;
    gigiyaId: string;
    keySorting: string="";
    innerLoading: boolean;
    item: any;
    lastPage: number;
    leaderItem: any;
    leaderName: string;
    licenseExceed:boolean=false;
    loading: boolean = false;
    messages = churchLeadersModuleMessages;
    mobileLoading:boolean=false;
    mozoDropDown=[];
    mozoFreeTrail:boolean=false;
    mozoLevel:string;
    mozoLicenceAvailable:string;
    mozoLicenceUsed:string;
    mozoRegLevel:string;
    mozoRemainingLicense:boolean=false;
    mozoTrailExpiryDays:any;
    noRecs: boolean = false;
    orderbyValue: string="";
    pageSize: number = 10;
    plusExpandFlag: boolean = false;
    plusExpandFlagPending: boolean = false;
    private windowScrolling: WindowScrolling;
    rejectLeaderFlag: boolean = false;
    removePopUp: boolean;
    searchAnimate:boolean = false;
    searchItem: any;
    searchLeader$ = new Subject<string>();
    selfRemovePop: boolean=false;
    serverApiError:boolean=false;
    serviceError:boolean = false;
    serviceMessage:string = "Loading data, Please wait."
    showSortBar: boolean = false;
    showSubHead: boolean = true;
    showTrailDisable: boolean = false;
    showTrailExpiry: string;
    sortDesc: boolean = false;
    sortOptions= [];
    toggle: boolean=false;
    totalItems: number;
    userAuthorization: UserAuthorization; // used to store the user role for autherization purpose.
    
    constructor(private profile: ProfileService, private router: Router, private auth: AuthService, private common: CommonService, private userAuthorizationSrvc: UserAuthorizationService,windowScrolling: WindowScrolling,private alertService: AlertService) {
        this.eventHandler(this.searchLeader$)
        .subscribe(results => {
            });
        this.windowScrolling = windowScrolling;
        this.gigClass = new GigyaClass(this.profile);
    }

    /**
     * sorting the leader list page based on the user selection column start here.
     * @function for  Manageleader sorting function *
     * @author SK
     */
    //sortingt function by column
    sortByKey(key,alwaysAsc?:boolean) {
        this.profile.currentSort = key;
        
        if (this.profile.prevSort === key) {
            this.profile.isAsc = !this.profile.isAsc;
        }
        else {
            this.profile.isAsc = true;
        }
        if(alwaysAsc)
        {
            this.profile.isAsc = true;
        }
        if (this.profile.isAsc) {
           //ascending
        }
        else {
           //descending
        }
        this.profile.prevSort = key;
        if(this.profile.isAsc)
        return "ASC";
        else
        return "DESC";
    }


    sortDatasource(key,alwaysAsc?:boolean) {
        let value="";
        this.keySorting=key;
        this.orderbyValue=this.sortByKey(key);
        this.dataSource=this.serviceSortingFiltering(value,key,this.orderbyValue);
       // this.dataSource.records = this.sortByKey(this.dataSource.records, key,alwaysAsc);
        //this.profile.currentPage = 1;
        this.showSortBar = false;
    }

    // sorting the leader list page based on the user selection column ends here.

    ngOnInit() {

        //To identify if the user belong to Pending list or normal list.
        if(localStorage.getItem('leader-type') == 'Pending'){
            this.toggle=true; //pending list
        }else{
            this.toggle=false; //normal list
        }

        //check user authorization level and redirect to forbidden page, if user is not authorized.
        this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
        if(this.userAuthorization.viewManageLeaders == false){
            this.router.navigate(['/forbidden']);
        }

        window.scrollTo(0, 0);
        this.common.backHeader = false;
        this.hideProfileHead();
        this.noRecs = false;
        this.searchItem = "";
        this.loading = true;
        this.getleaders();
        this.getChurchRegistrationLevel();
        //this.getApprovalDisplayMessage();
        this.sortOptions = [
            {id:'option1', label:'User Name',sourceName: 'Contact_Name__c'},
            {id:'option2', label:'Awana Role',sourceName: 'Awana_Role__c'},
            {id:'option3', label:'Account Owner',sourceName: 'Organization_Owner__c'},
            {id:'option4', label:'Mozo License',sourceName: 'Mozo_User_Level__c'}
        ];

        //Mozo Trail Expiry Days Notification Display Check
        if (localStorage.getItem('showTrailExpiry')) {
            this.showTrailExpiry = localStorage.getItem("showTrailExpiry");
          }
          else {
            localStorage.setItem("showTrailExpiry", "1");
            this.showTrailExpiry = localStorage.getItem("showTrailExpiry");
          }
    }

    getAccountId() {
        if (localStorage.getItem('profile')) {
            let profile = JSON.parse(localStorage.getItem('profile'));
            return profile.church.accountID;
        }
    }

    /**
     * Retrive the Church Regsitration & Mozo Level.
     * @function for Getting the Church Registration Level *
     * @author Suren
     * */
    getChurchRegistrationLevel(){
        let data = {
            "accountId": this.getAccountId()
        };

        this.profile.getChurchRegistrationLevel(data).subscribe((res: any) => {

        var mozoDropDownStr       = res.churchLevelResult.mozoDropDown;
        var mozoDropDownArray     = mozoDropDownStr.split(',');
        let mozoTrailExpiryDays   = "";

        for(var i = 0; i < mozoDropDownArray.length; i++) {
            this.mozoDropDown.push(mozoDropDownArray[i]) ;
        }
        console.log("Mozo Level:"+res.churchLevelResult.mozoLevel);
        if(res.churchLevelResult.mozoLevel == "M0"){
            this.mozoTrailExpiryDays   = res.churchLevelResult.mozoTrailExpiry;
            this.mozoFreeTrail = true;
        }else if(res.churchLevelResult.mozoLevel == "M1" || res.churchLevelResult.mozoLevel == "M2" || res.churchLevelResult.mozoLevel == "M3"){
            this.mozoRemainingLicense = true;           
            this.mozoTrailExpiryDays = res.churchLevelResult.numberOfLicences - res.churchLevelResult.licencesUsed;
            console.log(this.mozoTrailExpiryDays);
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

    /**
     * Disable the Mozo Trail License Expiry Notification.
     * @function for  Update the local storage value *
     * @author Suren
     * */
    closeTrailExpiry() {
        this.showTrailDisable       = true;
        this.mozoTrailExpiryDays    = false;
        this.mozoFreeTrail          = false;
        this.mozoRemainingLicense   = false;
        localStorage.setItem("showTrailExpiry", "2");
    }

    /**
     * Pagination the leader list page based on the user selection column start here.
     * @function for  Manageleader Pagination *
     * @author SK*/

    pageChange(page) {
        let value="";
        this.profile.currentPage = page;
        if( this.keySorting  && this.orderbyValue){
            this.serviceSortingFiltering(value,this.keySorting,this.orderbyValue);
        }
        else{  this.getleaders();
        }
    }
    goFirstPage() {
        let value="";
        this.profile.currentPage = 1;
        if( this.keySorting  && this.orderbyValue){
            this.serviceSortingFiltering(value,this.keySorting,this.orderbyValue);
        }
        else{  this.getleaders();
        }
    }
    goLastPage() {
        let value="";
        if( this.keySorting  && this.orderbyValue){
            this.serviceSortingFiltering(value,this.keySorting,this.orderbyValue);
        }
        else{  this.getleaders();
        }
        this.profile.currentPage = Math.ceil(this.totalItems / this.pageSize);
    }
    // Pagination the leader list page based on the user selection column end here.


    /**
    * format aawana roles the leader list page based on the user selection column start here.
    * @function for  Manageleader format aawana roles *
    * @author SK*/

    formatAwanaRole(awanaRole) {
        let roles: any = [];
        if (awanaRole) {
            roles = awanaRole.split(";");
            if (roles.length > 1) {
                return roles[0] + ", ...";
            }
            else
             return roles[0];
        }
    }


    /**
    * plus icon expand on leader list page based on the user selection column start here.
    * @function for  Manageleader plus icon expand *
    * @author SK*/
    toggleOptions(leader) {
        this.selfRemovePop=false;
        this.innerLoading = true;
        this.clickMoreAwana = false;
        this.clickMoreChurch = false;
        if (!leader.plusExpandFlag) {
            this.addressDetailsLeader(leader);
        }
        else{
            this.innerLoading = false;
        }

        if (this.profile.previousSelectedLeader && (this.profile.previousSelectedLeader.Id !== leader.Id)) {
            this.profile.previousSelectedLeader.plusExpandFlag = false;
        }
        leader.plusExpandFlag = !leader.plusExpandFlag;
        this.profile.previousSelectedLeader = leader;
    }

    /**
     * Plus icon expand on pending leader list page based on the user selection.
     * @author Siva Sanker Reddy on 22 May 2018
     */
    toggleOptionsPending(pendingLeader) {
        if (this.profile.previousSelectedPendingLeader && (this.profile.previousSelectedPendingLeader.npe5__Contact__r.Email !== pendingLeader.npe5__Contact__r.Email)) {
            this.profile.previousSelectedPendingLeader.plusExpandFlagPending = false;
        }
        pendingLeader.plusExpandFlagPending = !pendingLeader.plusExpandFlagPending;
        this.profile.previousSelectedPendingLeader = pendingLeader;
    }

    /**
    *remove leader function on leader list page based on the user selection column start here.
    * @function for  remove leader function *
    * @author SK*/

    removeItem(item) {
        this.churchId = item.npe5__Organization__c;
        this.leaderName = item.Contact_Name__c;
        this.removePopUp = true;
        this.item = item;
        if(this.profile.currentProfile.user.Email == item.npe5__Contact__r.Email){
            this.selfRemovePop=true;
        }else{
            this.selfRemovePop=false;
        }
            this.removePopUp=true;
            this.windowScrolling.disable();

    }

    closeRemoveLeaderModal(){
        this.windowScrolling.enable();
        this.removePopUp=false;
    }
    /* Acutally delete: this will delete from the backend */
    removeLeader() {
            this.windowScrolling.enable();
            if (this.item.Church_Role__c == null) {
                this.item.Church_Role__c = "";
            }
            let record = {
                "token": localStorage.getItem('token'),
                "affiliateid": this.item.Id.toString(),
                "awanarole": this.item.Awana_Role__c,
                "churchRole": this.item.Church_Role__c,
                "mozorole": this.item.Mozo_User_Level__c.toString(),
                "name": this.item.Contact_Name__c,
                "email": this.item.npe5__Contact__r.Email,
                "LeaderName": this.profile.currentProfile.user.FirstName,
                "accountowner": (this.item.Organization_Owner__c).toString(),
                "authorizedPurchaser": (this.item.Authorized_Purchaser__c).toString(),
                "status": "Former",
                "leaderChurchId": this.getAccountId()
            };

            this.loading = true;
            this.mobileLoading=true;
            this.serviceError = true;
            this.profile.recordRemove(record).subscribe((result: any) => {
                // this.previousSelectedLeader.plusExpandFlag = false;
                if(this.profile.currentProfile.user.Email == this.item.npe5__Contact__r.Email)
                {
                    gigya.socialize.logout({ callback: this.gigClass.onLogoutResponse.bind(this) });
                }else{
                    this.loading = false; //stop displaying the spinner
                    this.mobileLoading=false;
                    this.serviceError = false;
                    this.removePopUp = false;
                    this.getleaders();
                    this.alertService.error(this.messages.youHaveSuccessfullyRemoved + " " + this.leaderName + " " + this.messages.account, true);
                }

            }, (error: HttpErrorResponse) => {
                this.loading = false; //stop displaying the spinner
                this.mobileLoading=false;
                this.alertService.error(ErrorMessages.serviceError, true);
                this.removePopUp = false;
            // this.previousSelectedLeader.plusExpandFlag = false;
            });
        this.searchItem = "";
    }
    // *remove leader function on leader list page based on the user selection column end here.


    /**
    *get grid data on leader list page start here.
    * @function for  get grid data *
    * @author SK*/

    getleaders() {
        this.selfRemovePop=false;
        if(this.toggle==true){
            this.profile.previousSelectedLeader = {};
            this.profile.currentPage=1;
            this.common.mobileRecordsLimit=10;
        }

        if(this.toggle==false){
            this.profile.previousSelectedPendingLeader = null;
        }

        let data = {
            "accountid": this.profile.currentProfile.church.accountID,
            "sorting": "",
            "search": "",
            "filter": this.toggle,
            "limit":this.pageSize,
            "pageNumber": this.profile.currentPage
        };
        this.loading = true; //display the spinner
        this.mobileLoading=true;
        this.serviceError = true;
        this.profile.leaderGridList(data).subscribe((result: any) => {
            if (result) {
                if (result.churchmembers.records.length > 0){
                this.dataSource = result.churchmembers;
                this.totalItems = this.dataSource.maximumSize ? this.dataSource.maximumSize : 0;
                if(this.toggle==true){
                    this.sortDatasource('name',true);
                }
                this.lastPage = Math.ceil(this.totalItems / this.pageSize);
                this.loading = false; //stop displaying the spinner
                this.mobileLoading=false;
                this.serviceError = false;
                this.noRecs = false;
                }
                else{
                    this.dataSource = [];
                    this.loading = false; //stop displaying the spinner
                    this.noRecs = true;
                }
                if(this.profile.previousSelectedLeader && this.toggle==false){
                    this.profile.previousSelectedLeader.plusExpandFlag=false;
                    let indexValue = this.dataSource.records.findIndex(x => x.Id==this.profile.previousSelectedLeader.Id);
                    if(indexValue>=0)
                    {
                    this.toggleOptions(this.dataSource.records[indexValue]);
                    }
                }
                //This logic is used to keep the expanded pending leader/user in the expanded mode when the control is returned after the update of the pending leader/user
                if(this.profile.previousSelectedPendingLeader && this.toggle==true){
                    this.profile.previousSelectedPendingLeader.plusExpandFlag=false;
                    //fetch the index of the matching leader
                    let indexValue = this.dataSource.records.findIndex(x => x.npe5__Contact__r.Email==this.profile.previousSelectedPendingLeader.npe5__Contact__r.Email);
                    if(indexValue>=0)
                    {
                        //Show the leader in the expanded mode.
                        this.toggleOptionsPending(this.dataSource.records[indexValue]);
                    }
                }
            }
            else {
                this.dataSource = [];
                this.loading = false;
                this.serviceError = false;
                this.mobileLoading=false;
                //this.noRecs = true;
            }

        }, (error: HttpErrorResponse) => {
            this.dataSource = [];
            this.loading = false; //stop displaying the spinner
            this.mobileLoading=false;
            this.serviceError = false;
            this.alertService.error(ErrorMessages.serviceError, true);
            //this.noRecs = true;
        }
    );
    }

    /**
    *leader reject function on leader list page based on the user selection column start here.
    * @function for  leader reject function *
    * @author SK*/

    rejectLeader(leader) {
        this.windowScrolling.disable();
        this.leaderName = leader.Contact_Name__c;
        this.rejectLeaderFlag = true;
        this.leaderItem = leader;
    }

    closeRejectLeaderModal(){
        this.windowScrolling.enable();
        this.rejectLeaderFlag=false;
    }
    rejectLeaderProfile() {
        this.windowScrolling.enable();
        this.rejectLeaderFlag = false;
        this.loading = true;
        this.mobileLoading=true;
        this.serviceError = true;
        if (this.leaderItem.Church_Role__c == null) {
            this.leaderItem.Church_Role__c = "";
        }
        let record = {
            "token": localStorage.getItem('token'),
            "affiliateid": this.leaderItem.Id.toString(),
            "awanarole": this.leaderItem.Awana_Role__c,
            "churchRole": this.leaderItem.Church_Role__c,
            "mozorole": this.leaderItem.Mozo_User_Level__c.toString(),
            "name": this.leaderItem.Contact_Name__c,
            "email": this.leaderItem.npe5__Contact__r.Email,
            "LeaderName": this.profile.currentProfile.user.FirstName,
            "accountowner": (this.leaderItem.Organization_Owner__c).toString(),
            "authorizedPurchaser": (this.leaderItem.Authorized_Purchaser__c).toString(),
            "status": "Former",
            "leaderChurchId": this.getAccountId()
        };
        this.profile.recordRemove(record).subscribe((result: any) => {
            this.loading = false; //stop displaying the spinner
            this.mobileLoading=false;
            this.serviceError = false;
            this.getleaders();
            this.alertService.success(this.messages.youHaveSuccessfullyRejected + " " + this.leaderName + " " + this.messages.account , true);
        }, (error: HttpErrorResponse) => {
            this.rejectLeaderFlag = false;
            this.alertService.error(ErrorMessages.serviceError, true);
        });
        this.searchItem = "";
    }

    /**
    *search funtionality to implement the Debounce in order to minimize the number of requests
    * @function for  Leader search funtionality *
    * @author SK*/

    eventHandler(terms: Observable<string>) {
        return terms.debounceTime(300)
        .distinctUntilChanged()
        .switchMap(term => this.searchByFilter(term))
    }
    // *leader reject function on leader list page based on the user selection column end here.

    /**
    *search funtionality on leader list page based on the user selection column start here.
    * @function for  search funtionality *
    * @author SK*/

   searchByFilter(value) {
       let sortParam="";
       let orderBy="";
            if (value) {
                if (value.length > 1) {
                   this.serviceSortingFiltering(value,sortParam,orderBy);
                }
            }
            if (value.length <= 1) {
                this.getleaders();
            }
      return this.searchLeader$
    }

    /**
     * To load the approve leader or udpdate leader page based on the user selection.
     * @param leader holds all the affiliation details
     * @param buttonClicked identifies which button is clicked by the user either Approve, Update etc.
     * @author Siva Sanker Reddy on 14 Feb 2018
     */

    updateLeader(leader: any, buttonClicked: string) {
        leader.type = this.toggle;
        this.common.setLeaderObj(leader);
        if (buttonClicked == 'Approve') {
            this.common.backHeaderName = "Approve Leader";
            localStorage.setItem('manage-leader-label', 'Approve');

        } else {
            this.common.backHeaderName = "Update Leader";
            localStorage.setItem('manage-leader-label', 'Update');
        }
        localStorage.setItem('leader-type', 'Approved');
        let leaderObj:any=this.common.getLeaderObj();
        if(leaderObj && leaderObj['type'] === true){
            localStorage.setItem('leader-type',"Pending");
            localStorage.setItem('leader-emailId',leaderObj.npe5__Contact__r.Email);
        }
        let path = 'manage-church/leaders/' + leader.Id + '/update';
        this.router.navigateByUrl(path);
    }

    /**
     *
     */
    viewLeader(leader){
        //console.log("Leader Single",leader);
        leader.type = this.toggle;
        this.common.setLeaderObj(leader);
        this.common.backHeaderName = "View Leader";
        let path = 'manage-church/leaders/' + leader.Id;
        this.router.navigateByUrl(path);
    }

    /**
     * To display approval successfull message on manage leaders page.
     * @author Siva Sanker Reddy on 14 Feb 2018
     */
    private approvalDisplayMessage: string;
    getApprovalDisplayMessage() {
       // this.alertService.error(error.message, true);
        this.approvalDisplayMessage = this.profile.getApprovalDisplayMessage();
        if (this.approvalDisplayMessage) {
            setTimeout(() => {
                this.approvalDisplayMessage = null;
                this.profile.setApprovalDisplayMessage(null);
            }, 5000);
        }
    }

    onScroll() {
        this.common.mobileRecordsLimit+=10;
    }


    /**
     * To display Searchbar.
     * @author Shishir S.
     */
    showSearchBar(){
        this.showSubHead = false;
        this.showSortBar = false;
        this.searchAnimate = true;
    }

    /**
     * To remove Search Option.
     * @author Shishir S.
     */
    removeSearch(){
        this.showSubHead = true;
        this.searchItem = "";
        this.getleaders();
        this.searchAnimate = false;
    }

    /**
     * To Show Sortbar.
     * @author Shishir S.
     */
    showSortingBar(){
        if(!this.showSubHead){
            this.getleaders();
            this.searchItem = "";
        }
        this.showSubHead = true;

        if(this.showSortBar === true){
            this.showSortBar = false;
        }else{
            this.showSortBar = true;
        }
    }

    hideProfileHead() {
        this.common.showHeaderProfile = false;
      }
    addressDetailsLeader(leader){
        //Request object
        let requestObj = {
            "token": localStorage.getItem('token'),
            "affiliationId": leader.Id
        }
        this.profile.getLeaderDetailsAdditional(requestObj).subscribe((result: any) => {
            this.innerLoading = false;
            this.gigiyaId = result.UserAffiliationDetail.gigyaId;
            let data = {
                "gigyaId": this.gigiyaId
            };
            if (result) {
                leader.Phone = result.UserAffiliationDetail.Phone;
                leader.Address1 = result.UserAffiliationDetail.ShippingStreet_1;
                leader.Address2 = result.UserAffiliationDetail.ShippingStreet_2;
                leader.Address3 = result.UserAffiliationDetail.ShippingStreet_3;
                leader.ShippingState = result.UserAffiliationDetail.ShippingState;
                if(result.UserAffiliationDetail.ShippingPostalCode.length<8)
                {
                    leader.Postalcode = result.UserAffiliationDetail.ShippingPostalCode.replace('-','');
                }
                else{
                    leader.Postalcode = result.UserAffiliationDetail.ShippingPostalCode;
                }
                //leader.Postalcode = result.UserAffiliationDetail.ShippingPostalCode
                leader.City = result.UserAffiliationDetail.ShippingCity;
                leader.Country = result.UserAffiliationDetail.ShippingCountry;
                leader.emailId=result.UserAffiliationDetail.Email;
                this.profile.getImage(data).subscribe((result: any) => {
                    if (result) {
                        leader.imageUrl = result.leaderPhotodetails.thumbnailURL;

                    }
                    else {
                        leader.imageUrl = "";
                    }
                },
                    (error: HttpErrorResponse) => {
                        this.alertService.error(ErrorMessages.serviceError, true);
                    });

            }
            else {
                leader.Phone = "";
                leader.Street = "";
                leader.City = "";
                leader.Country = "";
            }

        }, (error: HttpErrorResponse) => {
            this.innerLoading = false;
            this.alertService.error(ErrorMessages.serviceError, true);
        });

    }

    /**
    * Update the invited and pending leader roles function on pending leader list page based on the user selection.
    * @author Siva Sanker Reddy on 22 May 2018.
    */
    updatePendingLeader(leader: any) {
        localStorage.setItem('manage-leader-label', 'Update');
        localStorage.setItem('leader-type', 'Pending');
        localStorage.setItem('leader-emailId', leader.npe5__Contact__r.Email);
        this.common.backHeaderName = "Update Leader";
        let path = 'manage-church/leaders/' + leader.Id + '/update';
        this.router.navigateByUrl(path);
    }


    /**
    * @function Displays confimation alert message on click of Remove button on the pending leader.
    * @author Siva Sanker Reddy on 22 May 2018.
    */
    displayConfirmationPopUp = false;
    confirmPendingLeaderDeletion(item) {
        this.churchId = item.npe5__Organization__c;
        this.leaderName = item.Contact_Name__c;
        this.displayConfirmationPopUp = true;
        this.item = item;
        this.windowScrolling.disable();
    }

    /**
     * @function Closes the alert/confirmation dialogue box on click of cancel button on it.
     * @author Siva Sanker Reddy on 11-June-2018
     */
    closeConfirmationPopUp(){
        this.windowScrolling.enable();
        this.displayConfirmationPopUp=false;
    }

    /**
     * @function Removes the pending leader invitation by invoking the backend API.
     * @author Siva Sanker Reddy on 11-June-2018
     */
    removePendingLeader() {
        this.windowScrolling.enable();
        if (this.item.Church_Role__c == null) {
            this.item.Church_Role__c = "";
        }
        let record = {
            "token": localStorage.getItem('token'),
            "email": this.item.npe5__Contact__r.Email,
            "leaderChurchId": this.getAccountId()
        };

        this.loading = true;
        this.mobileLoading = true;
        this.serviceError = true;
        this.profile.removePendingInvitation(record).subscribe((result: any) => {
            this.loading = false; //stop displaying the spinner
            this.mobileLoading = false;
            this.serviceError = false;
            this.removePopUp = false;
            this.getleaders();
            this.alertService.error(this.messages.youHaveSuccessfullyRemoved + " " + this.leaderName + " " + this.messages.account, true);

        }, (error: HttpErrorResponse) => {
            this.loading = false; //stop displaying the spinner
            this.mobileLoading = false;
            this.alertService.error(ErrorMessages.serviceError, true);
            this.removePopUp = false;
        });
        this.searchItem = "";
        this.displayConfirmationPopUp=false;
    }
    /**
     * @function Removes the pending leader invitation by invoking the backend API.
     * @author SK on 25-June-2018
     */
    serviceSortingFiltering(value,sortParam,orderBy){
        //let orderby=this.sortByKey(sortParam);
        if(!value){
            value="";
        }
        else{ orderBy="";}
        if(!sortParam){
            sortParam="";
        }
        let data = {
            "accountid": this.profile.currentProfile.church.accountID,
            "sorting": sortParam,
            "search": value,
            "filter":this.toggle,
            "limit": this.pageSize,
            "pageNumber": this.profile.currentPage,
            "orderBy": orderBy
        }
        this.profile.prevSort=sortParam;
        this.loading = true;
        this.profile.leaderGridList(data).subscribe((result: any) => {
            if (result) {
                if(result.churchmembers.records.length>0)
                {
                    this.dataSource = result.churchmembers;
                    this.totalItems = this.dataSource.maximumSize ? this.dataSource.maximumSize : 0;
                    this.lastPage = Math.ceil(this.totalItems / this.pageSize);
                    this.loading = false; //stop displaying the spinner
                    this.mobileLoading = false;
                    this.serviceError = false;
                    this.noRecs = false;
                    this.serverApiError = false;
                }
                else
                {
                    this.dataSource = [];
                    this.totalItems = this.dataSource.records ? this.dataSource.records.length : 0;
                    this.lastPage = Math.ceil(this.totalItems / this.pageSize);
                    this.loading = false; //stop displaying the spinner
                    this.mobileLoading = false;
                    this.serviceError = false;
                    this.noRecs = true;
                }
            }
              
            else {
                this.dataSource = [];
                this.totalItems = this.dataSource.records ? this.dataSource.records.length : 0;
                this.lastPage = Math.ceil(this.totalItems / this.pageSize);
                this.loading = false; //stop displaying the spinner
                this.mobileLoading = false;
                this.serviceError = false;
                this.noRecs = true;
            }

        }, (error: HttpErrorResponse) => {
            this.dataSource = [];
            this.totalItems = this.dataSource.records ? this.dataSource.records.length : 0;
            this.lastPage = Math.ceil(this.totalItems / this.pageSize);
            this.loading = false; //stop displaying the spinner
            this.mobileLoading = false;
            this.alertService.error(ErrorMessages.serviceError, true);
        });
    }
}
