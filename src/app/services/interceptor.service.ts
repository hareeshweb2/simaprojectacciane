import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Router } from "@angular/router";
import 'rxjs/add/operator/do';
import { AlertService,  } from './alert.service';

@Injectable()
export class InterceptorService implements HttpInterceptor {
    constructor(private _router:Router, private alertService: AlertService ){

    }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
      if(localStorage.getItem('token')){
          const duplicate = req.clone({ params: req.params.set('api_token', localStorage.getItem('token')) });
          return next.handle(duplicate).do((evt:HttpEvent<any>)=>{
              
        },((error:HttpErrorResponse) => {
          if(error instanceof HttpErrorResponse){
              if(error.status == 401){
                  localStorage.removeItem('token');
                  localStorage.removeItem("profile");
                  localStorage.removeItem('myChurches');
                  localStorage.removeItem('showNotification');
                  localStorage.removeItem('showTrailExpiry');
                  localStorage.clear();
                  //this._router.navigate(['login', { expire: 403 }]);
                  window.location.pathname = "/login;expire=403";
              }else{
                //localStorage.setItem('token-expire',"false");
              }
          }
        }));
      }else{
        return next.handle(req).do((evt:HttpEvent<any>)=>{
          /* TODO */
        },((error:any) => {

          // this.alertService.success(error.message, true);

        }));
      }
  }
}