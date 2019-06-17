// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { churchLeadersModuleMessages } from '../../../messages';
// import { CommonService } from '../../../services/common.service';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
// import { RouterTestingModule } from '@angular/router/testing';
// import { getTestBed } from '@angular/core/testing';
// import { Component, OnInit } from '@angular/core';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
// import { HttpErrorResponse } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { ProfileService, AuthService } from '../../../services/index';
// import { Subscription } from 'rxjs/Subscription';
// import { LeaderDetailComponent } from './leader-detail.component';
// import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
// import { SharedModule } from '../../../shared/shared.module';

// describe('leader detail Component', () => {
//     let component: LeaderDetailComponent;
//     let fixture: ComponentFixture<LeaderDetailComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [LeaderDetailComponent],
//             imports: [
//                 FormsModule, SharedModule, HttpClientModule, ReactiveFormsModule, RouterTestingModule, AngularMultiSelectModule
//             ],
//             providers: [AuthService, CommonService, ProfileService],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA]
//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(LeaderDetailComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     /**This function is used to create LeaderDetailComponent component**/
//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     /**
//      * This functions is used if email Id already exists or not
//      */
//     // it('should check existing leader', () => {
//     //     //initialization of service
//     //     let profileService: ProfileService = getTestBed().get(ProfileService);
//     //     //initialization of mock request and reresponse data
//     //     const reqData = {
//     //         email: "balakrishnan.rajendran@accionlabs.com",
//     //         api_token: ''
//     //     }
//     //     const resData = {
//     //         "data":
//     //             {
//     //                 "Id": "0033D00000NF1nZQAT",
//     //                 "FirstName": "Bala",
//     //                 "LastName": "myAwana",
//     //                 "Name": "Bala myAwana",
//     //                 "Email": "balakrishnan.rajendran@accionlabs.com",
//     //                 "Phone": "(999) 999-9999",
//     //                 "AccountId": "0013D00000PwFxQQAV",
//     //                 "Gigya_UID": null
//     //             }
//     //     };

//     //     // function service call with expectations
//     //     profileService.checkExistingEmail(reqData).subscribe(
//     //         (data) => {
//     //             // kick off an asynchronous call in the background
//     //             setTimeout(() => {
//     //                 expect(data).toBeDefined();
//     //                 expect(data).toBe(resData)
//     //             }, 5000);
//     //         }
//     //     )
//     // });


//     /*** This function is used to invite leader*/
//     // it('should Invite Leader', () => {
//     //     //initialization of service
//     //     let profileService: ProfileService = getTestBed().get(ProfileService);

//     //     //initialization of mock request and reresponse data
//     //     const reqData = {
//     //         "email": "balakrishnan.rajendran@accionlabs.com",
//     //         "first_name": "Bala", "last_name": "myAwana",
//     //         "sender_name": "Balakrishnan",
//     //         "token": "00D3D000000DJuR!ARUAQF7oxoCwwHRcO0n9yK3vKdY1cqAdPgc6aVSZK59FBRF8Q0cGCa4QNk7V.JLtjMkyd84opHbNRZCQUSwlCzthMPG_M6IO",
//     //         "isNew": false,
//     //         "contactId": "0033D00000NF1nZQAT",
//     //         "accountId": "0013D00000QDkiQQAT",
//     //         "awanaRoles": "Alumni / Award Recipient",
//     //         "churchRoles": "Children's Pastor / Director",
//     //         "mozo_level": "Full", "accountOwner": "true",
//     //         "authorizedPurchaser": "false"
//     //     }
//     //     const resData = {
//     //         "data": {
//     //             "message": "<bcadf94f-9826-79c9-9175-c4eec710baef@accionlabs.com>"
//     //         }
//     //     }

//     //     // function service call with expectations
//     //     profileService.inviteUser(reqData).subscribe(
//     //         (data) => {
//     //             setTimeout(() => {
//     //                 expect(data).toBeDefined()
//     //                 expect(data).toBe(resData)
//     //             }, 5000);
//     //         }
//     //     )
//     // })

// });
