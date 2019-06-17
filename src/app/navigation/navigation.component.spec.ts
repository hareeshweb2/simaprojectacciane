import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationComponent } from './navigation.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonService, ProfileService, UserAuthorizationService, AlertService } from '../services/index';
import { getTestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, XHRBackend, } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { SharedModule } from '../shared/shared.module';

describe('Navigation Component', () => {
    let component: NavigationComponent;
    let mockBackend: MockBackend;
    let commonService: CommonService;
    let profileService: ProfileService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NavigationComponent],
            imports: [
                SharedModule, HttpClientModule, RouterTestingModule
            ],
            providers: [CommonService, ProfileService, UserAuthorizationService, AlertService, MockBackend, {
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
        let fixture: ComponentFixture<NavigationComponent>;
        fixture = TestBed.createComponent(NavigationComponent);
        component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should close the side bar', () => {
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        let obj = '{"selectedprofile":"user","user":{"AccountId":"0013D00000TJDZSQA5","IntacctID__c":"1216054","FirstName":"Tom","LastName":"Hank","Email":"tomhank@mailinator.com","Birthdate":"2004-02-25","MobilePhone":"(454) 545-4545","HomePhone":"(565) 656-5656","WorkPhone":"(787) 867-8786","BillingStreet_1":"108 440th St","BillingStreet_2":"","BillingStreet_3":"","BillingCity":"Vergas","BillingState":"MN","BillingPostalCode":"23232-3323","BillingCountry":"United States","ShippingStreet_1":"109 E 4th St","ShippingStreet_2":"","ShippingStreet_3":"","ShippingCity":"Piketon","ShippingState":"OH","ShippingPostalCode":"23232-3323","ShippingCountry":"United States","year":"2004","month":"02","date":"25","thumbnailURL":"https://cdns.gigya.com/photos/7836721/4861ed9a45dc4e5d959226c286f8afe3/thumbnail?ts=636644616746149394","photoURL":"https://cdns.gigya.com/photos/7836721/4861ed9a45dc4e5d959226c286f8afe3/orig?ts=636644616745799359","UID":"9066806665c3433192930ba7788840dc","ContactId":"0033D00000O6QCOQA3"},"church":{"photoURL":"assets/img/Church_Default_Img.png"},"token":94814061127218}';
        localStorage.setItem("profile", obj);

        //initializing the service data
        commonService.showSidebar = "visible";
        commonService.navigationClose = "visible";

        // Call method of component 
        fixture.componentInstance.close();

        expect(commonService.showSidebar).toEqual("hidden");
        expect(commonService.navigationClose).toEqual("hidden");
    });

    it('should expand/collapse profile', () => {
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        // initializations
        fixture.componentInstance.showChurchOrProfile = false;
        commonService.churchHeader = false;

        // call method of component
        fixture.componentInstance.updateShowChurchProfile(true);

        expect(fixture.componentInstance.showChurchOrProfile).toBeTruthy();
        expect(commonService.churchHeader).toBeTruthy();
    })

    it('should show the elemnt of navigation List Clicked when current element and clicked element are same', () => {
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        // initializations
        fixture.componentInstance.show = false;
        fixture.componentInstance.currentElementClick = 'dashboard';

        // call method of component
        fixture.componentInstance.navigationListClick('dashboard');

        expect(fixture.componentInstance.show).toBeTruthy();
    })

    it('should show the elemnt of navigation List Clicked when current element and clicked element are different & side bar is hidden', () => {
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        // initializations
        fixture.componentInstance.show = false;
        fixture.componentInstance.currentElementClick = 'order';

        // call method of component
        fixture.componentInstance.navigationListClick('dashboard');

        expect(fixture.componentInstance.show).toBeTruthy();
        expect(fixture.componentInstance.currentElementClick).toBe('dashboard');
    })

    it('should show the elemnt of navigation List Clicked when current element and clicked element are different & side bar is visible', () => {
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        // initializations
        fixture.componentInstance.show = true;
        fixture.componentInstance.currentElementClick = 'order';

        // call method of component
        fixture.componentInstance.navigationListClick('dashboard');

        expect(fixture.componentInstance.show).toBeTruthy();
        expect(fixture.componentInstance.currentElementClick).toBe('dashboard');
    })

    it('should show profile head', () => {
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        // initializations
        commonService.showHeaderProfile = false;
        commonService.showSidebar = 'visivble';

         // call method of component
         fixture.componentInstance.showProfileHead();

         expect(commonService.showHeaderProfile).toBeTruthy();
         expect(commonService.showSidebar).toBe('hidden');
    })

    it('should hide profile head', () => {
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        // initializations
        commonService.showHeaderProfile = true;
        commonService.showSidebar = 'visivble';

         // call method of component
         fixture.componentInstance.hideProfileHead();

         expect(commonService.showHeaderProfile).toBeFalsy();
         expect(commonService.showSidebar).toBe('hidden');
    })

    it('should close the side bar', () => {
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        // initializations
        commonService.showSidebar = 'visible';

        // call method of component
        fixture.componentInstance.closeSidebar();

        expect(commonService.showSidebar).toBe('hidden');
    })
    
    it('should select User Profile', () => {
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);
        
        // initializations
        fixture.componentInstance.churchSelected = true;
        commonService.churchHeader = true;
        profileService.currentProfile.selectedprofile = "church";
        fixture.componentInstance.showChurchOrProfile = true;

        // call method of component
        fixture.componentInstance.selectUserProfile();

        expect(commonService.churchHeader).toBeFalsy();
        expect(fixture.componentInstance.churchSelected).toBeFalsy();
        expect(profileService.currentProfile.selectedprofile).toBe('user');
        expect(fixture.componentInstance.showChurchOrProfile).toBeFalsy();
    })

    it('should set up the profile when selected profile is user', () => {
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);
        
        // initializations
        localStorage.setItem('profile', '{"selectedprofile":"user","user":{"AccountId":"0013D00000TJDZSQA5","IntacctID__c":"1216054","FirstName":"Tom","LastName":"Hank","Email":"tomhank@mailinator.com","Birthdate":"2004-02-25","MobilePhone":"(454) 545-4545","HomePhone":"(565) 656-5656","WorkPhone":"(787) 867-8786","BillingStreet_1":"108 440th St","BillingStreet_2":"","BillingStreet_3":"","BillingCity":"Vergas","BillingState":"MN","BillingPostalCode":"23232-3323","BillingCountry":"United States","ShippingStreet_1":"109 E 4th St","ShippingStreet_2":"","ShippingStreet_3":"","ShippingCity":"Piketon","ShippingState":"OH","ShippingPostalCode":"23232-3323","ShippingCountry":"United States","year":"2004","month":"02","date":"25","thumbnailURL":"https://cdns.gigya.com/photos/7836721/4861ed9a45dc4e5d959226c286f8afe3/thumbnail?ts=636644616746149394","photoURL":"https://cdns.gigya.com/photos/7836721/4861ed9a45dc4e5d959226c286f8afe3/orig?ts=636644616745799359","UID":"9066806665c3433192930ba7788840dc","ContactId":"0033D00000O6QCOQA3"},"church":{"photoURL":"assets/img/Church_Default_Img.png"},"token":115389788618681}');

        // call method of component
        fixture.componentInstance.profileSetup();

        expect(profileService.currentProfile.user.photoURL).toBe('https://cdns.gigya.com/photos/7836721/4861ed9a45dc4e5d959226c286f8afe3/orig?ts=636644616745799359');

    })

    it('should get my church data', () => {
        // Initializing the Component
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        // Creating mock response
        const mockResponse = {
            "churchList":{"totalSize":5,"done":true,"records":[{"attributes":{"type":"npe5__Affiliation__c","url":"/services/data/v29.0/sobjects/npe5__Affiliation__c/a0H3D0000023zqsUAA"},"Id":"a0H3D0000023zqsUAA","Church_Role__c":"Children's Pastor / Director","Awana_Role__c":"Commander","Mozo_User_Level__c":"None","Contact_Name__c":"Tom Hank","npe5__Contact__c":"0033D00000O6QCOQA3","npe5__Organization__c":"0013D00000PwHrhQAF","Authorized_Purchaser__c":true,"npe5__Organization__r":{"attributes":{"type":"Account","url":"/services/data/v29.0/sobjects/Account/0013D00000PwHrhQAF"},"Registration_Level__c":"R1","Number_of_Licenses__c":0,"Licenses_Used__c":11,"Name":"BEETHAL CHURCH Update","Mailing_Address_Book__c":"1215533","Phone":"(555) 555-5555","Type":"Church","BillingStreet":"135 135th St","BillingCity":"Riverside","BillingState":"IA","BillingPostalCode":"95054-1807","BillingCountry":"UNITED STATES","Physical_Street_1__c":"135 Alyssum Ave","Physical_Street_2__c":null,"PhysicalStreet3__c":null,"Physical_City__c":"Columbty","Physical_State__c":"OH","Physical_Zip__c":"95054-1807","PhysicalCountry__c":"UNITED STATES"},"Organization_Owner__c":true,"npe5__Status__c":"Current"},{"attributes":{"type":"npe5__Affiliation__c","url":"/services/data/v29.0/sobjects/npe5__Affiliation__c/a0H3D0000023zr2UAA"},"Id":"a0H3D0000023zr2UAA","Church_Role__c":"Church Volunteer","Awana_Role__c":"Club Leader","Mozo_User_Level__c":"None","Contact_Name__c":"Tom Hank","npe5__Contact__c":"0033D00000O6QCOQA3","npe5__Organization__c":"0013D00000PwFxFQAV","Authorized_Purchaser__c":true,"npe5__Organization__r":{"attributes":{"type":"Account","url":"/services/data/v29.0/sobjects/Account/0013D00000PwFxFQAV"},"Registration_Level__c":"R1","Number_of_Licenses__c":15,"Licenses_Used__c":11,"Name":"Mount Zion Baptist Church","Mailing_Address_Book__c":"1215508","Phone":"(919) 999-9999","Type":"Church","BillingStreet":"284 Mount Zion ChurchRd\r\nAnna Nagar\r\nT Nagar","BillingCity":"Chennai","BillingState":"CA","BillingPostalCode":"37659-6166","BillingCountry":"UNITED STATES","Physical_Street_1__c":"284 Mount Zion ChurchRd","Physical_Street_2__c":"White Field Main Road","PhysicalStreet3__c":"Varthur","Physical_City__c":"Bangalore","Physical_State__c":"AK","Physical_Zip__c":"37659-6166","PhysicalCountry__c":"UNITED STATES"},"Organization_Owner__c":true,"npe5__Status__c":"Current"},{"attributes":{"type":"npe5__Affiliation__c","url":"/services/data/v29.0/sobjects/npe5__Affiliation__c/a0H3D0000024AIiUAM"},"Id":"a0H3D0000024AIiUAM","Church_Role__c":"Youth Pastor / Director","Awana_Role__c":"Cubbies Director","Mozo_User_Level__c":"None","Contact_Name__c":"Tom Hank","npe5__Contact__c":"0033D00000O6QCOQA3","npe5__Organization__c":"0013D00000PvuApQAJ","Authorized_Purchaser__c":true,"npe5__Organization__r":{"attributes":{"type":"Account","url":"/services/data/v29.0/sobjects/Account/0013D00000PvuApQAJ"},"Registration_Level__c":"R1","Number_of_Licenses__c":999,"Licenses_Used__c":3,"Name":"Cherrydale Baptist Church Updated","Mailing_Address_Book__c":"1215464","Phone":"(385) 854-7334","Type":"Church","BillingStreet":"3910 Lorcom Ln","BillingCity":"Arlingto","BillingState":"VA","BillingPostalCode":"22207-5130","BillingCountry":"UNITED STATES","Physical_Street_1__c":"3910 Lorcom Ln","Physical_Street_2__c":null,"PhysicalStreet3__c":null,"Physical_City__c":"Arlingto","Physical_State__c":"VA","Physical_Zip__c":"22207-5130","PhysicalCountry__c":"UNITED STATES"},"Organization_Owner__c":true,"npe5__Status__c":"Current"},{"attributes":{"type":"npe5__Affiliation__c","url":"/services/data/v29.0/sobjects/npe5__Affiliation__c/a0H3D0000024AJ2UAM"},"Id":"a0H3D0000024AJ2UAM","Church_Role__c":null,"Awana_Role__c":"Clubber Parent;Commander","Mozo_User_Level__c":"None","Contact_Name__c":"Tom Hank","npe5__Contact__c":"0033D00000O6QCOQA3","npe5__Organization__c":"0013D00000PwFxNQAV","Authorized_Purchaser__c":true,"npe5__Organization__r":{"attributes":{"type":"Account","url":"/services/data/v29.0/sobjects/Account/0013D00000PwFxNQAV"},"Registration_Level__c":"R1","Number_of_Licenses__c":40,"Licenses_Used__c":3,"Name":"Willow Creek Community Church","Mailing_Address_Book__c":"1215516","Phone":"(919) 999-9999","Type":"Church","BillingStreet":"Willowcreek Ln","BillingCity":"Cerritos","BillingState":"CA","BillingPostalCode":"32541-3505","BillingCountry":"UNITED STATES","Physical_Street_1__c":"Willowcreek Ln","Physical_Street_2__c":null,"PhysicalStreet3__c":null,"Physical_City__c":"Cerritos","Physical_State__c":"CA","Physical_Zip__c":"32541-3505","PhysicalCountry__c":"UNITED STATES"},"Organization_Owner__c":true,"npe5__Status__c":"Current"},{"attributes":{"type":"npe5__Affiliation__c","url":"/services/data/v29.0/sobjects/npe5__Affiliation__c/a0H3D0000024AJqUAM"},"Id":"a0H3D0000024AJqUAM","Church_Role__c":null,"Awana_Role__c":"Club Secretary","Mozo_User_Level__c":"Full","Contact_Name__c":"Tom Hank","npe5__Contact__c":"0033D00000O6QCOQA3","npe5__Organization__c":"0013D00000PwFxJQAV","Authorized_Purchaser__c":true,"npe5__Organization__r":{"attributes":{"type":"Account","url":"/services/data/v29.0/sobjects/Account/0013D00000PwFxJQAV"},"Registration_Level__c":"R1","Number_of_Licenses__c":25,"Licenses_Used__c":24,"Name":"Calvary Baptist Church","Mailing_Address_Book__c":"1215512","Phone":"(222) 222-3333","Type":"Church","BillingStreet":"201 Mount Gilead Rd","BillingCity":"Keller","BillingState":"TX","BillingPostalCode":"40507","BillingCountry":"UNITED STATES","Physical_Street_1__c":"201 Mount Gilead Rd","Physical_Street_2__c":null,"PhysicalStreet3__c":null,"Physical_City__c":"Keller","Physical_State__c":"TX","Physical_Zip__c":"40507","PhysicalCountry__c":"UNITED STATES"},"Organization_Owner__c":false,"npe5__Status__c":"Current"}]}
        };

         // Spying on service
         spyOn(profileService, 'getchurchs').and.returnValue(Observable.of(mockResponse));

         // Call method of component method
         fixture.componentInstance.getMyChurchData();
 
         // detect change
         fixture.detectChanges();
 
         // Expectations
         expect(fixture.componentInstance.isCurrentChurch).toBeTruthy();
    })

    it('should select the church from the list', () => {
        // Initializing the Component
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        // initializations
        let selectedChurchData = {"photoURL":"assets/img/Church_Default_Img.png","accountID":"0013D00000PwHrhQAF","name":"BEETHAL CHURCH Update","phoneNumber":"(555) 555-5555","billingCity":"Columbty","billingCountry":"UNITED STATES","billingPostalCode":"95054-1807","billingState":"OH","billingStreet_1":"135 Alyssum Ave","role":"Commander"};
        commonService.showHeaderProfile = true;
        commonService.showSidebar = 'hidden';
        fixture.componentInstance.churchSelected = false;
        fixture.componentInstance.showChurchOrProfile = false;
        fixture.componentInstance.churchTitle = 'xyz church';
        fixture.componentInstance.myChurchProfile = true;

        // Call method of component method
        fixture.componentInstance.selectChurch(selectedChurchData);

        expect(commonService.showHeaderProfile).toBeFalsy();
        expect(commonService.showSidebar).toBe('visible');
        expect(fixture.componentInstance.churchSelected).toBeTruthy();
        expect(fixture.componentInstance.churchTitle).toBe('BEETHAL CHURCH Update');
        expect(fixture.componentInstance.myChurchProfile).toBeFalsy();
        expect(profileService.currentProfile.selectedprofile).toBe('church');
        expect(fixture.componentInstance.pName).toBe('church'); 
    });

    it('should show the profile header when church is selected', () => {
        // Initializing the Component
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        // initializations
        commonService.showHeaderProfile = false;
        fixture.componentInstance.churchSelected = true;
        commonService.churchHeader = false;

        // Call method of component method
        fixture.componentInstance.showProfileHeader();

        expect(commonService.showHeaderProfile).toBeTruthy();
        expect(fixture.componentInstance.churchSelected).toBeTruthy();
        expect(commonService.churchHeader).toBeTruthy();
    });

    it('should show the profile header when user profile is selected', () => {
        // Initializing the Component
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        // initializations
        commonService.showHeaderProfile = false;
        fixture.componentInstance.churchSelected = false;
        commonService.churchHeader = false;

        // Call method of component method
        fixture.componentInstance.showProfileHeader();

        expect(commonService.showHeaderProfile).toBeTruthy();
        expect(fixture.componentInstance.churchSelected).toBeFalsy();
        expect(commonService.churchHeader).toBeFalsy();
    });

    it('should do onload Menu Selection', () => {
        // Initializing the Component
        let fixture: ComponentFixture<NavigationComponent> = getTestBed().createComponent(NavigationComponent);

        // initializations
        fixture.componentInstance.currentElementClick = 'dashboard';
        fixture.componentInstance.show = false;

        // Call method of component method
        fixture.componentInstance.onloadMenuSelection('order');

        expect(fixture.componentInstance.currentElementClick).toBe('order');
        expect(fixture.componentInstance.show).toBeTruthy();

    });
});