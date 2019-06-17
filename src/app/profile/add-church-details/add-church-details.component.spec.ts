// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { AddChurchDetailsComponent } from './add-church-details.component';
// import { FormsModule } from '@angular/forms';
// import { SharedModule } from '../../shared/shared.module';
// import { HttpClientModule } from '@angular/common/http';
// import { RouterTestingModule } from '@angular/router/testing';
// import { ProfileService } from '../../services/profile.service';
// import { getTestBed } from '@angular/core/testing';
// import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
// import { SortChurchPipe } from '../../profile/pipes/sortchurchPipe';
// describe('AddChurchDetailsComponent', () => {
//     let component: AddChurchDetailsComponent;
//     let fixture: ComponentFixture<AddChurchDetailsComponent>;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [AddChurchDetailsComponent, SortChurchPipe],
//             imports: [
//                 FormsModule, SharedModule, HttpClientModule, RouterTestingModule, AngularMultiSelectModule
//             ],
//             providers: [ProfileService],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA]

//         })
//             .compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(AddChurchDetailsComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     //This function should create church component
//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     //This function will be fetching churches by name and zipcode
//     // it('should get churches data by name or zipcode', async(() => {
//     //     //initialization of service
//     //     let profileService: ProfileService = getTestBed().get(ProfileService);

//     //     //initialization of mock request and reresponse data
//     //     const resData = { "churches": [{ "_id": "5a80015b20dc6ebd5df32551", "name": "Crossroads Bible Church", "id": "0013D00000PwHrhQAF", "type": "Church", "attributes": { "url": "/services/data/v29.0/sobjects/Account/0013D00000PwHrhQAF", "type": "Account" }, "billing_street": "1670 Moorpark Ave", "billing_state": "CA", "billing_postal_code": "95128-2841", "billing_country": "UNITED STATES", "billing_city": "San Jose" }, { "_id": "5a80015b20dc6ebd5df32552", "name": "Scottsburg Baptist Church", "id": "0013D00000PwFxBQAV", "type": "Church", "attributes": { "url": "/services/data/v29.0/sobjects/Account/0013D00000PwFxBQAV", "type": "Account" }, "billing_street": "PO Box 85", "billing_state": "VA", "billing_postal_code": "24589-0085", "billing_country": "UNITED STATES", "billing_city": "Scottsburg" }, { "_id": "5a80015b20dc6ebd5df32553", "name": "Horizon Baptist Church", "id": "0013D00000PwFxCQAV", "type": "Church", "attributes": { "url": "/services/data/v29.0/sobjects/Account/0013D00000PwFxCQAV", "type": "Account" }, "billing_street": "4098 Calle Tesoro Ste D", "billing_state": "CA", "billing_postal_code": "93012-8785", "billing_country": "UNITED STATES", "billing_city": "Camarillo" }, { "_id": "5a80015b20dc6ebd5df32554", "name": "Hickory Grove Baptist Church- Main Campus", "id": "0013D00000PwFxDQAV", "type": "Church", "attributes": { "url": "/services/data/v29.0/sobjects/Account/0013D00000PwFxDQAV", "type": "Account" }, "billing_street": "7200 E W T Harris Blvd", "billing_state": "NC", "billing_postal_code": "28215-7200", "billing_country": "United States", "billing_city": "Charlotte" }, { "_id": "5a80015b20dc6ebd5df32555", "name": "Rainbows End Youth Services", "id": "0013D00000PwFxEQAV", "type": "Church", "attributes": { "url": "/services/data/v29.0/sobjects/Account/0013D00000PwFxEQAV", "type": "Account" }, "billing_street": "105 Fairview St", "billing_state": "PA", "billing_postal_code": "17552-1211", "billing_country": "United States", "billing_city": "Mount Joy" }, { "_id": "5a80015b20dc6ebd5df32556", "name": "Mount Zion Baptist Church", "id": "0013D00000PwFxFQAV", "type": "Church", "attributes": { "url": "/services/data/v29.0/sobjects/Account/0013D00000PwFxFQAV", "type": "Account" }, "billing_street": "PO Box 650", "billing_state": "VA", "billing_postal_code": "23139-0650", "billing_country": "UNITED STATES", "billing_city": "Powhatan" }, { "_id": "5a80015b20dc6ebd5df32557", "name": "Upper Arlington Lutheran Church", "id": "0013D00000PwFxGQAV", "type": "Church", "attributes": { "url": "/services/data/v29.0/sobjects/Account/0013D00000PwFxGQAV", "type": "Account" }, "billing_street": "3500 Mill Run Dr", "billing_state": "OH", "billing_postal_code": "43026-7770", "billing_country": "UNITED STATES", "billing_city": "Hilliard" }, { "_id": "5a80015b20dc6ebd5df32558", "name": "Eastern Hills Community Church", "id": "0013D00000PwFxHQAV", "type": "Church", "attributes": { "url": "/services/data/v29.0/sobjects/Account/0013D00000PwFxHQAV", "type": "Account" }, "billing_street": "PO Box 1355", "billing_state": "WA", "billing_postal_code": "98362-0252", "billing_country": "UNITED STATES", "billing_city": "Port Angeles" }, { "_id": "5a80015b20dc6ebd5df32559", "name": "First Baptist Church", "id": "0013D00000PwFxIQAV", "type": "Church", "attributes": { "url": "/services/data/v29.0/sobjects/Account/0013D00000PwFxIQAV", "type": "Account" }, "billing_street": "155 Shady Elm Ln", "billing_state": "VA", "billing_postal_code": "24290-7299", "billing_country": "UNITED STATES", "billing_city": "Weber City" }, { "_id": "5a80015b20dc6ebd5df3255a", "name": "Calvary Baptist Church", "id": "0013D00000PwFxJQAV", "type": "Church", "attributes": { "url": "/services/data/v29.0/sobjects/Account/0013D00000PwFxJQAV", "type": "Account" }, "billing_street": "820 White Pond Dr", "billing_state": "OH", "billing_postal_code": "44320-1194", "billing_country": "United States", "billing_city": "Akron" }] };

