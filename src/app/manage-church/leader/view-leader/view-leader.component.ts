import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// import { ProfileService } from '../../../services/profile.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { updateLeaderModuleMessages, ErrorMessages} from '../../../messages';
// import { CommonService } from '../../../services/common.service';
import { PhoneNumberConverter } from '../../../util/phoneNumberConverter';
import { UserAuthorization } from '../../../model';
import { CommonService, ProfileService, UserAuthorizationService, AlertService, ChurchService } from '../../../services';

@Component({
    selector: 'view-leader',
    templateUrl: './view-leader.component.html',
    styleUrls: ['./view-leader.component.scss']
})
export class ViewLeaderComponent implements OnInit {
    //Properties
    name: string; //to display the name of the church leader.
    email: string; //to display the email id of the church leader.
    phone: string; //to display the phone number of the church leader.
    state: string;
    statusMessage: string; //to display message if the update is succssful.
    mailingStreet: string = "";
    mailingStreet2: string = "";
    mailingCityCountryAndPostalCode: string = ""; //to display the mailing street
    Awana_Role__c: string;
    Church_Role__c: string;
    Mozo_User_Level__c: string;
    Authorized_Purchaser__c: string;
    Organization_Owner__c: string;
    city: string = ""; //to display mailing city
    postalcode: string = ""; //to display the postal code
    country: string = ""; //to display the country
    leaderId: string;
    profilePic: string;
    showProfilePic: boolean = false;
    serviceError:boolean = false;
    serviceMessage = "Loading data, Please wait."
    affiliationId: string; //leader id 
    loading:boolean = false; //display the spinner
    messages = updateLeaderModuleMessages;
    phoneNumberConverter:PhoneNumberConverter = new PhoneNumberConverter();
    userAuthorization: UserAuthorization; // used to store the user role for autherization purpose.
    
    constructor(private http: HttpClient, 
        private profileSrvc: ProfileService, 
        private router: Router,
        private activeRoute:ActivatedRoute,
        private common: CommonService,
        private userAuthorizationSrvc: UserAuthorizationService,
        private alertService: AlertService,
        private church: ChurchService) { }

    ngOnInit() {

        window.scrollTo(0, 0);
        this.common.backHeader = true;
        this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
        this.affiliationId = this.activeRoute.snapshot.params['id'];
        this.getLeaderData(); //fetch the chruch Leader inforation.

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

    getLeaderData() {
        let leaderObj:any=this.common.getLeaderObj();
        let requestObj;
        let leaderType;
        if(leaderObj && leaderObj['type'] === true){
            requestObj = {
                "accountId": leaderObj.Id,
                "emailId": leaderObj.npe5__Contact__r.Email
            }
            leaderType = "fetchPendingLeaderDetails";
        }else{
            requestObj = {
                "affiliationId": this.affiliationId
            }
            leaderType = "viewLeaderDetails";
        }

        this.church.leadersDetails(leaderType,requestObj).subscribe((responseObj:any)=>{
            if (responseObj) {
                let data = {
                    "gigyaId": responseObj.UserAffiliationDetail.gigyaId
                };

                this.loading = false; //stop displaying the spinner
                this.serviceError = false;
                this.name = responseObj.UserAffiliationDetail.Contact_Name__c;
                this.phone = responseObj.UserAffiliationDetail.Phone;
                this.email = responseObj.UserAffiliationDetail.Email;

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
                this.Awana_Role__c = responseObj.UserAffiliationDetail.Awana_Role__c;
                this.Church_Role__c = responseObj.UserAffiliationDetail.Church_Role__c;
                this.Mozo_User_Level__c = responseObj.UserAffiliationDetail.Mozo_User_Level__c;
                this.Authorized_Purchaser__c = responseObj.UserAffiliationDetail.Authorized_Purchaser__c;
                this.Organization_Owner__c = responseObj.UserAffiliationDetail.Organization_Owner__c;
                this.leaderId = responseObj.UserAffiliationDetail.Id;

                //fetch the image
                this.getImage(data);
            }
        },(errorObj: HttpErrorResponse) => {
            this.loading = false; //stop displaying the spinner
            this.serviceError = false;
            this.alertService.error(ErrorMessages.serviceError, true);
        });
    }

    getImage(data){
        this.profileSrvc.getImage(data).subscribe((result: any) => {
            if (result) {
                this.showProfilePic = true;
                this.profilePic = result.leaderPhotodetails.photoURL;
            }
            else {
                this.showProfilePic = false;
                this.profilePic = "";
            }
        }, (errorObj: HttpErrorResponse) => {
            this.loading = false;
            this.serviceError = false;
            this.alertService.error(ErrorMessages.serviceError, true);
        });
    }
    updateLeader(){
        let leaderObj:any=this.common.getLeaderObj();
        if(leaderObj && leaderObj['type'] === true){
            localStorage.setItem('leader-type',"Pending");
            localStorage.setItem('leader-emailId',leaderObj.npe5__Contact__r.Email);
        }
        let path = 'manage-church/leaders/' + this.leaderId + '/update/Update';
        this.router.navigate(['manage-church/leaders']);
        this.router.navigateByUrl(path);
        this.common.backHeaderName = "Update Leader";
    }

    cancel(): void {
        this.router.navigate(['manage-church/leaders']);  //go to manage leader page
    }
}
