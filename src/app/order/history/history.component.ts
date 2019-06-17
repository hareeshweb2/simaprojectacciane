import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService, AuthService, ProfileService, CommonService, UserAuthorizationService, AlertService } from '../../services/index';
import { Subscription } from 'rxjs/Subscription';
import { HttpErrorResponse } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {historyModuleMessages, ErrorMessages} from '../../messages';
import { from } from 'rxjs/observable/from';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UserAuthorization } from '../../model';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class HistoryComponent implements OnInit, OnDestroy {
  awanaStore:string=environment.awanaStore;
  churchIdForOrder:string="/?set-organization=";
  url: string="";
  datesErrors: any = [];
  storePath = environment.woocommerce_path;
  searchAnimate: any;
  searchItem: string;
  filterFlag: boolean=false;
  searchFlag:boolean=false;
  dateFrom;
  dateTo;
  noRecs: boolean = false;
  typeData: any;
  currentAccountId: any;
  orderHistoryData: any;
  lastPage: number;
  orderData: any;
  isActive: boolean = false;
  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number;
  loading: boolean = false;
  NoorderRecords: boolean = false;
  orderSubscription: Subscription;
  serviceError:boolean = false;
  serviceMessage = "Loading data, Please wait."
  messages = historyModuleMessages;
  userAuthorization: UserAuthorization; // used to store the user role for autherization purpose.
  emptySearchState:boolean=false;
  constructor(private order: OrderService, private router: Router, private profile: ProfileService, private auth: AuthService, private common: CommonService,
    private userAuthorizationSrvc: UserAuthorizationService , private alertService: AlertService  ) { }

  ngOnInit() {

    //check user authorization level and redirect to forbidden page, if user is not authorized.
    this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
    if (this.profile.currentProfile.selectedprofile == "church" && this.userAuthorization.viewOrderHistory == false) {
      this.router.navigate(['/forbidden']);
    }

    window.scrollTo(0, 0);
    this.hideProfileHead();
    this.loading = true;
    this.profileSetup();
    this.getOrderHistory();
    this.hideProfileHead();
    this.profile.change.subscribe((result) => {
      this.profileSetup();
      if(this.router.url === "/order/history"){
        this.getOrderHistory();
      }
    },
      (error: any) => {
        this.alertService.error(ErrorMessages.observableError, true);
      });
  }
  ngOnDestroy() {
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
    if (this.profile.currentProfile.selectedprofile == "user") {
      this.currentAccountId = this.profile.currentProfile.user.AccountId;
      this.typeData = "household";
      this.loading = true;
      this.serviceError = true;
    } else {
      this.currentAccountId = this.profile.currentProfile.church.accountID;
      this.typeData = "church";
      this.loading = true;
      this.serviceError = true;
    }
  }

  getOrderHistory() {
    let data={
      accountid:this.currentAccountId,
      type:this.typeData,
      ordertype: "orderhistory",
      searchVal: "",
      fromDate: "",
      toDate: "",
      limit: this.pageSize.toString(),
      pageNumber: this.currentPage.toString()
    };
    this.loading = true;
    this.orderSubscription = this.order.getOrderHistory(data).subscribe((result: any) => {
      if (result) {
        this.orderHistoryData = result.recentorder;
        this.totalItems = result.recentorder.maximumSize;
        this.lastPage = Math.ceil(this.totalItems / this.pageSize);
        this.loading = false;
        this.serviceError = false;
        this.NoorderRecords = false;
        this.orderSubscription.unsubscribe();
      }
      else {
        this.orderHistoryData = null;
        this.NoorderRecords = true;
        this.loading = false;
        this.serviceError = false;
      }
    }, (error: HttpErrorResponse) => {
      this.loading =false;
      this.serviceError = false;
      this.alertService.error(ErrorMessages.serviceError, true);
    });
  }

  viewOrderDetails() {
    //this.router.navigate(['/order/history/3']);
  }

  // for pagination
  pageChange(page) {
    this.currentPage = page;
    if(this.searchItem ||(this.dateFrom && this.dateTo)){
      this.searchByFilter(this.searchItem);
    }else{
      this.getOrderHistory();
    }
  }
  goFirstPage() {
    this.currentPage = 1;
    if(this.searchItem ||(this.dateFrom && this.dateTo)){
      this.searchByFilter(this.searchItem);
    }else{
      this.getOrderHistory();
    }
  }
  goLastPage() {
    this.currentPage = Math.ceil(this.totalItems / this.pageSize);
    if(this.searchItem ||(this.dateFrom && this.dateTo)){
      this.searchByFilter(this.searchItem);
    }else{
      this.getOrderHistory();
    }
  }

  onScroll () {
    this.common.mobileRecordsLimit+=10;
  }

  hideProfileHead() {
    this.common.showHeaderProfile = false;
  }

  eventHandler(eve) {
    this.currentPage=1;
      if (eve.target.value && eve.target.value.length > 1) {
        this.searchByFilter(eve.target.value);
      }else{
        if (eve.target.value.length < 1 ||  eve.target.value=="") {
        this.getOrderHistory();
        }
      }
    }

  resetFilter(){
    if(this.dateTo!="" || this.dateFrom!="" || this.searchItem!="")
    {
      this.getOrderHistory();
      this.dateTo="";
      this.dateFrom="";
      this.datesErrors=[];
      this.searchItem="";
      this.noRecs=false;
    }
  }

  //date format function
  formatDate(fromDate) {
    var d = new Date(fromDate),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  // Search Functionality
  searchByFilter(value) {
    this.noRecs = false;
    if(!value)
    {
      value="";
    }
    let dateFrom:string="";
    if(!this.dateFrom ){
      dateFrom="";
    }
    else{
      dateFrom=this.formatDate(this.dateFrom);
    }
    let dateTo="";
    if(!this.dateTo)
    {
      dateTo="";
    }
    else{
      dateTo=this.formatDate(this.dateTo);
    }
    let data={
      accountid:this.currentAccountId,
      type:this.typeData,
      ordertype: "orderhistory",
      searchVal: value,
      fromDate:dateFrom,
      toDate:dateTo,
      limit: this.pageSize.toString(),
      pageNumber: this.currentPage.toString()
    };
    if(value  || (this.dateFrom && this.dateTo))
    {
      if(this.datesErrors)
      {
          if(!this.datesErrors.length)
          {
            this.loading =true;
            this.order.getOrderHistory(data).subscribe((result: any) => {
              if (result) {
                this.orderHistoryData = result.recentorder;
                this.totalItems = result.recentorder.maximumSize;
                this.lastPage = Math.ceil(this.totalItems / this.pageSize);
                this.loading = false;
                this.noRecs = false;
                this.orderSubscription.unsubscribe();
                this.filterFlag=false;
              }
              else {
                this.orderHistoryData = null;
                this.totalItems = this.orderHistoryData;
                this.lastPage = Math.ceil(this.totalItems / this.pageSize);
                this.loading = false;
                this.noRecs = true;
                this.filterFlag=false;
              }
          }, (error: HttpErrorResponse) => {
            this.orderHistoryData = null;
            this.totalItems = this.orderHistoryData;
            this.lastPage = Math.ceil(this.totalItems / this.pageSize);
            this.loading = false;
            this.noRecs = true;
            this.filterFlag=false;
            this.alertService.error(ErrorMessages.serviceError, true);
          });
        }
      }
    }
    this.emptySearchState=true;
  }
  changeDate() {
    let yearFlag:boolean=false;
    let minDate=new Date("1900-01-01");
    this.datesErrors=[];
    let today = new Date();
    let to = new Date(this.dateTo);
    let from = new Date(this.dateFrom);
    if(to< minDate ||from < minDate ){
      yearFlag=true;
    }
    else{
      yearFlag=false;
    }
    if (today < from || today < to || from > to ||from.toString().indexOf("Jan 01 1970")!== -1 || to.toString().indexOf("Jan 01 1970")!== -1 ||yearFlag) {
      this.datesErrors.push(this.messages.calValidationMessage);
  }
  
  }

  //clear icon clickfunctionality
  clearSearchMob(){
    if(this.searchItem!=""){
      this.getOrderHistory();
    }
    this.searchItem="";
    this.searchFlag=false;
    this.searchAnimate=false;

  }
  showSearchBar(){
    this.searchFlag=true;
    this.filterFlag=false;
    this.searchAnimate=true;
  }

}