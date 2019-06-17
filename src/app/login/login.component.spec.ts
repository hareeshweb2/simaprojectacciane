import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";
import { AuthService, CommonService, ProfileService } from '../services/index';
import { CapitalizePipe } from '../pipes/capitalize.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { getTestBed } from '@angular/core/testing';
import { Profile } from 'selenium-webdriver/firefox';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('User Login Component', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginComponent, CapitalizePipe],
            imports: [
                FormsModule, SharedModule, HttpClientModule, RouterTestingModule
            ],
            providers: [AuthService, CommonService, ProfileService]
        })
            .compileComponents();
    }));
    let location:Location;
    let router: Router;
    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = TestBed.get(Router);
        location = TestBed.get(Location);
    });
    /** This function should create login component**/
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /**This function should get contact ID from Gigya**/
    it('should help user login', () => {

        //initialization of service
        let authService: AuthService = getTestBed().get(AuthService);

        //initialization of mock request and reresponse data
        // const reqData = {
        //     "loginID": "balakrishnan.rajendran@accionlabs.com",
        //     "Password": "Myawana@1231",
        //     "keepmelogin":false
        //   };
          component.model = {
              email:"balakrishnan.rajendran@accionlabs.com",
              password:"Myawana@123",
              keepme:false
          }
        
        // function service call with expectations
        // authService.gigyaLogin(component.model).subscribe(
        //     (data) => {
        //         setTimeout(() => {
        //             expect(data).toBeDefined();
        //             //expect(data).toBe()
        //         }, 2000);
        //     }
        // )
        component.login()
        console.log(location);
        expect(location.path()).toBe('');
    })
});