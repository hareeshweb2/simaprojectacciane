import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class AuthService {

  constructor(private http:HttpClient) { }

  public isAuthenticated():boolean{
    const token = localStorage.getItem('token');
    //const tokenExpire = localStorage.getItem('token-expire');
    const profile = localStorage.getItem('profile');
    if(token && profile){
      return true;
    }else{
      return false;
    }
  }

  getSFApiAccess(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('Access-Control-Allow-Origin', '*');
    let param= new HttpParams();
    return this.http.post(environment.api_url+"sf/token",param);
  }

  gigyaLogin(arg){
    let data={
      loginID:arg.email,
      Password:arg.password,
      keepmelogin:arg.keepme
    }
    return this.http.post(environment.services.user.url+"login",data);
  }

  gigyaLoginChangePassword(data){    
    return this.http.post(environment.services.user.url+"validateCurrentPassword",data);
    //return this.http.post(environment.api_url+"gigya/login",data);
  }
  
  getToken(){
    return localStorage.getItem('token');
  }
  //get token for update password
  gigyaChangePasswordToken(email){
    let param = new URLSearchParams();
    param.append('loginID', email);    
    return this.http.get(environment.services.user.url+"getPasswordToken?"+param); 
  }
 
//change password
  authchangepassword(token,newPassword,email){
    let data={
      'passwordResetToken':token,
      'newPassword':newPassword,
      'loginID':email
    };   
    return this.http.post(environment.services.user.url+"updatePassword",data); 
  }

}
