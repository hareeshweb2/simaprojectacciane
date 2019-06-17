import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpasswordComponent } from './forgotpassword.component';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthService, ProfileService,AlertService } from '../services/index';
import { getTestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
        Headers, BaseRequestOptions,
        Response, HttpModule, Http, XHRBackend, RequestMethod, ResponseOptions
    } from '@angular/http';
import { fakeAsync } from '@angular/core/testing';
import { tick } from '@angular/core/testing';
import { VALID } from '@angular/forms/src/model';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';


describe('Forgot Password Component', () => {
        let mockBackend: MockBackend;
        let component: ForgotpasswordComponent;
        let profileService:ProfileService;
        let fixture: ComponentFixture<ForgotpasswordComponent>;
        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [ForgotpasswordComponent],
                imports: [
                    FormsModule, SharedModule, HttpClientModule, RouterTestingModule, ReactiveFormsModule
                ],
                providers: [AuthService, ProfileService,MockBackend,AlertService, {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory:
                        (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backend, defaultOptions);
                        }
                }]
            })
                .compileComponents();
            mockBackend = getTestBed().get(MockBackend);
        });
        beforeEach(() => {
            profileService = TestBed.get(ProfileService);
            fixture = TestBed.createComponent(ForgotpasswordComponent);
            component = fixture.componentInstance;
            component.ngOnInit();
        });
    
        /**This function is used to create forgot password component**/
        it('should create', () => {
            expect(component).toBeTruthy();
        });
        
        /**it should invalidate the form if empty */
        it('form invalid when empty', () => {
            expect(component.forgotPasswordForm.valid).toBeFalsy();
        });


        /**check email form validity */
        it('check email validity',()=>{
            let errors = {};
            let email = component.forgotPasswordForm.controls['email'];
            expect(email.valid).toBeFalsy();

            // Email field is required
            errors = email.errors || {};
            expect(errors['required']).toBeTruthy();

            // Set email to something
            email.setValue("test");
            errors = email.errors || {};
            expect(errors['required']).toBeFalsy();
            expect(errors['pattern']).toBeTruthy();

            // Set email to something correct
            email.setValue("test@example.com");
            errors = email.errors || {};
            expect(errors['required']).toBeFalsy();
            expect(errors['pattern']).toBeFalsy();
        });
     
        /** sending email to concerned user */
        it('should trigger mail to user',()=>{
            expect( fixture.componentInstance.forgotPasswordForm.valid).toBeFalsy();
            fixture.componentInstance.forgotPasswordForm.controls['email'].setValue("jyoti19rawat@mailinator.com");
            expect(fixture.componentInstance.forgotPasswordForm.valid).toBeTruthy();
            let response = {"statusCodeValue":200};
            fixture.componentInstance.forgotPasswordForm.value.email='jyoti19rawat@mailinator.com';
            spyOn(profileService,'triggerEmail').and.returnValue(Observable.of(response));
            fixture.componentInstance.submitEmail();
            fixture.detectChanges();
            expect(fixture.componentInstance.emailSendScreen).toBeTruthy();
        });
});