//     //     // function service call with expectations
//     //     profileService.getChurchBynameZipcode().subscribe(
//     //         (data) => {
//     //             expect(data).toBeDefined();
//     //             expect(data).toBe(resData);
//     //         }
//     //     )
//     // }));

//     //This function will be fetching church roles 
//     // it('should get church role', async(() => {
//     //     //initialization of service
//     //     let profileService: ProfileService = getTestBed().get(ProfileService);
//     //     //initialization of mock request and reresponse data
//     //     const reqData = { "token": "00D3D000000DJuR!ARUAQNubA2.rxcbzDI325OtVN69ZYzUhTnROKi8NHOeH59fGK2agHIh7NP68p0LPrNiv1weK5HsoIK0oPX.21NHwwVY_FsBt" };
//     //     const resData = { "ChurchRolesResults": { "ChurchRoles": [{ "data": { "Role": "Children's Pastor / Director", "status": true } }, { "data": { "Role": "Church Staff Member", "status": true } }, { "data": { "Role": "Executive Director", "status": true } }, { "data": { "Role": "Missions Pastor", "status": true } }, { "data": { "Role": "Senior Pastor", "status": true } }, { "data": { "Role": "Pastor / Associate Pastor", "status": true } }, { "data": { "Role": "Youth Pastor / Director", "status": true } }, { "data": { "Role": "Church Volunteer", "status": true } }] } };
//     //     // function service call with expectations
//     //     profileService.getChurchRoles().subscribe(
//     //         (data) => {
//     //             setTimeout(() => {
//     //                 expect(data).toBeDefined()
//     //                 expect(data).toBe(resData)
//     //             }, 5000);
//     //         }
//     //     )
//     // }));

