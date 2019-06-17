import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewLeaderComponent } from './view-leader.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonService, ProfileService, UserAuthorizationService, AlertService, ChurchService } from '../../../services/index';
import { getTestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, XHRBackend, } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { SharedModule } from '../../../shared/shared.module';

fdescribe('view Leaders Component', () => {
    let component: ViewLeaderComponent;
    let mockBackend: MockBackend;
    let commonService: CommonService;
    let profileService: ProfileService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ViewLeaderComponent],
            imports: [
                SharedModule, HttpClientModule, RouterTestingModule
            ],
            providers: [CommonService, ProfileService, UserAuthorizationService, AlertService, ChurchService, MockBackend, {
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
        commonService = TestBed.get(CommonService);
        profileService = TestBed.get(ProfileService);
    });

    it('should create', () => {
        let fixture: ComponentFixture<ViewLeaderComponent>;
        fixture = TestBed.createComponent(ViewLeaderComponent);
        component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should update the leaders', () => {
        let fixture: ComponentFixture<ViewLeaderComponent> = getTestBed().createComponent(ViewLeaderComponent);
        
        // initializations
        commonService.backHeaderName = 'View Leader';

        // Call method of component method
        fixture.componentInstance.updateLeader();

        // detect change
        fixture.detectChanges();

        // Expectations
        expect(commonService.backHeaderName).toBe('Update Leader');
    });

    it('should get leaders image', () => {
        // Initializing the Component
        let fixture: ComponentFixture<ViewLeaderComponent> = getTestBed().createComponent(ViewLeaderComponent);

        // Creating mock response
        let mockResponse = {"leaderPhotodetails":{"UID":"4ceb2812b0f347cb954b17ae4c9f5ed5","ContactId":"0033D00000Nfwk3QAB","photoURL":"https://cdns.gigya.com/photos/7836721/1b8cb52399924747bc89f2e545120b9e/orig?ts=636567656764246562","thumbnailURL":"https://cdns.gigya.com/photos/7836721/1b8cb52399924747bc89f2e545120b9e/thumbnail?ts=636567656764956633"}};

        let data = {gigyaId : "4ceb2812b0f347cb954b17ae4c9f5ed5"};

        // Spying on service
        spyOn(profileService, 'getImage').and.returnValue(Observable.of(mockResponse));

        // Call method of component method
        fixture.componentInstance.getImage(data);

        // detect change
        fixture.detectChanges();

        // Expectations
        expect(fixture.componentInstance.showProfilePic).toBeTruthy();
        expect(fixture.componentInstance.profilePic).toBe('https://cdns.gigya.com/photos/7836721/1b8cb52399924747bc89f2e545120b9e/orig?ts=636567656764246562');
    });

    it('should get leaders image when there is no data', () => {
        // Initializing the Component
        let fixture: ComponentFixture<ViewLeaderComponent> = getTestBed().createComponent(ViewLeaderComponent);

        // Creating mock response
        let mockResponse = '';

        let data = {"gigyaId" : "4ceb2812b0f347cb954b17ae4c9f5ed5"};

        // Spying on service
        spyOn(profileService, 'getImage').and.returnValue(Observable.of(mockResponse));

        // Call method of component method
        fixture.componentInstance.getImage(data);

        // detect change
        fixture.detectChanges();

        // Expectations
        expect(fixture.componentInstance.showProfilePic).toBeFalsy();
        expect(fixture.componentInstance.profilePic).toBe('');
    });
});