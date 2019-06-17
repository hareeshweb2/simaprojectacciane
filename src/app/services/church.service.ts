import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ChurchService {

  constructor(private _http:HttpClient) { }

  getToken(){
    return localStorage.getItem('token');
  }

  getAccountId(){
    let profile = JSON.parse(localStorage.getItem('profile'));
    return profile.church.accountID;
  }


  /** 
   * function : getChurchProfile()
   * Required data : token, accountId
   * Type: POST
   * 
  **/
  getChurchProfile(data){
    // let data = {
    //   token:this.getToken(),
    //   accountId: this.getAccountId()
    // }
    return this._http.post(environment.api_url+"sf/getChurchProfile",data);
  }


  /**
   * Fetches all the sizes available for any chruch. This is static data.
   * @author Siva Sanker Reddy on Women's day of 2018
   */
  getChurchSizes() {
    return this._http.get(environment.services.church.url + "getChurchSize");
  }

  /**
   * Fetches all the sizes available for any chruch. This is static data.
   * @author Siva Sanker Reddy on Women's day of 2018
   */
  getChurchDenomiations() {
    return this._http.get(environment.services.church.url + "getChurchDenomiation");
  }

  /**
   * Fetches the information and addresses of the chruch selected from drop down list.
   * @param data Request Object
   * @author Siva Sanker Reddy on 02-March-2018
   */
  getSelectedChurchProfile(data) {
    return this._http.post(environment.services.church.url + "getChurchInfo", data);
  }

  /**
  * Fetches all the sizes available for any chruch. This is static data.
  * @author Siva Sanker Reddy on Women's day of 2018
  */
  updateChurchProfile(requestObj) {
    return this._http.post(environment.services.church.url + "updateChurchInfo", requestObj);
  }

  
  leadersDetails(leaderType,requestObj){
    if(leaderType == 'fetchPendingLeaderDetails'){
      return this._http.post(environment.services.church.url + "fetchPendingLeaderDetails", requestObj);    
    } else {
      return this._http.post(environment.services.church.url + "viewLeaderDetails", requestObj);
    }
  }
}