//     //This function will be fetching awana roles
//     // it('should get awana roles', async(() => {
//     //     //initialization of service
//     //     let profileService: ProfileService = getTestBed().get(ProfileService);
//     //     //initialization of mock request and reresponse data
//     //     const reqData = { "token": "00D3D000000DJuR!ARUAQNubA2.rxcbzDI325OtVN69ZYzUhTnROKi8NHOeH59fGK2agHIh7NP68p0LPrNiv1weK5HsoIK0oPX.21NHwwVY_FsBt" };
//     //     const resData = { "AwanaRolesResults": { "AwanaRoles": [{ "data": { "Role": "Alumni / Award Recipient", "status": true } }, { "data": { "Role": "Awana at Home Director", "status": true } }, { "data": { "Role": "Awana GO Coordinator", "status": true } }, { "data": { "Role": "Clubber Parent", "status": true } }, { "data": { "Role": "Club Leader", "status": true } }, { "data": { "Role": "Club Secretary", "status": true } }, { "data": { "Role": "Commander", "status": true } }, { "data": { "Role": "Cubbies Director", "status": true } }, { "data": { "Role": "Cubbies Leader", "status": true } }, { "data": { "Role": "Entrusted Leader", "status": true } }, { "data": { "Role": "Game Director", "status": true } }, { "data": { "Role": "High Power Soccer Leader", "status": true } }, { "data": { "Role": "Homeschool Parent", "status": true } }, { "data": { "Role": "Journey Director", "status": true } }, { "data": { "Role": "Journey Leader", "status": true } }, { "data": { "Role": "Puggles Director", "status": true } }, { "data": { "Role": "Puggles Leader", "status": true } }, { "data": { "Role": "Sparks Director", "status": true } }, { "data": { "Role": "Sparks Leader", "status": true } }, { "data": { "Role": "T&T Director", "status": true } }, { "data": { "Role": "T&T Leader", "status": true } }, { "data": { "Role": "Trek Director", "status": true } }, { "data": { "Role": "Trek Leader", "status": true } }, { "data": { "Role": "Truthseekers Leader", "status": true } }, { "data": { "Role": "Awana Ministry Director", "status": true } }, { "data": { "Role": "GO Coordinator", "status": true } }, { "data": { "Role": "LIT", "status": true } }] } };

//     //     // function service call with expectations
//     //     profileService.getAwanaRoles().subscribe(
//     //         (data) => {
//     //             setTimeout(() => {
//     //                 expect(data).toBeDefined()
//     //                 expect(data).toBe(resData)
//     //             }, 5000);
//     //         }
//     //     )
//     // }));

//     //This function should add church to the user
//     // it('should add church', async(() => {
//     //     //initialization of service
//     //     let profileService: ProfileService = getTestBed().get(ProfileService);
//     //     //initialization of mock request and reresponse data
//     //     const reqData = { "token": "00D3D000000DJuR!ARUAQNubA2.rxcbzDI325OtVN69ZYzUhTnROKi8NHOeH59fGK2agHIh7NP68p0LPrNiv1weK5HsoIK0oPX.21NHwwVY_FsBt", "contactId": "0033D00000NKMDDQA5", "accountId": "0013D00000PwHrhQAF", "awanaRoles": "Alumni / Award Recipient,Awana at Home Director", "churchRoles": "Children's Pastor / Director,Church Staff Member", "accountOwner": "false", "authorizedPurchaser": "false" };
//     //     const resData = { "addUserResults": { "Message": "Created" } };

//     //     // function service call with expectations
//     //     profileService.affiliateUserWithChurch(reqData).subscribe(
//     //         (data) => {
//     //             setTimeout(() => {
//     //                 expect(data).toBeDefined()
//     //                 expect(data).toBe(resData)
//     //             }, 5000);
//     //         }
//     //     )
//     // }));
// });
