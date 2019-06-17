import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../../../services/profile.service';
import { updateLeaderModuleMessages, ErrorMessages} from '../../../messages';
import { CommonService } from '../../../services/common.service';
import { PhoneNumberConverter } from '../../../util/phoneNumberConverter';
import { UserAuthorization, Currentprofile } from '../../../model';
import { UserAuthorizationService, AlertService } from '../../../services';
import { GigyaClass } from '../../../util/gigya-class';

@Component({
    selector: 'update-leader',
    templateUrl: './update-leader.component.html',
    styleUrls: ['./update-leader.component.scss']
})
export class UpdateLeaderComponent implements OnInit {
    //joinStrChurch: any;
    joinStrAwana: any;
    state: any;
    //Properties
    name: string; //to display the name of the church leader.
    email: string; //to display the email id of the church leader.
    phone: string; //to display the phone number of the church leader.
    accountOwner: boolean; //to toggle if the leader is account owner of the church or not.
    authorisedPurchaser: boolean; //to toggle if the leader is authorised purchaser. 
    aWanaRoles: any = []; //to store the list of awana roles of the leader.
    churchRoles: any = []; //to store the list of church roles of the leader.
    selectedAwanaRoles: any = []; //to store the selected awana roles by the leader. Used for to and fro purpose from front-end to back-end.
    selectedChurchRoles: string =''; //to store the selected chruch roles by the leader. Used for to and fro purpose from front-end to back-end.
    mozoDropDown=[]; //to store the Mozo drop down values from back-end
    mozoLicenceAvailable:string; //to store the Mozo license available from back-end
    mozoLicenceUsed:string; //to store the Mozo license used from back-end
    licenseExceed:boolean=false; //to store the Mozo license exceed for the registration level from back-end        
    mozoRegLevel:string;    //to store the Mozo registration level from back-end
    mozoLevel:string;   //to store the Mozo mozo level from back-end
    mozoLevelFull:boolean=false;    //to store the Mozo level Full to show the license count level from back-end
    selectedMozoLevel: any; //to store the selected mozo level. Used for to and fro purpose from front-end to back-end.
    statusMessage: string; //to display message if the update is succssful.
    mailingStreet: string = "";
    mailingStreet2: string = "";
    mailingCityCountryAndPostalCode: string = "";
    serverErrorMessage:boolean=false;

    address1: string = ""; //to display the mailing street
    address2: string = ""; //to display the mailing country and empty if it is null.
    address3: string = ""; // to display the mailing postal code and empty if it is null.
    city: string = ""; //to display mailing city
    postalcode: string = ""; //to display the postal code
    country: string = ""; //to display the country

    profilePic: string = "";
    showProfilePic: boolean = false;
    affiliationId: string; //leader id 
    clickedButton: string; //button selected by the user in Manage Leader Page, either APPROVE or UPDATE.
    loading:boolean = true; //display the spinner
    mobileLoading:boolean=false;
    serviceError:boolean = false;
    serviceMessage:string = "Loading data, Please wait."
    disableSubmitButton:boolean = false; //enable the submit(Update or Approve) button.
    //MOZO levels - static
    mozoLevels = [{ "name": "NONE" }, { "name": "FULL" }, { "name": "LMS" }];
    awanaSettings = {};
    churchSettings = {};
    awanaRolesErrorMessage:string = null; 
    allAwanaRoles: any = [];  //to store all the list of awana roles.
    allChurchRoles: any = []; //to store all the list of church roles.
    popUpAccountOwner:boolean=false;
    popUpAuthpurcheser:boolean=false;
    messages = updateLeaderModuleMessages;
    phoneNumberConverter:PhoneNumberConverter = new PhoneNumberConverter();
    userAuthorization: UserAuthorization; // used to store the user role for autherization purpose.
    popAccountOwnerFlag:boolean=true;
    gigClass:GigyaClass;
    constructor(private http: HttpClient, private profile: ProfileService, private router: Router, private activeRoute:ActivatedRoute,private common: CommonService, private userAuthorizationSrvc: UserAuthorizationService, private alertService: AlertService) { 
        this.gigClass = new GigyaClass(this.profile);
        }

