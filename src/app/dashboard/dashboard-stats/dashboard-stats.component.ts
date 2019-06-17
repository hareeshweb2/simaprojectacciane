import { Component, OnInit,ChangeDetectionStrategy,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProfileService, OrderService, AuthService, CommonService, UserAuthorizationService } from '../../services/index';
import { Subscription } from 'rxjs/Subscription';
import {historyModuleMessages} from '../../messages';
import { UserAuthorization } from '../../model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard-stats',
  templateUrl: './dashboard-stats.component.html',
  styleUrls: ['./dashboard-stats.component.scss']
})
export class DashboardStatsComponent implements OnInit,OnDestroy {

  typeData: any;
  currentAccountId: any;
  ordersCount: any="";
  programsCount: any="";
  userRequestsCount: any="";
  mozoLicensesUsedCount: any="";
  totalMozoLicensesCount:any="";
  loading:boolean=false;
  orderSubscription:Subscription;
  serviceError:boolean = false;
  serviceMessage = "Loading data, Please wait."
  messages = historyModuleMessages;
  churchSubscription:Subscription;
  userAuthorization: UserAuthorization; // used to store the user role for authorization purpose.

  constructor(private router:Router, private http: HttpClient, private order: OrderService, 
    private profile: ProfileService, private common:CommonService, 
    private userAuthorizationSrvc: UserAuthorizationService) { }

  ngOnInit() {
     //check user authorization level and redirect to forbidden page, if user is not authorized.
     this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
     if (this.profile.currentProfile.selectedprofile == "church" && this.userAuthorization.viewOrderHistory == false) {
       this.router.navigate(['/church/profile']);
     } 
    else { 
     this.loading=true;
     this.profileSetup();
     this.hideProfileHead();
     if (this.typeData==="church") {
      this.getTotalOrders();
      this.getTotalUserRequests();
      this.getTotalMozoLicenses();
     }
     this.profile.change.subscribe((result) => {
     this.profileSetup();
       if(this.router.url === "/dashboard"){
        if (this.typeData==="church") {
          this.getTotalOrders();
          this.getTotalUserRequests();
          this.getTotalMozoLicenses();
         }
       }
     },
       (error: any) => {
       });}
  }

  ngOnDestroy() {
    if (this.churchSubscription) {
      this.churchSubscription.unsubscribe();
    }
  }

  getAccountId() {
    if (localStorage.getItem('profile')) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      return profile.church.accountID;
    }
  }

  profileSetup() {
    this.loading=true;
    if(this.profile.currentProfile.selectedprofile=="user"){
      this.currentAccountId=this.profile.currentProfile.user.AccountId;
      this.typeData="household";

    }else{
      this.currentAccountId=this.profile.currentProfile.church.accountID;
      this.typeData="church";
    }
  }

  /*
  @Created By : Hayley Shuler
  @Created On : 22-06-2018
  @Disc : This Function is used to retrieve the total number orders of a church
  @Return : integer - number of orders
  */
  getTotalOrders(){
    let data={
      accountid:this.currentAccountId.trim()
     };
     this.loading=true;
     this.serviceError = true;
     let requestObj = {
      "accountid": this.getAccountId()
    }
    if(localStorage.getItem('token')){      
      this.http.post(environment.services.church.url+"getTotalOrdersCount", requestObj).subscribe((responseObj: any) => {
        if(responseObj.totalOrdersCount){         
          this.ordersCount = responseObj.totalOrdersCount;
        }
        else{ 
          this.ordersCount = 0;
        }
        this.loading=false;
        this.serviceError = false;
      },(error:HttpErrorResponse)=>{
        this.loading=false;
        this.serviceError = false;
        this.serviceMessage = "Problem with the service. Please try after sometime"
        console.log(error);
      });
    }else{
      this.loading=false;
      console.log("no account id.");
    }
  }

    /*
  @Created By : Hayley Shuler
  @Created On : 22-06-2018
  @Disc : This Function is used to retrieve the total number of user requests for a church
  @Return : integer - number of user requests
  */
  getTotalUserRequests(){

    this.loading=true;
    this.serviceError = true;
    //Request object
    let requestObj = {
        "accountid": this.getAccountId()
    }

    this.http.post(environment.services.church.url+"getUserRequestsCount", requestObj).subscribe((responseObj: any) => {
        if (responseObj) {
          this.userRequestsCount = responseObj.totalUserRequestsCount;
        }
        this.serviceError = false;
        this.loading=false;
    }, (errorObj: HttpErrorResponse) => {
        this.loading=false;
        this.serviceError = false;
        this.serviceMessage="Problem with the service. Please try after sometime";
        console.log(errorObj);
    });
  }

    /*
    @Created By : Hayley Shuler
    @Created On : 22-06-2018
    @Disc : This Function is used to retrieve the mozo licenses used and total for a church
    @Return : object - integer, integer - number of total and used mozo licenses
    */
  getTotalMozoLicenses(){

    this.loading=true;
    this.serviceError = true;
    //Request object
    let requestObj = {
        "accountid": this.getAccountId()
    }

    this.http.post(environment.services.church.url+"getMozoLicensesCount", requestObj).subscribe((responseObj: any) => {
        if (responseObj) {
          this.mozoLicensesUsedCount = responseObj.mozoLicensesResult.licensesUsed;
          this.totalMozoLicensesCount = responseObj.mozoLicensesResult.numberOfLicenses;
          if (this.totalMozoLicensesCount == null) {
            this.totalMozoLicensesCount = 0;
          }
        }
        this.serviceError = false;
        this.loading=false;
    }, (errorObj: HttpErrorResponse) => {
        this.loading=false;
        this.serviceError = false;
        this.serviceMessage="Problem with the service. Please try after sometime";
        console.log(errorObj);
    });
  }

  hideProfileHead() {
    this.common.showHeaderProfile = false;
    this.common.backHeader = false;
  }

}