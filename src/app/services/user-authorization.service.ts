import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { UserAuthorization } from '../model/user-authorization';
import { HttpErrorResponse } from '@angular/common/http';
import { Church } from '../model';

@Injectable()
export class UserAuthorizationService {

    private userAuthorization: UserAuthorization;
    private churchList = []; //holds the list of all the churches that a user is associated with.

    constructor(private _http: HttpClient) {
    }

    /**
     * Set the list of all the churches associated with a user
     * @param churchListObj list of all the churches fetched from backend in App Header component.
     * @author Siva Sanker Reddy on 29-March-2018
     */
    public setUserChurchesData(churchListObj: any[]) {
        //arrange them in key/value pairs; key the church id and value is the church object
        for (let i = 0; i < churchListObj.length; i++) {
            this.churchList[churchListObj[i].accountID] = churchListObj[i];
        }
        localStorage.setItem("myChurches",JSON.stringify(churchListObj));
    }

    /**
     * Get the User Authorization.
     * @author Siva Sanker Reddy on 29-March-2018
     */
    public getUserAuthorizationObject(accountID) {
        
        //if the data is not present, then take it from local storage.
        if(this.churchList.length == 0){
            if(localStorage.getItem('myChurches')){
                let churchListObj = JSON.parse(localStorage.getItem('myChurches'));
                for (let i = 0; i < churchListObj.length; i++) {
                    this.churchList[churchListObj[i].accountID] = churchListObj[i];
                }
            }
        }

        let userAuthorization = new UserAuthorization();

        if (accountID) { //check if the input value is null or undefined

            let tempChurch = this.churchList[accountID];
            if(tempChurch){
    
                if (tempChurch.organizationOwner == true) {
                    //Church owner; provide him/her full access.
                    userAuthorization.authorizationLevel = 'OrganizationOwner';
                    userAuthorization.editManagePrograms = true;
                    userAuthorization.viewManageLeaders = true;
                    userAuthorization.editManageLeaders = true;
                    userAuthorization.viewOrderHistory = true;
                    userAuthorization.editChurchProfile = true;
                } else if (tempChurch.authorizedPurchaser == true) {
                    //Church Authorized Purchaser; provide him/her only view access.
                    userAuthorization.authorizationLevel = 'AuthorizedPurchaser';
                    userAuthorization.editManagePrograms = false;
                    userAuthorization.viewManageLeaders = true;
                    userAuthorization.editManageLeaders = false;
                    userAuthorization.viewOrderHistory = true;
                    userAuthorization.editChurchProfile = false;
                } else {
                    //Church normal user; provide him/her only specific pages view access.
                    userAuthorization.authorizationLevel = 'NormalUser';
                    userAuthorization.editManagePrograms = false;
                    userAuthorization.viewManageLeaders = false;
                    userAuthorization.editManageLeaders = false;
                    userAuthorization.viewOrderHistory = false;
                    userAuthorization.editChurchProfile = false;
                }
                return userAuthorization;
            } else {
                return userAuthorization; // return as church normal user.
            }

        } else {
            return userAuthorization; // return as church normal user.
        }
    }

    public getChuchObject(accountID) {
        let userAuthorization = new UserAuthorization();

        if (accountID) { //check if the input value is null or undefined
            let tempChurch = this.churchList[accountID];
            return tempChurch;
        }
    }
}