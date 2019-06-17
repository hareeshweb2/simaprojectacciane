import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentOrderComponent } from './recent-order.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { InsertPeiodInDateFormatPipe } from '../../pipes/insertPeriodInDateFormat.pipe';
import { ProfileService, OrderService, AuthService, CommonService, UserAuthorizationService,AlertService } from '../../services/index';
import { getTestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Headers, BaseRequestOptions, Response, HttpModule, Http, XHRBackend, RequestMethod, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';


describe('Recent order Component', () => {
    let component: RecentOrderComponent;
    // let fixture: ComponentFixture<RecentOrderComponent>;
    let mockBackend: MockBackend;
    let orderService: OrderService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RecentOrderComponent, InsertPeiodInDateFormatPipe],
            imports: [
                FormsModule, SharedModule, HttpClientModule, RouterTestingModule
            ],
            providers: [ProfileService, OrderService,AlertService, AuthService, CommonService, UserAuthorizationService, MockBackend, {
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
        // fixture = TestBed.createComponent(RecentOrderComponent);
        // component = fixture.componentInstance;
        orderService = TestBed.get(OrderService);
    });


    /**This function is used to create recent order component**/
    it('should create', () => {
        let fixture: ComponentFixture<RecentOrderComponent>;
        fixture = TestBed.createComponent(RecentOrderComponent);
        component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    /**it should get recent orders for individual **/
    it('should check for datasource to be defined', () => {
        localStorage.setItem("token", '123');
        const mockResponse = { 
            "recentorder": { "totalSize": 5, "done": true, "records": [{ "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hIhQAI" }, "Id": "8013D0000001hIhQAI", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 168.99, "Type": null, "OrderNumber": "00971869", "CreatedDate": "2018-02-13T11:03:11.000+0000" }, { "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hIXQAY" }, "Id": "8013D0000001hIXQAY", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 185.99, "Type": null, "OrderNumber": "00971867", "CreatedDate": "2018-02-13T10:46:33.000+0000" }, { "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hISQAY" }, "Id": "8013D0000001hISQAY", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 185.99, "Type": null, "OrderNumber": "00971866", "CreatedDate": "2018-02-13T10:46:22.000+0000" }, { "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hINQAY" }, "Id": "8013D0000001hINQAY", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 168.99, "Type": null, "OrderNumber": "00971865", "CreatedDate": "2018-02-13T10:46:10.000+0000" }, { "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hIIQAY" }, "Id": "8013D0000001hIIQAY", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 185.99, "Type": null, "OrderNumber": "00971864", "CreatedDate": "2018-02-13T10:46:00.000+0000" }] } 
        };

        let fixture: ComponentFixture<RecentOrderComponent> = getTestBed().createComponent(RecentOrderComponent);

        getTestBed().compileComponents().then(() => {
            let mockBackend = getTestBed().get(MockBackend);
            
            mockBackend.connections.subscribe((connection: MockConnection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockResponse)
                })));
            });

            fixture.componentInstance.getRecentOrders();

            fixture.detectChanges();

            expect(fixture.componentInstance.dataSource).toBeDefined();
        })
    });

    it('should show the loader', () => {
        let fixture: ComponentFixture<RecentOrderComponent> = getTestBed().createComponent(RecentOrderComponent);
        const mockResponse = { 
            "recentorder": { "totalSize": 5, "done": true, "records": [{ "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hIhQAI" }, "Id": "8013D0000001hIhQAI", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 168.99, "Type": null, "OrderNumber": "00971869", "CreatedDate": "2018-02-13T11:03:11.000+0000" }, { "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hIXQAY" }, "Id": "8013D0000001hIXQAY", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 185.99, "Type": null, "OrderNumber": "00971867", "CreatedDate": "2018-02-13T10:46:33.000+0000" }, { "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hISQAY" }, "Id": "8013D0000001hISQAY", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 185.99, "Type": null, "OrderNumber": "00971866", "CreatedDate": "2018-02-13T10:46:22.000+0000" }, { "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hINQAY" }, "Id": "8013D0000001hINQAY", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 168.99, "Type": null, "OrderNumber": "00971865", "CreatedDate": "2018-02-13T10:46:10.000+0000" }, { "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hIIQAY" }, "Id": "8013D0000001hIIQAY", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 185.99, "Type": null, "OrderNumber": "00971864", "CreatedDate": "2018-02-13T10:46:00.000+0000" }] } 
        };
        fixture.componentInstance.currentAccountId = "0013D00000TJDZSQA5";
        spyOn(orderService, 'getRecentOrder').and.returnValue(Observable.of(mockResponse));
        fixture.componentInstance.getRecentOrders();
        fixture.detectChanges();
        expect(fixture.componentInstance.loading).toBeFalsy();
    });

    it('should test when there is no record in order service', () => {
        localStorage.setItem("token", '123');
        // Initializing the Component
        let fixture: ComponentFixture<RecentOrderComponent> = getTestBed().createComponent(RecentOrderComponent);

        // Creating mock response
        const mockResponse = '';
        fixture.componentInstance.currentAccountId = "0013D00000TJDZSQA5";
        
        // Spying on service
        spyOn(orderService, 'getRecentOrder').and.returnValue(Observable.of(mockResponse));

        // Call method of component method
        fixture.componentInstance.getRecentOrders();

        // detect change
        fixture.detectChanges();

        // Expectations
        expect(fixture.componentInstance.dataSource).toBeNull();
        expect(fixture.componentInstance.NorecordsOrder).toBeTruthy();
        expect(fixture.componentInstance.loading).toBeFalsy();
        expect(fixture.componentInstance.serviceError).toBeFalsy();
    })

    it('should test when there are one or more records in order service', () => {
        // Initializing the Component
        let fixture: ComponentFixture<RecentOrderComponent> = getTestBed().createComponent(RecentOrderComponent);

        // Creating mock response
        const mockResponse =  {
            "recentorder": { "totalSize": 5, "done": true, "records": [{ "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hIhQAI" }, "Id": "8013D0000001hIhQAI", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 168.99, "Type": null, "OrderNumber": "00971869", "CreatedDate": "2018-02-13T11:03:11.000+0000" }, { "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hIXQAY" }, "Id": "8013D0000001hIXQAY", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 185.99, "Type": null, "OrderNumber": "00971867", "CreatedDate": "2018-02-13T10:46:33.000+0000" }, { "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hISQAY" }, "Id": "8013D0000001hISQAY", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 185.99, "Type": null, "OrderNumber": "00971866", "CreatedDate": "2018-02-13T10:46:22.000+0000" }, { "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hINQAY" }, "Id": "8013D0000001hINQAY", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 168.99, "Type": null, "OrderNumber": "00971865", "CreatedDate": "2018-02-13T10:46:10.000+0000" }, { "attributes": { "type": "Order", "url": "/services/data/v29.0/sobjects/Order/8013D0000001hIIQAY" }, "Id": "8013D0000001hIIQAY", "AccountId": "0013D00000PwJfGQAV", "TotalAmount": 185.99, "Type": null, "OrderNumber": "00971864", "CreatedDate": "2018-02-13T10:46:00.000+0000" }] } 
        };

        // Spying on service
        spyOn(orderService, 'getRecentOrder').and.returnValue(Observable.of(mockResponse));

        // Call method of component method
        fixture.componentInstance.getRecentOrders();

        // detect change
        fixture.detectChanges();

        // Expectations
        expect(fixture.componentInstance.dataSource).toBeDefined();
        expect(fixture.componentInstance.NorecordsOrder).toBeFalsy();
        expect(fixture.componentInstance.loading).toBeFalsy();
        expect(fixture.componentInstance.serviceError).toBeFalsy();
    });
});