    ngOnInit() {
        //check user authorization level and redirect to forbidden page, if user is not authorized.
        this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
        if(this.userAuthorization.editManageLeaders == false){
            this.router.navigate(['/forbidden']);
        }

        window.scrollTo(0, 0);
        this.common.backHeader = true;
        this.affiliationId = this.activeRoute.snapshot.params['id'];
        this.clickedButton =  localStorage.getItem('manage-leader-label');
        this.getAwanaRoles();
        this.getChurchRoles();
        this.getLeaderData(); //fetch the chruch Leader inforation.
        this.getChurchRegistrationLevel();
        
        this.awanaSettings = {
            text: 'Select Awana Role',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: 'myclass custom-class'
        };

        this.churchSettings = {
            text: 'Select Church Role',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            classes: 'myclass custom-class'
        };
    }

    //Methods
    getToken() {
        return localStorage.getItem('token');
    }

    getAccountId() {
        if (localStorage.getItem('profile')) {
            let profile = JSON.parse(localStorage.getItem('profile'));
            return profile.church.accountID;
        }
    }

    /**
     * Fetches the leader information from the back-end server.
     * @author Siva Sanker Reddy, on 12-Feb-2018
     */
    getLeaderData() {
        let requestObj;
        let apiURL;
        this.loading = true; //display the spinner
        this.mobileLoading=true;
        this.serviceError = true;

        let leaderType = localStorage.getItem('leader-type');
        
        if( leaderType == 'Pending'){ //for pending user/leader
            requestObj = {
                "accountId": this.getAccountId(),
                "emailId": localStorage.getItem('leader-emailId')
            }
            apiURL = environment.services.church.url + "fetchPendingLeaderDetails"; //fetches the data from backend-MongoDB 
        } else { // for normal user/leader
            requestObj = {
                "affiliationId": this.affiliationId
            }
            apiURL = environment.services.church.url + "viewLeaderDetails"; //fetches the data from backend-SalesForce
        }

        this.http.post(apiURL, requestObj).subscribe((responseObj: any) => {
            if (responseObj) {

                this.loading = false; //stop displaying the spinner
                this.name = responseObj.UserAffiliationDetail.Contact_Name__c;
                this.email = responseObj.UserAffiliationDetail.Email;
                this.phone = responseObj.UserAffiliationDetail.Phone; 

                if(responseObj.UserAffiliationDetail.ShippingStreet_1){
                    this.mailingStreet = responseObj.UserAffiliationDetail.ShippingStreet_1;
                }
                if(responseObj.UserAffiliationDetail.ShippingStreet_2){
                    this.mailingStreet = this.mailingStreet +', '+responseObj.UserAffiliationDetail.ShippingStreet_2;
                }

                this.mailingStreet2 = responseObj.UserAffiliationDetail.ShippingStreet_3;

                if(responseObj.UserAffiliationDetail.ShippingCity){
                    this.mailingCityCountryAndPostalCode = responseObj.UserAffiliationDetail.ShippingCity;
                }
                if(responseObj.UserAffiliationDetail.ShippingState){
                    this.mailingCityCountryAndPostalCode = this.mailingCityCountryAndPostalCode + ', ' +responseObj.UserAffiliationDetail.ShippingState;
                }
                if(responseObj.UserAffiliationDetail.ShippingPostalCode){
                    if(responseObj.UserAffiliationDetail.ShippingPostalCode.length<8)
                    {
                        this.mailingCityCountryAndPostalCode = this.mailingCityCountryAndPostalCode +" " +responseObj.UserAffiliationDetail.ShippingPostalCode.replace('-','');
                    }
                    else{
                        this.mailingCityCountryAndPostalCode = this.mailingCityCountryAndPostalCode +" "+ responseObj.UserAffiliationDetail.ShippingPostalCode;
                    }
                }
                
                this.city = responseObj.UserAffiliationDetail.ShippingCity;
                
                this.loadSelectedAwanaRoles(responseObj.UserAffiliationDetail.Awana_Role__c); //converts the comma separate string into object array
                this.loadSelectedChurchRoles(responseObj.UserAffiliationDetail.Church_Role__c); //converts the comma separate string into object array
                this.selectedMozoLevel = (responseObj.UserAffiliationDetail.Mozo_User_Level__c);


                this.joinStrAwana=this.selectedAwanaRoles.map(function(elem){
                    return elem.Role;
                    }).join(",");
                    if(this.joinStrAwana && this.joinStrAwana!==''){
                        if(this.selectedChurchRoles==''){
                          if((this.joinStrAwana.indexOf('Commander') !== -1) && (this.joinStrAwana.indexOf('Club Secretary') !== -1 ))
                          {
                            this.authorisedPurchaser= true;
                            this.accountOwner=true;
                          }
                          else if(this.joinStrAwana.indexOf('Club Secretary') !== -1)
                          {
                            this.authorisedPurchaser= true;
                            this.accountOwner=false;
                          }
                          else if(this.joinStrAwana.indexOf('Commander') !== -1){
                            this.authorisedPurchaser= true;
                            this.accountOwner=true;
                          }
                          else{
                            this.authorisedPurchaser= false;
                            this.accountOwner=false;
                          }
                        }
                        else{
                            this.authorisedPurchaser= true;
                             this.accountOwner=true;
                        }
                    }
                    else if(this.selectedChurchRoles && this.selectedChurchRoles!==''){
                          if(this.joinStrAwana ==''){
                            this.authorisedPurchaser= true;
                            this.accountOwner=true;
                          }
                    }
                    else if(this.joinStrAwana=='' && this.selectedChurchRoles==''){
                        this.authorisedPurchaser= false;
                        this.accountOwner=false;
                    }
                    if(responseObj.UserAffiliationDetail.Organization_Owner__c==true)
                    {
                        this.accountOwner=true;
                    }
                    if(!responseObj.UserAffiliationDetail.Organization_Owner__c)
                    {
                        this.accountOwner=false;
                    }

                    if(responseObj.UserAffiliationDetail.Authorized_Purchaser__c==true)
                    {
                        this.authorisedPurchaser= true;
                    }
                    if(!responseObj.UserAffiliationDetail.Authorized_Purchaser__c)
                    {
                        this.authorisedPurchaser= false;
                    }

                //fetch the image
                if( leaderType != 'Pending'){ //for normal user/leader
                    let data = {
                        "gigyaId": responseObj.UserAffiliationDetail.gigyaId
                    };
    
                    this.profile.getImage(data).subscribe((result: any) => {
                        if (result) {
                            this.showProfilePic = true;
                            this.profilePic = result.leaderPhotodetails.photoURL;
                        }
                        else {
                            this.showProfilePic = false;
                            this.profilePic = "";
                        }
                    }, (errorObj: HttpErrorResponse) => {
                        this.loading = false; //stop displaying the spinner
                        this.mobileLoading = false;
                        this.serviceError = false;
                        this.alertService.error(ErrorMessages.serviceError, true);
                    });
                }
                
                this.loading = false; //stop displaying the spinner
                this.mobileLoading=false;
                this.serviceError = false;
                
            }
        },(errorObj: HttpErrorResponse) => {
            this.loading = false; //stop displaying the spinner
            this.mobileLoading=false;
            this.serviceError = false;
            this.alertService.error(ErrorMessages.serviceError, true);
        });
    }

