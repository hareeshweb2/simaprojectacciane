import { Component, OnInit,ChangeDetectionStrategy,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InsertPeiodInDateFormatPipe } from '../../pipes/insertPeriodInDateFormat.pipe';
import { ProfileService, OrderService, AuthService, CommonService, UserAuthorizationService, AlertService } from '../../services/index';
import { Subscription } from 'rxjs/Subscription';
import {historyModuleMessages, ErrorMessages} from '../../messages';
import { UserAuthorization } from '../../model';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-recent-order',
  templateUrl: './recent-order.component.html',
  styleUrls: ['./recent-order.component.scss'],
  providers:[InsertPeiodInDateFormatPipe],
  changeDetection:ChangeDetectionStrategy.Default
})
export class RecentOrderComponent implements OnInit,OnDestroy {
 awanaStore:string=environment.awanaStore;
 churchIdForOrder:string="/?set-organization=";
 storePath = environment.woocommerce_path;
 typeData: any;
 currentAccountId: any;
 isSubItemFlag:boolean;
 dataSource: any="";
 loading:boolean=false;
 NorecordsOrder:boolean=false;
 orderSubscription:Subscription;
 serviceError:boolean = false;
 serviceMessage = "Loading data, Please wait."
 messages = historyModuleMessages;
 userAuthorization: UserAuthorization; // used to store the user role for autherization purpose.

  constructor(private router:Router, private order: OrderService, 
    private profile: ProfileService,private auth: AuthService,
    public insertPeriod:InsertPeiodInDateFormatPipe , private common:CommonService, private userAuthorizationSrvc: UserAuthorizationService , private alertService: AlertService) { }
  
  ngOnInit() {  
    
     //check user authorization level and redirect to forbidden page, if user is not authorized.
    this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
    if (this.profile.currentProfile.selectedprofile == "church" && this.userAuthorization.viewOrderHistory == false) {
      this.router.navigate(['/church/profile']);
    } 
   
    //window.scrollTo(0, 0);
    this.loading=true;
    this.profileSetup();
    this.getRecentOrders();
    this.hideProfileHead();
    this.profile.change.subscribe((result) => {
    this.profileSetup();
      if(this.router.url === "/dashboard"){
        this.getRecentOrders();
      }
    },
      (error: any) => {
        this.alertService.error(ErrorMessages.observableError, true);
      });
  }

  ngOnDestroy(){
    if(this.orderSubscription){
      this.orderSubscription.unsubscribe();
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
  

  getRecentOrders(){
    let AccountId='';
    if(this.currentAccountId){
      AccountId = this.currentAccountId.trim();
    } else {
      AccountId = this.currentAccountId;
    }
    let data={
      accountid: AccountId,
      type:this.typeData,
      ordertype: "recent",
      searchVal: "",
      fromDate: "",
      toDate: "",
      limit: "",
      pageNumber: ""
    };
    this.loading=true;
    this.serviceError = true;
    if(localStorage.getItem('token')){      
      this.orderSubscription = this.order.getRecentOrder(data).subscribe((result:any)=>{
        if(result){         
          this.dataSource = result.recentorder;
          this.loading=false;
          this.NorecordsOrder=false;
          this.serviceError = false;
        }
        else{  
          this.dataSource = null;
          this.NorecordsOrder=true;
          this.loading=false;
          this.serviceError = false;
        }
      },(error:HttpErrorResponse)=>{
        this.loading=false;
        this.serviceError = false;
        this.dataSource = null;
        this.alertService.error(ErrorMessages.observableError, true);
      });
    }else{
      this.NorecordsOrder=true;
      this.loading=false;
    }
  }

  showOrderItems(){
    this.dataSource.showItems=true;
  }
  hideOrderItems(){
    this.dataSource.showItems=false;
  }
  hideProfileHead() {
    this.common.showHeaderProfile = false;
    this.common.backHeader = false;
  }
}
