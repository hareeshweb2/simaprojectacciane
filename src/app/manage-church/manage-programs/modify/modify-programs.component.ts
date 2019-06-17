
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ProfileService } from '../../../services/profile.service';
import { commonRegex } from '../../../regex';
import { profileInputValidations, ErrorMessages } from '../../../messages';
import { UserAuthorization } from '../../../model';
import { UserAuthorizationService, AlertService } from '../../../services';

@Component({
    selector: 'modify-programs',
    templateUrl: './modify-programs.component.html',
    styleUrls: ['./modify-programs.component.scss']
})
export class ModifyProgramsComponent implements OnInit {
    messages = profileInputValidations;
    programs: any = [];
    loading: boolean = false;
    statusMessage: string; //to display message if the update is successful.
    programsData: any = {};
    meetingDayEmpty = false; //to validate if the meeting day is empty.
    noOfKidsEmpty = false;
    disableSaveButton = false; //enable the Save button.
    meetingDayErrorMessage = []; //to display error message if the meeting day is empty.
    noOfKidsErrorMessage = this.messages.noOfKidsErrorMessage;
    noOfKidsIfEmptyErrorMessage = []; //to display error message if the no of kids is empty;
    noOfKidsInvalidNumberErrorMessage = this.messages.noOfKidsInvalidNumberErrorMessage;
    commonRegex = commonRegex;
    proceedToSave: boolean; //if this value is true, then only save is allowed. If not there are some validation errors.
    serviceError:boolean = false;
    serviceMessage:string = "Loading data, Please wait."
    mobileLoading:boolean=false;
    userAuthorization: UserAuthorization; // used to store the user role for autherization purpose.


    //constructor
    constructor(private router: Router, private http: HttpClient, private userAuthorizationSrvc: UserAuthorizationService,private alertService: AlertService) { }

    ngOnInit() {
        window.scrollTo(0, 0);        
        //check user authorization level and redirect to forbidden page, if user is not authorized.
        this.userAuthorization = this.userAuthorizationSrvc.getUserAuthorizationObject(this.getAccountId());
        if(this.userAuthorization.editManagePrograms == false){
            this.router.navigate(['/forbidden']);
        }
        this.getPrograms();
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
        this.disableSaveButton = true; //disable the Save button.
        //Request object
        let requestObj = {
            "accountid": this.getAccountId()
        }

        this.http.post(environment.services.church.url + "getChurchPrograms", requestObj).subscribe((responseObj: any) => {
            if (responseObj) {
                this.loading = false; //stop displaying the spinner
                this.mobileLoading=false;
                this.programsData = responseObj;
                this.programs = this.programsData.manageProgram.records;
            }
            this.serviceError = false;
        }, (errorObj: HttpErrorResponse) => {
            this.loading = false; //stop displaying the spinner
            this.mobileLoading=false;
            this.serviceError = false;
            this.alertService.error(ErrorMessages.serviceError, true);
        });
    }

    /**
     * Save the modified Programs information from the back-end server.
     * @author Siva Sanker Reddy, on 22-Feb-2018
     */

