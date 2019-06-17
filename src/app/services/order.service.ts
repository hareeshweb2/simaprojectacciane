import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class OrderService {
  constructor(private http:HttpClient) { }

  getToken(){
    return localStorage.getItem('token');
  }

  getRecentOrder(postData):any{
    return this.http.post(environment.services.order.url+"order",postData);    
    
  }

  getOrderHistory(data):any{
    return this.http.post(environment.services.order.url+"order",data);    
  }
  
  getOrdertotalCount(data):any{
    return this.http.post(environment.services.order.url+"getTotalOrdersCount",data);    
  }

}
