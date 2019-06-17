import { Component,ChangeDetectionStrategy,OnInit,AfterViewInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ProfileService } from '../../services';
import { Currentprofile } from '../../model';
import { HttpErrorResponse } from '@angular/common/http';
import { GigyaClass } from '../../util/gigya-class';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  changeDetection:ChangeDetectionStrategy.Default
 // providers: [CommonService]
})
export class AppLayoutComponent implements OnInit,AfterViewInit{
  gigClass:GigyaClass;
  constructor(private common:CommonService,private profile: ProfileService) {
    this.gigClass = new GigyaClass(this.profile);
   }
  ngOnInit(){
    gigya.accounts.getAccountInfo({ callback: this.getAccountInfoResponse.bind(this) });
  }
  ngAfterViewInit(){

  }
  getAccountInfoResponse(response) {
    if(response.status == "FAIL"){
      gigya.socialize.logout({ callback: this.gigClass.onLogoutResponse.bind(this) });
    }else{
      let profile=JSON.parse(localStorage.getItem('profile'));
      if(response.UID != profile.user.UID){
        localStorage.clear();
        console.log("SSO User and Site User is not Matched",response.UID,"Site ID",profile.user.UID);
      }
    }
  }

}