    saveModifiedPrograms(): void {
        this.loading = true; //display the spinner
        this.disableSaveButton = true; //disable the Save button.
        this.proceedToSave = true; //stops saving the information if there are any validation error on the page.
        this.programsData.manageProgram.records = this.programs; // copy all the modified programs array, back into the JSON object.
        this.meetingDayErrorMessage = [];
        for (let i = 0; i < this.programsData.manageProgram.records.length; i++) {

            if ((this.programsData.manageProgram.records[i]["isActive"]) === true) {
                //check if mandatory meeting-day is selected or not, and show error in html
                if ((this.programsData.manageProgram.records[i]["meetingDay"]) === null) {
                    this.meetingDayEmpty = true;
                    this.proceedToSave = false;
                    this.loading = false;
                    this.meetingDayErrorMessage[i] = this.messages.meetingDayErrorMessage;
                }

                //check if mandatory field 'no. of kids' is entered and the value is a valid number or not, and show error in html
                if (this.programsData.manageProgram.records[i]["noOfKids"] === null
                    || isNaN(this.programsData.manageProgram.records[i]["noOfKids"])
                    || Number(this.programsData.manageProgram.records[i]["noOfKids"]) < 0
                    || (this.programsData.manageProgram.records[i]["noOfKids"] === '')) {
                    this.noOfKidsEmpty = true;
                    this.proceedToSave = false;
                    this.loading = false;
                    this.noOfKidsIfEmptyErrorMessage[i] = this.messages.noOfKidsInvalidNumberErrorMessage;
                }
            }
        }

        //Proceed to save only if there are no validation errors.
        if (this.proceedToSave === true) {

            //Convert the JSON object to the required format by back-end.
            let programsObj = { "compositeRequest": [] };
            let j = 0; //to increment only on demand
            for (let i = 0; i < this.programsData.manageProgram.records.length; i++) {
                let tempProgram = this.programsData.manageProgram.records[i];
                //construct the program object one by one
                let obj = {};
                //create the body object
                let bodyObj = {};

                if (tempProgram.Id) { //modify the existing program
                    obj["method"] = "PATCH"; //modify
                    obj["url"] = "/services/data/v41.0/sobjects/Program__c/" + tempProgram.Id;
                    obj["referenceId"] = tempProgram.Id;

                    bodyObj["Active__c"] = tempProgram.isActive + '';
                    if (tempProgram.isActive === true) {
                        bodyObj["MeetingDay__c"] = tempProgram.meetingDay;
                        bodyObj["Attendance__c"] = tempProgram.noOfKids + '';
                    } else {
                        bodyObj["MeetingDay__c"] = null;
                        bodyObj["Attendance__c"] = null;
                    }
                    //add body object to the program object.
                    obj["body"] = bodyObj;

                    //add the created program object
                    programsObj.compositeRequest[j++] = obj;
                } else if (tempProgram.isActive === true) { //create a new program only if the current status is active
                    obj["method"] = "POST";//create
                    obj["url"] = "/services/data/v41.0/sobjects/Program__c/";
                    obj["referenceId"] = tempProgram.programName;
                    bodyObj["Name"] = tempProgram.programName;
                    bodyObj["Account__c"] = this.getAccountId(); //church id
                    bodyObj["Active__c"] = tempProgram.isActive + '';
                    bodyObj["Type__c"] = tempProgram.programName;
                    if (tempProgram.isActive === true) {
                        bodyObj["MeetingDay__c"] = tempProgram.meetingDay;
                        bodyObj["Attendance__c"] = tempProgram.noOfKids + '';
                    } else {
                        bodyObj["MeetingDay__c"] = null;
                        bodyObj["Attendance__c"] = null;
                    }
                    //add body object to the program object.
                    obj["body"] = bodyObj;

                    //add the created program object
                    programsObj.compositeRequest[j++] = obj;
                }
            }

            //Convert the JSON object to the required format by back-end.
            let obj1 = JSON.stringify(programsObj);
            let regEx1 = /"/gi;  // double cotes
            let obj2 = obj1.replace(regEx1, "\"");
            let regEx2 = /\//gi; // forward slashes
            let obj3 = obj2.replace(regEx2, "\/");

            //Request object
            let requestObj = {
                "programjson": obj3,
                "accountId": this.getAccountId()
            }

            this.http.post(environment.services.church.url + "updateChurchProgram", requestObj).subscribe((responseObj: any) => {
                if (responseObj) {
                    //go to display page
                    this.loading = false; //stop displaying the spinner
                    this.router.navigate(['manage-church/programs']); //go to parent page.
                }
            }, (errorObj: HttpErrorResponse) => {
                this.loading = false; //stop displaying the spinner
                this.alertService.error(ErrorMessages.serviceError, true);
            });
        }
    }

    cancel(): void {
        this.router.navigate(['manage-church/programs']);
    }

    enableSaveButton(): void {
        this.disableSaveButton = false; //enable the Save button.  
    }

}