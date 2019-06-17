import { ProfileService } from "../services";
import { Currentprofile } from "../model";
import { HttpErrorResponse } from "@angular/common/http";

export class GigyaClass {

    constructor(private profile:ProfileService){

    }

    onLogoutResponse(responseObj) {
        if(responseObj.status =="OK" && localStorage.getItem('token')){
          this.profile.logout().subscribe((result:any)=>{
            localStorage.removeItem('token');
            localStorage.removeItem("profile");
            localStorage.removeItem('Id');
            localStorage.removeItem("AccountId");
            localStorage.removeItem("showNotification");
            localStorage.removeItem("social");
            localStorage.removeItem('showTrailExpiry');
            this.profile.currentProfile = new Currentprofile();
            localStorage.clear();
            window.location.pathname = "/login";
          },(error:HttpErrorResponse)=>{
            //console.log("Error:",error);
          })
        }
        
      }
}
