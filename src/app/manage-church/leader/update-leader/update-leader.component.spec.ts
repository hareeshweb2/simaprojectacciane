import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import { RouterTestingModule } from '@angular/router/testing';
import { getTestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SharedModule } from '../../../shared/shared.module';
import { Component, OnInit } from '@angular/core';
import { retry } from 'rxjs/operators/retry';
import { Router } from '@angular/router';
import { ProfileService, AuthService, UserAuthorizationService,AlertService } from '../../../services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { churchLeadersModuleMessages } from '../../../messages';
import { CommonService } from '../../../services/common.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UserAuthorization } from '../../../model/user-authorization';
import { Subscription } from 'rxjs/Subscription';
import { NgxPaginationModule } from 'ngx-pagination'; //for pagination
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { UpdateLeaderComponent } from './update-leader.component';
import {
    Headers, BaseRequestOptions,
    Response, HttpModule, Http, XHRBackend, RequestMethod, ResponseOptions
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { WindowScrolling } from "../../../services/windowScrolling.service";

describe('Leader List Component', () => {
    let component: UpdateLeaderComponent;
    let fixture: ComponentFixture<UpdateLeaderComponent>;
    let mockBackend: MockBackend;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UpdateLeaderComponent],
            imports: [
                NgxPaginationModule,FormsModule, SharedModule, HttpClientModule, ReactiveFormsModule, RouterTestingModule,
            ],
            providers: [AuthService,AlertService, CommonService, ProfileService,WindowScrolling, UserAuthorizationService,MockBackend,BaseRequestOptions,{
                provide: Http,
                deps: [MockBackend, BaseRequestOptions],
                useFactory:
                    (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
            }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
            mockBackend = getTestBed().get(MockBackend);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UpdateLeaderComponent);
        component = fixture.componentInstance;
    });

    it('should create leader list', () => {
        expect(component).toBeTruthy();
    });
    
    it('should show the loading for ldeader list', () => {
        fixture.componentInstance.getLeaderData();
        fixture.detectChanges();
        expect(fixture.componentInstance.loading).toBeTruthy();
        
    });
    
/**it should get  leader list  **/
it('List of leaders to be defined', () => {
    localStorage.setItem("token", '123');
    const mockResponse = {
        "churchmembers": {
          "totalSize": 9,
          "done": true,
          "records": [
            {
              "attributes": {
                "type": "npe5__Affiliation__c",
                "url": "/services/data/v29.0/sobjects/npe5__Affiliation__c/a0H3D000001td1MUAQ"
              },
              "Contact_Name__c": "Genghis khan",
              "npe5__Contact__r": {
                "attributes": {
                  "type": "Contact",
                  "url": "/services/data/v29.0/sobjects/Contact/0033D00000NN0J5QAL"
                },
                "Email": "bablu@mailinator.com"
              },
              "Awana_Role__c": "Awana Ministry Director;GO Coordinator;LIT",
              "Church_Role__c": "Church Volunteer;Youth Pastor / Director;Pastor / Associate Pastor",
              "npe5__Contact__c": "0033D00000NN0J5QAL",
              "Organization_Owner__c": false,
              "Mozo_User_Level__c": "LMS",
              "npe5__Status__c": "Current",
              "npe5__Organization__c": "0013D00000PwFxFQAV",
              "Id": "a0H3D000001td1MUAQ",
              "Authorized_Purchaser__c": false,
              "npe5__Organization__r": {
                "attributes": {
                  "type": "Account",
                  "url": "/services/data/v29.0/sobjects/Account/0013D00000PwFxFQAV"
                },
                "Name": "Mount Zion Baptist Church"
              }
            }
          ]
        }
      };
    getTestBed().compileComponents().then(() => {
        let mockBackend = getTestBed().get(MockBackend);        
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
        });
        fixture.componentInstance.getLeaderData();
        fixture.detectChanges();
        expect(fixture.componentInstance.getLeaderData).toBeDefined();
    })

});
});
