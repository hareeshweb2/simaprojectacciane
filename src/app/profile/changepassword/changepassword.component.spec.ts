import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepasswordComponent } from './changepassword.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';
import { CommonService,AlertService,AuthService, ProfileService } from '../../services/index';
import { getTestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn,FormArray } from '@angular/forms';
import {
    Headers, BaseRequestOptions,
    Response, HttpModule, Http, XHRBackend, RequestMethod, ResponseOptions
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('Change Password  Component', () => {
    let component: ChangepasswordComponent;
    let mockBackend: MockBackend;
    let authService:AuthService;
    let fixture: ComponentFixture<ChangepasswordComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ChangepasswordComponent],
            imports: [
                FormsModule, HttpClientModule, RouterTestingModule, ReactiveFormsModule, SharedModule
            ],
            providers: [AuthService,AlertService, ProfileService, CommonService, MockBackend,FormBuilder, {
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
    }));

    beforeEach(() => {
        authService = TestBed.get(AuthService);
        fixture = TestBed.createComponent(ChangepasswordComponent);
        component = fixture.componentInstance;
        component.ngOnInit();

    });

    /**This function is used to create change password component**/
    it('should create change password component', () => {
        expect(component).toBeTruthy();
    });

     /**it should invalidate the form if empty */
     it('form invalid when empty', () => {
        expect(component.resetPasswordForm.valid).toBeFalsy();
    });


    /**This function should check current password**/
    it('should check current password', () => {
        fixture.componentInstance.email="jyoti19rawat@mailinator.com";
        fixture.componentInstance.resetPasswordForm.value.currentPassword="Abc@1234";
        let response = {internalResponseCode: 200, message: "Current password entered is valid !"};
        spyOn(authService,'gigyaLoginChangePassword').and.returnValue(Observable.of(response));
        fixture.componentInstance.checkCurrentPass();
        fixture.detectChanges();
        expect(fixture.componentInstance.isProcessing).toBeFalsy();
    });

    /**this function should change the password */
    it('should change password', () => {
        localStorage.setItem("accessToken", '123');
        let response={"message":"Password has been updated successfully"};
        fixture.componentInstance.accessToken=localStorage.getItem('accessToken');
        fixture.componentInstance.resetPasswordForm.value.passwordGroup.newPassword='Test@123';
        fixture.componentInstance.email="jyoti19rawat@mailinator.com";
        spyOn(authService,'authchangepassword').and.returnValue(Observable.of(response));
        fixture.componentInstance.changePassword();
        fixture.detectChanges();
        expect(fixture.componentInstance.sharedMessages.successPasswordChange).toBe('Password Changed Successfully');
    });
});