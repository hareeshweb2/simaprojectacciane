import { ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CommonService } from '../../services/common.service';
import { HttpClientModule } from '@angular/common/http';
import { ProfileService } from '../../services/profile.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { PhonePipe } from '../pipes/telFormat.pipe';
import {
    Headers, BaseRequestOptions,
    Response, HttpModule, Http, XHRBackend, RequestMethod, ResponseOptions
} from '@angular/http';
import {Component, OnInit, AfterViewInit, OnChanges, Input, ChangeDetectionStrategy,ViewChild, HostListener, ElementRef, OnDestroy} from '@angular/core';
import { NgForm } from '@angular/forms';
// import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { SearchService, AlertService } from '../../services/index';
import 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { environment } from '../../../environments/environment';
import { profileInputValidations,myProfileLabelsAndMessages } from '../../messages';
import { commonRegex } from '../../regex';
import { User } from '../../model/user';
import { suggestAddress } from '../../model/suggestAddress';
import { Router } from '@angular/router';
import { PhoneNumberConverter } from '../../util/phoneNumberConverter';
import { WindowScrolling } from "../../services/windowScrolling.service";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { InsertCommaAndSpacePipe } from '../../pipes/appendCommaAndSpace.pipe'
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { TextMaskModule } from 'angular2-text-mask';
import { ZipCodePipe } from '../../profile/pipes/zipCodeFormat.pipe';
import {AppendCommaAndSpacePipe} from '../../profile/pipes/comma&space.pipe';
import { CustomMaterialModule } from '../../shared/custom.material.module';
import { Observable } from 'rxjs/Observable';
describe('User Profile Details Component', () => {
    let component: DetailComponent;
    let mockBackend: MockBackend;
    let profileService:ProfileService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DetailComponent, PhonePipe,ZipCodePipe,AppendCommaAndSpacePipe],
            imports: [
                FormsModule, SharedModule, HttpClientModule, RouterTestingModule,TextMaskModule,CustomMaterialModule
            ],
            providers: [AlertService,CommonService, ProfileService, MockBackend, BaseRequestOptions,SearchService,WindowScrolling,
                {
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
       profileService=TestBed.get(ProfileService);
    });

    it('should create ', () => {
        let fixture: ComponentFixture<DetailComponent>;
        fixture = TestBed.createComponent(DetailComponent);
        component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });
    it('should show the loader', () => {
        let fixture: ComponentFixture<DetailComponent> = getTestBed().createComponent(DetailComponent);
        const mockResponse = {"userProfileDetails":{"Id":"0033D00000NuOdYQAV","FirstName":"Barbara","LastName":"Rivera","Email":"ac@mailinator.com","MobilePhone":"(883) 473-4872","WorkPhone":"(523) 452-3452","HomePhone":"(674) 357-3453","Birthdate":"1985-12-19","AccountId":"0013D00000T7CcGQAV","BillingStreet_1":"423 Ayers Pl","BillingStreet_2":"","BillingStreet_3":"","BillingCity":"Geneva","BillingState":"OR","BillingPostalCode":"99999","BillingCountry":"United States","ShippingStreet_1":"4901 Cumbre Del Sur Ct NE","ShippingStreet_2":"","ShippingStreet_3":"","ShippingCity":"Albuquerque","ShippingState":"KY","ShippingPostalCode":"87111-2991","ShippingCountry":"United States","IntacctID__c":"1215952"}}
        profileService.currentProfile.user.UID="0033D00000NuOdYQAV";
        spyOn(profileService, 'getUserInfoProfile').and.returnValue(Observable.of(mockResponse));
        fixture.componentInstance.getFormData();
        fixture.detectChanges();
        expect(fixture.componentInstance.loading).toBeFalsy();
    });



    it('should create dialog box', () => {
        let fixture: ComponentFixture<DetailComponent> = getTestBed().createComponent(DetailComponent);
        fixture.componentInstance.openDialog();
        fixture.detectChanges();
        expect(fixture.componentInstance.showDialog).toBeTruthy();
        
    });
    
    it('should pull profile data for induvidual profile', () => {
        let fixture: ComponentFixture<DetailComponent> = getTestBed().createComponent(DetailComponent);
        const mockResponse = {"userProfileDetails":{"Id":"0033D00000NuOdYQAV","FirstName":"Barbara","LastName":"Rivera","Email":"ac@mailinator.com","MobilePhone":"(883) 473-4872","WorkPhone":"(523) 452-3452","HomePhone":"(674) 357-3453","Birthdate":"1985-12-19","AccountId":"0013D00000T7CcGQAV","BillingStreet_1":"423 Ayers Pl","BillingStreet_2":"","BillingStreet_3":"","BillingCity":"Geneva","BillingState":"OR","BillingPostalCode":"99999","BillingCountry":"United States","ShippingStreet_1":"4901 Cumbre Del Sur Ct NE","ShippingStreet_2":"","ShippingStreet_3":"","ShippingCity":"Albuquerque","ShippingState":"KY","ShippingPostalCode":"87111-2991","ShippingCountry":"United States","IntacctID__c":"1215952"}}
        profileService.currentProfile.user.UID="0033D00000NuOdYQAV";
        // Spying on service
        spyOn(profileService, 'getUserInfoProfile').and.returnValue(Observable.of(mockResponse));
        fixture.componentInstance.getFormData();
        // detect change
        fixture.detectChanges();
        // Expectations
        expect(fixture.componentInstance.userProfile).toBeDefined();
        expect(fixture.componentInstance.serviceError).toBeFalsy();
    });
});