    /**
     * Fetches all the Awana Roles of the Leaders.
     * @author Siva Sanker Reddy, on 16-Feb-2018
     */
    getAwanaRoles() {       
        this.profile.getAwanaRoles().subscribe(
            (responseObj: any) => {
                for (let i = 0; i <= responseObj.AwanaRolesResults.AwanaRoles.length; i++) {
                    if (responseObj.AwanaRolesResults.AwanaRoles[i]) {
                        this.allAwanaRoles.push(responseObj.AwanaRolesResults.AwanaRoles[i].data);
                        this.allAwanaRoles[i]['id'] = responseObj.AwanaRolesResults.AwanaRoles[i].data.Role;
                        this.allAwanaRoles[i]['itemName'] = responseObj.AwanaRolesResults.AwanaRoles[i].data.Role;
                    }
                }
            },
            (errorObj: HttpErrorResponse) => {
                this.loading = false; //stop displaying the spinner
                this.alertService.error(ErrorMessages.serviceError, true);
            }
        );
    }

    /**
     * Fetches all the Awana Roles of the Leaders.
     * @author Siva Sanker Reddy, on 12-Feb-2018
     */
    getChurchRoles() {        
        this.profile.getChurchRoles().subscribe(
            (responseObj: any) => {
                for (let i = 0; i <= responseObj.ChurchRolesResults.ChurchRoles.length; i++) {
                    if (responseObj.ChurchRolesResults.ChurchRoles[i]) {
                        this.allChurchRoles.push(
                            responseObj.ChurchRolesResults.ChurchRoles[i].data
                        );
                        this.allChurchRoles[i]['id'] = responseObj.ChurchRolesResults.ChurchRoles[i].data.Role;
                        this.allChurchRoles[i]['itemName'] = responseObj.ChurchRolesResults.ChurchRoles[i].data.Role;
                    }
                }
            },
            (errorObj: HttpErrorResponse) => {
                this.loading = false; //stop displaying the spinner
                this.alertService.error(ErrorMessages.serviceError, true);
            }
        );
    }
    /**
     * Fetches the church Registration Awana Roles of the Leaders.
     * @author Suren, on 07-May-2018
     */
    getChurchRegistrationLevel(){
        //Retrive the account ID (Church ID)
        let data = {
        "accountId": this.getAccountId()
        };

        //Retrive the Church registration detail from Sales Force
        this.serverErrorMessage=false;
        this.profile.getChurchRegistrationLevel(data).subscribe((res: any) => {
        this.serverErrorMessage=false;

        //Explode the Mozo drop down values based on Comma
        var mozoDropDownStr       = res.churchLevelResult.mozoDropDown;
        var mozoDropDownArray     = mozoDropDownStr.split(',');
        
        for(var i = 0; i < mozoDropDownArray.length; i++) {
        this.mozoDropDown.push(mozoDropDownArray[i]) ;      
        } 
        
        //Mozo related info from SF
        this.mozoLicenceAvailable  = res.churchLevelResult.numberOfLicences;
        this.mozoLicenceUsed       = res.churchLevelResult.licencesUsed;
        this.mozoRegLevel          = res.churchLevelResult.registrationLevel;
        this.mozoLevel             = res.churchLevelResult.mozoLevel;

        //Checking the Mozo Level to enable the license count display 

        if(this.selectedMozoLevel=="FULL" || this.selectedMozoLevel =="Full"){

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

        },(error: HttpErrorResponse) => {
            this.alertService.error(ErrorMessages.serviceError, true);
        });
    }
    /**
     * Fetches the Mozo Level to display the drop down.
     * @author Suren, on 07-May-2018
     */
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
    /**
     * This method updates the backend API for all the modifications done to the church Leader information on front end.
     * @author Siva Sanker Reddy, on 12-Feb-2018
     */
    updateLeader(): void {
        this.loading = true; //display the spinner
        this.mobileLoading=true;
        this.serviceError = true;
        this.disableSubmitButton = true; //disable the submit(Update or Approve) button.

        //convert selected awana roles to a semi colon separated string.
        let tempArr: any = [];
        for (let i = 0; i <= this.selectedAwanaRoles.length; i++) {
            if (this.selectedAwanaRoles[i]) {
              tempArr.push(this.selectedAwanaRoles[i]['id']);
            }
          }
        let selectedAwanaRolesStr = tempArr.join('; '); //semi colon sepated string that will be sent for backend REST API
        
        if(!this.authorisedPurchaser){
            this.authorisedPurchaser=false;
        }
        
        if(!this.accountOwner)
        {
            this.accountOwner=false;
        }
        let requestObj = {
            "token": this.getToken(),
            "affiliateid": this.affiliationId,
            "awanarole": selectedAwanaRolesStr, 
            "churchRole": this.selectedChurchRoles,
            "mozorole": this.selectedMozoLevel,
            "accountowner": this.accountOwner + '',
            "authorizedPurchaser": this.authorisedPurchaser + '',
            "name": this.name,
            "email": this.email,
            "LeaderName": this.profile.currentProfile.user.FirstName + " " + this.profile.currentProfile.user.LastName,
            "status": "Current",
            "leaderChurchId": this.getAccountId() 
        }

        let apiURL; //variable to store the API URL based on the user/leader type
        let leaderObj:any=this.common.getLeaderObj();
        if(localStorage.getItem('leader-type') == 'Pending'){
            apiURL = environment.services.church.url + "updatePendingInvitation"; //Updates MongoDB
        } else {
            apiURL = environment.services.church.url + "updateUserRoles"; //Updates Salesforce
        }

        //Invoke the back-end REST API
        this.http.post(apiURL, requestObj).subscribe((responseObj: any) => {
            if (responseObj) {
                this.loading = false; //stop displaying the spinner
                this.mobileLoading=false;
                this.serviceError = false;
                if (this.accountOwner == false && this.email == this.profile.currentProfile.user.Email) {
                    this.logout();
                }
                else {
                    this.statusMessage = 'You have successfully updated,' + " " + this.name +"'s" +' account.';
                    this.alertService.success(this.statusMessage, true);
                    this.profile.setApprovalDisplayMessage(this.statusMessage);
                    this.router.navigate(['manage-church/leaders']);
                } 
            }
        }, (errorObj: HttpErrorResponse) => {
            this.loading = false; //stop displaying the spinner
            this.mobileLoading=false;
            this.alertService.error(ErrorMessages.serviceError, true);
        });
        this.common.setLeaderObj({});
    }

    /**
     * To back to the manage leaders page.
     * @author Siva Sanker Reddy, on 12-Feb-2018
     */
    cancel(): void {
        this.profile.setApprovalDisplayMessage(null); //do not show any pop-up in the manage leaders page.
        this.router.navigate(['manage-church/leaders']);  //go to manage leader page
    }

    /**
     * Create and load the awana roles received from backend REST API in the required structure multiselect component in the frontend
     * @author Siva Sanker Reddy on 16-Feb-2018
     */
    loadSelectedAwanaRoles(awanaRolesStr: string): void {
        awanaRolesStr = awanaRolesStr.trim(); //to trim if there are any spaces trailing
        if (awanaRolesStr) { //check if data is null or undefined
            if (awanaRolesStr.indexOf(';') > -1) { //check the data has one record without semi colon
                let tempStorage = awanaRolesStr.split(';');
                for (let i = 0; i <= tempStorage.length; i++) {
                    if (tempStorage[i]) {
                        let tempObj = { "Role": tempStorage[i].trim(), "status": true }
                        this.selectedAwanaRoles.push(tempObj);
                        this.selectedAwanaRoles[i]['id'] = tempStorage[i].trim();
                        this.selectedAwanaRoles[i]['itemName'] = tempStorage[i].trim();
                    }
                }
            } else { //if the data has one record without semi colon
                let tempObj = { "Role": awanaRolesStr.trim(), "status": true }
                this.selectedAwanaRoles.push(tempObj);
                this.selectedAwanaRoles[0]['id'] = awanaRolesStr.trim();
                this.selectedAwanaRoles[0]['itemName'] = awanaRolesStr.trim();
            }
        }
    }

    /**
     * Create and load the church roles received from backend REST API in the required structure multiselect component in the frontend
     * @author Siva Sanker Reddy on 16-Feb-2018
     */
    loadSelectedChurchRoles(churchRolesStr: string): void {
       this.selectedChurchRoles=churchRolesStr;
    }

    /**
     * If at least one item is selected on the awana roles, then do not display the error message.
     * @author Siva Sanker Reddy on 16-Feb-2018
     */
    onItemSelect(item: any) {
        if (this.selectedAwanaRoles.length > 0) {
            this.awanaRolesErrorMessage = null;
            this.disableSubmitButton = false; //enable the submit(Update or Approve) button.
        }

        this.accountOwner= false;
        this.authorisedPurchaser=false;      
        this.joinStrAwana=this.selectedAwanaRoles.map(function(elem){
        return elem.Role;
        }).join(",");
        this.updateRoles();
    }
    updateRoles(){
        if(this.joinStrAwana && this.joinStrAwana!==''){
            if(this.selectedChurchRoles==''){
              if((this.joinStrAwana.indexOf('Commander') !== -1) && (this.joinStrAwana.indexOf('Club Secretary') !== -1 ))
              {
                this.authorisedPurchaser= true;
                this.accountOwner=true;
              }
              else if(this.joinStrAwana.indexOf('Club Secretary') !== -1)
              {
                this.authorisedPurchaser= true;
                this.accountOwner=false;
              }
              else if(this.joinStrAwana.indexOf('Commander') !== -1){
                this.authorisedPurchaser= true;
                this.accountOwner=true;
              }
              else{
                this.authorisedPurchaser= false;
                this.accountOwner=false;
              }
            }
            else{
                this.authorisedPurchaser= true;
                 this.accountOwner=true;
            }
        }
        else if(this.selectedChurchRoles && this.selectedChurchRoles!==''){
              if(this.joinStrAwana ==''){
                this.authorisedPurchaser= true;
                this.accountOwner=true;
              }
        }
        else if(this.joinStrAwana=='' && this.selectedChurchRoles==''){
            this.authorisedPurchaser= false;
            this.accountOwner=false;
        }
    }
    /**
     * If at least one item is NOT selected on the awana roles, then display the error message.
     * @author Siva Sanker Reddy on 16-Feb-2018
     */
    OnItemDeSelect(item: any) {
        if (this.selectedAwanaRoles.length == 0) {
            this.awanaRolesErrorMessage = this.messages.awanaRoleValidationMessage;
            this.disableSubmitButton = true; //disable the submit(Update or Approve) button.
        }
        this.onItemSelect(item);
    }

    onSelectAll(items: any) {
        //do nothing.
    }

    onDeSelectAll(items: any) {
        //do nothing.
    }

    /**
     * Converts the phone number to USA format (###) ###-####. Ex. (910) 997-4908
     * @author Siva Sanker Reddy on 01-Feb-2018
     */
    convertToUsaFormat(phoneNumber): string {
        return this.phoneNumberConverter.convertPhoneNumberToUsaFormat(phoneNumber);
    }
     /**z
     * This function will be called once the account owner will set for normal user
     * @author S K
     */
    logout() {
        gigya.socialize.logout({ callback: this.gigClass.onLogoutResponse.bind(this) });
      }
      checkClicked(){
          if(this.accountOwner==true)
          {
            this.popAccountOwnerFlag=false;
          }
          else{
            this.popAccountOwnerFlag=true;
          }
      }
      
}