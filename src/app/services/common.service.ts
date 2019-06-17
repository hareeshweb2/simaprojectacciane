import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Injectable()
export class CommonService {
  mobileRegistrationForm:boolean=false;
  showBackbutton:boolean=false;
  showSidebar:string="hidden";
  articleUrl="articles";
  showHeaderProfile:boolean=false;
  churchHeader:boolean = false;
  navigationClose:string='visible';
  backHeader:boolean = false;
  backHeaderName:string = "Approve Leader";
  mobileRecordsLimit:number=10;
  userAuthorization;
  leaderObj:Object;
  constructor(private _http:HttpClient) {}

  getArticles():any{
    return this._http.get( environment.api_url+this.articleUrl);
  }
  
  getStates(){
    return this._http.get(environment.services.user.url+"getUSStatesInfo");
  }
  
  records:any=[
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'View order History',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Order History',
      Date:'19/01/2018',
      read:'false'
    },
    {
      Heading:'Churches approved and added to  Profile',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'My Profile',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'View order History',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Order History',
      Date:'10/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'16/04/2018',
      read:'false'
    },
    {
      Heading:'please add church to your profile',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Add your church',
      Date:'20/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'View order History',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Order History',
      Date:'19/01/2018',
      read:'false'
    },
    {
      Heading:'Churches approved and added to  Profile',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'My Profile',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'View order History',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Order History',
      Date:'10/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'16/04/2018',
      read:'false'
    },
    {
      Heading:'please add church to your profile',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Add your church',
      Date:'20/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    },
    {
      Heading:'new Orders added',
      Description:'Lorem Ipsum is simply dummy text of the printing and typesetting industry Lorem Ipsum is simply dummy text of the printing.',
      Page:'Recent Orders',
      Date:'04/04/2018',
      read:'false'
    }
  ]

  getNotificationRecords(){
    return this.records;
  }
  setLeaderObj(leaderObj){
    this.leaderObj = leaderObj;
  }
  getLeaderObj(){
    return this.leaderObj;
  }
}
