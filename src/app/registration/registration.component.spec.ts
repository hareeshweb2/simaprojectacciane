import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { OnReturnDirective } from '../pipes/enterTab';
import { TrimPipe } from '../pipes/trim.pipe';
import { PhonePipe } from '../pipes/telFormat.pipe';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MockBackend } from '@angular/http/testing'
import { AuthService, ProfileService, AlertService } from '../services/index';
import { CommonService } from '../services/common.service';
import { RouterTestingModule } from '@angular/router/testing';
import { getTestBed } from '@angular/core/testing';
import { RecaptchaModule, RecaptchaLoaderService } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BaseRequestOptions, Jsonp, Http, HttpModule } from '@angular/http';

describe('User Registration Component', () => {
    let component: RegistrationComponent;
    let fixture: ComponentFixture<RegistrationComponent>;
    // let backend = MockBackend;
    // let profileService = ProfileService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegistrationComponent, OnReturnDirective, TrimPipe, PhonePipe],
            imports: [
                FormsModule, SharedModule, HttpClientModule, RouterTestingModule, RecaptchaModule, RecaptchaFormsModule
            ],
            providers: [AuthService,CommonService,ProfileService,RecaptchaLoaderService,AlertService],
            /**
             * ,
            BaseRequestOptions,{
                provider:Http,
                useFactory:(backend,options)=> new Http(backend,options),
                deps:[MockBackend,BaseRequestOptions]
            }
             */
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
        // backend = TestBed.get(MockBackend);
        // profileService = TestBed.get(ProfileService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    /**This function is used to create registration component**/
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**
     * This functions is used if email Id already exists or not
     */
    it('should check existing user', () => {
        //initialization of service
        let profileService: ProfileService = getTestBed().get(ProfileService);
        //initialization of mock request and reresponse data
        const reqData = { email: "balakrishnan.rajendran@accionlabs.com" }
        const resData = {"data":{"Id":"0033D00000NF1nZQAT","FirstName":"Bala","LastName":"myAwana","Name":"Bala myAwana","Email":"balakrishnan.rajendran@accionlabs.com","Phone":"(999) 999-9999","AccountId":"0013D00000PwFxQQAV","Gigya_UID":null}}
        // function service call with expectations
        profileService.checkExistingEmail(reqData).subscribe(
            (data) => {
                // kick off an asynchronous call in the background
                setTimeout(() => {
                    expect(data).toBeDefined();
                    expect(data).toBe(resData)
                }, 5000);
            }
        )
    });


    /*** This function is used to register new user*/
    // it('should register new user', () => {
    //     //initialization of service
    //     let profileService: ProfileService = getTestBed().get(ProfileService);

    //     //initialization of mock request and reresponse data
    //     const reqData = {"firstName":"test","lastName":"test","email":"seema0@mailinator.com","password":"Myawana@1","date":"18","year":"2000","month":"01"}
    //     const resData = {"data":{"ContactId":"0033D00000NfHsLQAV","UID":"70ff8255fd214e948c732cda3548c9a4","token":"00D3D000000DJuR!ARUAQGLqk7Bz_1WXvCHRNkfUF6Sd4dnvEvC4DFHSMpXnd_xbBtRJJGJ2GQw4DY5tYeME1hOrmnRD0kM_4DjHTkHzUfmVk0of"}}

    //     // function service call with expectations
    //     profileService.registration(reqData).subscribe(
    //         (data) => {
    //             setTimeout(() => {
    //                 expect(data).toBeDefined()
    //                 expect(data).toBe(resData)
    //             }, 5000);
    //         }
    //     )
    // })

    /*** This function is used to register new user: Email Already Exits*/
    it('should response Email Already Exits', () => {
        //initialization of service
        let profileService: ProfileService = getTestBed().get(ProfileService);

        //initialization of mock request and reresponse data
        const reqData = {"firstName":"test","lastName":"test","email":"seema0@mailinator.com","password":"Myawana@1","date":"18","year":"2000","month":"01"}
        //const resData = {"data":{"ContactId":"0033D00000NfHsLQAV","UID":"70ff8255fd214e948c732cda3548c9a4","token":"00D3D000000DJuR!ARUAQGLqk7Bz_1WXvCHRNkfUF6Sd4dnvEvC4DFHSMpXnd_xbBtRJJGJ2GQw4DY5tYeME1hOrmnRD0kM_4DjHTkHzUfmVk0of"}}

        // function service call with expectations
        profileService.registration(reqData).subscribe(
            (data:any) => {
                //setTimeout(() => {
                    expect(data).toBeDefined()
                    expect(data.statusCode).toEqual(412);
                    console.log("Data:",data);
                    //expect(data).toBe(resData)
                //}, 5000);
            },
            (error) =>{
                //setTimeout(() => {
                    expect(error.error).toBeDefined();
                    expect(JSON.stringify(error.error)).toEqual(JSON.stringify({"message": "email already exists"}));
                //}, 5000);
                //expect(error.error.message).toMatch("email already exists");
            }
        )
    })


     /*** This function is used to register new user using Social media*/
    //  it('should register new user using social', () => {
    //     //initialization of service
    //     let profileService: ProfileService = getTestBed().get(ProfileService);

    //     //initialization of mock request and reresponse data
    //     //initialization of mock request and reresponse data
    //     const reqData = 
    //     { ContactId:"0033D00000NTjQ0QAL",UID:"_guid_IP8vpzxmp4H2Vt1l2eExHEqdSVsGEnPPbhlbCenlZWg=",email:"yourtestin@gmail.com",firstName:"Testing",
    //         lastName:"My",photoURL:"https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=500",
    //         thumbnailURL:"https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50"}

    //     const resData = {
    //          "userdetails": {
    //         "loginObj": {
    //           "UID": "_guid_IP8vpzxmp4H2Vt1l2eExHEqdSVsGEnPPbhlbCenlZWg=",
    //           "firstName": "test",
    //           "lastName": "test",
    //           "photoURL": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=500",
    //           "thumbnailURL": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50",
    //           "email": "yourtestin@gmail.com",
    //           "ContactId": "0033D00000Nf9FpQAJ"
    //         },
    //         "userObj": {
    //           "Id": "0033D00000Nf9FpQAJ",
    //           "FirstName": "test",
    //           "LastName": "test",
    //           "Email": "yourtestin@gmail.com",
    //           "MobilePhone": "",
    //           "WorkPhone": "",
    //           "HomePhone": "",
    //           "Birthdate": "2000-01-19",
    //           "AccountId": "0013D00000QNyNwQAL",
    //           "BillingStreet_1": "",
    //           "BillingStreet_2": "",
    //           "BillingStreet_3": "",
    //           "BillingCity": "",
    //           "BillingState": "",
    //           "BillingPostalCode": "",
    //           "BillingCountry": "United States",
    //           "ShippingStreet_1": "",
    //           "ShippingStreet_2": "",
    //           "ShippingStreet_3": "",
    //           "ShippingCity": "",
    //           "ShippingState": "",
    //           "ShippingPostalCode": "",
    //           "ShippingCountry": "",
    //           "IntacctID__c": ""
    //         },
    //         "token": 199717715398619
    //       }
    //     };
        
    //     // function service call with expectations
    //     profileService.socialLogin(reqData).subscribe(
    //         (data) => {
    //             setTimeout(() => {
    //                 expect(data).toBeDefined()
    //                 expect(data).toBe(resData)
    //             }, 5000);
    //         }
    //     )
    // })

});