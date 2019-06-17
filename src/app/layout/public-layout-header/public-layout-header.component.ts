import { Component,ChangeDetectionStrategy, OnInit} from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Router,NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-public-layout-header',
  templateUrl: './public-layout-header.component.html',
  changeDetection:ChangeDetectionStrategy.Default
})
export class PublicLayoutHeaderComponent implements OnInit{
  showBackButtonIcon:boolean=false;
  navigateBack(){
    if(this.router.url === "/forgotpassword"){
      this.router.navigate(['/login']);
      this.showBackButtonIcon=false;
    }else if(this.router.url === "/register"){
      if(this.common.mobileRegistrationForm == true){
        this.router.navigate(['/register']);
        this.common.mobileRegistrationForm=false;
      }else{
        this.router.navigate(['/login']);
        this.showBackButtonIcon=false;
      }
    }else{
      this.router.navigate(['/login']);
      this.showBackButtonIcon=false;
    }
    window.scrollTo(0,0);
  }
  constructor(private common:CommonService, private router:Router) {
    //console.log("Back Button visible: ",this.showBackButtonIcon);
  }
  ngOnInit(){
    this.router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd){
        if(event.url === "/forgotpassword" || event.url === "/register" ){
          this.showBackButtonIcon=true;
        }
      }
    });
    if(this.router.url === "/forgotpassword" || this.router.url === "/register"){
      this.showBackButtonIcon=true;
    }
  }
}
