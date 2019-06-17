import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CommonService, UserAuthorizationService, AlertService } from '../../../services/index'; 
import { UserAuthorization } from '../../../model/user-authorization';
import { ErrorMessages } from '../../../messages';
@Component({
    selector: 'display-programs',
    templateUrl: './display-programs.component.html',
    styleUrls: ['./display-programs.component.scss']
})
export class DisplayProgramsComponent implements OnInit {
    programs: any = [];
    loading: boolean = false;
    mobileLoading:boolean=false;
    serviceError:boolean = false;
    serviceMessage:string = "Loading data, Please wait."
    userAuthorization: UserAuthorization; // used to store the user role for autherization purpose.

    constructor(private router: Router, private http: HttpClient ,private common: CommonService,private userAuthorizationSrvc: UserAuthorizationService,private alertService: AlertService) { }

    ngOnInit() {
        this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
       // console.log("DisplayProgramsComponent -  this.userAuthorization.editManagePrograms 2 = " + this.userAuthorization.editManagePrograms )
        this.getPrograms();
        this.hideProfileHead();
        
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
     * Fetches the Programs information from the back-end server.
     * @author Siva Sanker Reddy, on 21-Feb-2018
     */
    getPrograms() {
        this.loading = true; //display the spinner
        this.mobileLoading=true;
        this.serviceError = true;
        //Request object
        let requestObj = {
            "accountid": this.getAccountId()
        }

        this.http.post(environment.services.church.url + "getChurchPrograms", requestObj).subscribe((responseObj: any) => {
            if (responseObj) {
                this.loading = false; //stop displaying the spinner
                this.mobileLoading=false;
                this.programs = responseObj.manageProgram.records;
            }
            this.serviceError = false;
        }, (errorObj: HttpErrorResponse) => {
            this.loading = false; //stop displaying the spinner
            this.mobileLoading=false;
            this.serviceError = false;
            this.alertService.error(ErrorMessages.serviceError, true);
        });
    }

    modifyPrograms(): void {
        this.router.navigate(['/manage-church/programs/modify']);
    }

    hideProfileHead() {
        this.common.showHeaderProfile = false;
        this.common.backHeader = false;
      }
}