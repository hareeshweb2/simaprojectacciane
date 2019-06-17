import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { InsertPeiodInDateFormatPipe } from '../../pipes/insertPeriodInDateFormat.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import {
    Headers, BaseRequestOptions,
    Response, HttpModule, Http, XHRBackend, RequestMethod, ResponseOptions
} from '@angular/http';
import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, HostListener } from '@angular/core';
import { OrderService, AuthService, ProfileService, CommonService, UserAuthorizationService,AlertService } from '../../services/index';
import { Subscription } from 'rxjs/Subscription';
import { HttpErrorResponse } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {historyModuleMessages} from '../../messages';
import { from } from 'rxjs/observable/from';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { UserAuthorization } from '../../model';
import {MatNativeDateModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { URLSearchParams } from '@angular/http';

describe('Order History Component', () => {
    let component: HistoryComponent;
    let fixture: ComponentFixture<HistoryComponent>;
    let mockBackend: MockBackend;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HistoryComponent, InsertPeiodInDateFormatPipe],
            imports: [
                FormsModule, SharedModule, HttpClientModule, RouterTestingModule, NgxPaginationModule,MatNativeDateModule,MatDatepickerModule,MatSelectModule
            ],
            providers: [AuthService,AlertService, ProfileService, OrderService, MockBackend, BaseRequestOptions, CommonService,UserAuthorization,UserAuthorizationService,
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
    }));
   
    beforeEach(() => {
        fixture = TestBed.createComponent(HistoryComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    /**it should get  orders for individual **/
    it('order History Data to be defined', () => {
        localStorage.setItem("token", '123');
        const mockResponse = { 
            "recentorder":{"totalSize":21,"done":true,"records":[{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BqG6QAK"},"Id":"8013D000000BqG6QAK","AccountId":"0013D00000T7CcGQAV","TotalAmount":9.95,"Type":null,"OrderNumber":"00972290","CreatedDate":"2018-04-26T06:45:55.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BoolQAC"},"Id":"8013D000000BoolQAC","AccountId":"0013D00000T7CcGQAV","TotalAmount":17.9,"Type":null,"OrderNumber":"00972265","CreatedDate":"2018-04-17T20:22:11.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BoobQAC"},"Id":"8013D000000BoobQAC","AccountId":"0013D00000T7CcGQAV","TotalAmount":233.88,"Type":null,"OrderNumber":"00972263","CreatedDate":"2018-04-17T20:17:15.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000Bol3QAC"},"Id":"8013D000000Bol3QAC","AccountId":"0013D00000T7CcGQAV","TotalAmount":17.9,"Type":null,"OrderNumber":"00972258","CreatedDate":"2018-04-17T07:09:53.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BokyQAC"},"Id":"8013D000000BokyQAC","AccountId":"0013D00000T7CcGQAV","TotalAmount":89.55,"Type":null,"OrderNumber":"00972257","CreatedDate":"2018-04-17T07:07:30.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BoIdQAK"},"Id":"8013D000000BoIdQAK","AccountId":"0013D00000T7CcGQAV","TotalAmount":68.6,"Type":null,"OrderNumber":"00972249","CreatedDate":"2018-04-16T06:47:21.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BoIYQA0"},"Id":"8013D000000BoIYQA0","AccountId":"0013D00000T7CcGQAV","TotalAmount":29.85,"Type":null,"OrderNumber":"00972248","CreatedDate":"2018-04-16T06:46:03.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BnvQQAS"},"Id":"8013D000000BnvQQAS","AccountId":"0013D00000T7CcGQAV","TotalAmount":49.75,"Type":null,"OrderNumber":"00972214","CreatedDate":"2018-04-12T07:02:51.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BnvGQAS"},"Id":"8013D000000BnvGQAS","AccountId":"0013D00000T7CcGQAV","TotalAmount":1673.91,"Type":null,"OrderNumber":"00972212","CreatedDate":"2018-04-12T06:58:15.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BnvBQAS"},"Id":"8013D000000BnvBQAS","AccountId":"0013D00000T7CcGQAV","TotalAmount":49.75,"Type":null,"OrderNumber":"00972211","CreatedDate":"2018-04-12T06:50:11.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BnumQAC"},"Id":"8013D000000BnumQAC","AccountId":"0013D00000T7CcGQAV","TotalAmount":4.75,"Type":null,"OrderNumber":"00972210","CreatedDate":"2018-04-11T12:41:53.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BnucQAC"},"Id":"8013D000000BnucQAC","AccountId":"0013D00000T7CcGQAV","TotalAmount":4105.55,"Type":null,"OrderNumber":"00972208","CreatedDate":"2018-04-11T11:32:38.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BnsCQAS"},"Id":"8013D000000BnsCQAS","AccountId":"0013D00000T7CcGQAV","TotalAmount":728.85,"Type":null,"OrderNumber":"00972189","CreatedDate":"2018-04-11T07:56:43.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000Bns7QAC"},"Id":"8013D000000Bns7QAC","AccountId":"0013D00000T7CcGQAV","TotalAmount":26560.95,"Type":null,"OrderNumber":"00972188","CreatedDate":"2018-04-11T07:53:44.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000Bns2QAC"},"Id":"8013D000000Bns2QAC","AccountId":"0013D00000T7CcGQAV","TotalAmount":14300,"Type":null,"OrderNumber":"00972187","CreatedDate":"2018-04-11T07:52:12.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BnrnQAC"},"Id":"8013D000000BnrnQAC","AccountId":"0013D00000T7CcGQAV","TotalAmount":243.1,"Type":null,"OrderNumber":"00972185","CreatedDate":"2018-04-11T07:49:02.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BnriQAC"},"Id":"8013D000000BnriQAC","AccountId":"0013D00000T7CcGQAV","TotalAmount":4830.85,"Type":null,"OrderNumber":"00972184","CreatedDate":"2018-04-11T07:47:26.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BnrdQAC"},"Id":"8013D000000BnrdQAC","AccountId":"0013D00000T7CcGQAV","TotalAmount":7150,"Type":null,"OrderNumber":"00972183","CreatedDate":"2018-04-11T07:45:38.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BnrYQAS"},"Id":"8013D000000BnrYQAS","AccountId":"0013D00000T7CcGQAV","TotalAmount":995,"Type":null,"OrderNumber":"00972182","CreatedDate":"2018-04-11T07:44:28.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BnaCQAS"},"Id":"8013D000000BnaCQAS","AccountId":"0013D00000T7CcGQAV","TotalAmount":49.75,"Type":null,"OrderNumber":"00972080","CreatedDate":"2018-04-09T15:44:44.000+0000"},{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BnYZQA0"},"Id":"8013D000000BnYZQA0","AccountId":"0013D00000T7CcGQAV","TotalAmount":9.95,"Type":null,"OrderNumber":"00972068","CreatedDate":"2018-04-09T11:02:09.000+0000"}]}
        };
        getTestBed().compileComponents().then(() => {
            let mockBackend = getTestBed().get(MockBackend);            
            mockBackend.connections.subscribe((connection: MockConnection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockResponse)
                })));
            });
            fixture.componentInstance.getOrderHistory();
            fixture.detectChanges();
            expect(fixture.componentInstance.orderSubscription).toBeDefined();
        })
    });

/**it should get  search result for Order history **/
it('order History search result to be defined', () => {
    localStorage.setItem("token", '123');
    const mockResponse = { 
        "recentorder":{"totalSize":1,"done":true,"records":[{"attributes":{"type":"Order","url":"/services/data/v29.0/sobjects/Order/8013D000000BlOrQAK"},"Id":"8013D000000BlOrQAK","AccountId":"0013D00000PwJfGQAV","TotalAmount":116.94,"Type":null,"OrderNumber":"00972036","CreatedDate":"2018-04-04T06:38:43.000+0000"}]}
    };
    getTestBed().compileComponents().then(() => {
        let mockBackend = getTestBed().get(MockBackend);        
        mockBackend.connections.subscribe((connection: MockConnection) => {
            connection.mockRespond(new Response(new ResponseOptions({
                body: JSON.stringify(mockResponse)
            })));
        });
        fixture.componentInstance.getOrderHistory();
        fixture.detectChanges();
        expect(fixture.componentInstance.searchByFilter).toBeDefined();
    })

});



    it('should show the loader', () => {
        fixture.componentInstance.getOrderHistory();
        fixture.detectChanges();
        expect(fixture.componentInstance.loading).toBeTruthy();
        
    });
    
});