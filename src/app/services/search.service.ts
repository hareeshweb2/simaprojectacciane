import { Injectable, Output } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { environment } from '../../environments/environment';

@Injectable()
export class SearchService {
  lessChars: boolean = false;

    constructor(private _http: HttpClient) { }
  // This is used to search the churches using observable call with the debounce time of 300 milliseconds
  search(terms: Observable<string>) {    
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term) { 

    let searchObj = {
      searchVal: term
    }
    if(term.length > 2) 
      {  
        this.lessChars = false;  
        return this._http.post(environment.services.church.url + "SearchChurch", searchObj)     
      }else {
        this.lessChars = true;
        return this.lessChars+term;        
      }
  }
// This is used to search the address using observable call with the debounce time of 300 milliseconds
  searchAddress(terms: Observable<string>) {
    return terms.debounceTime(200)
      .distinctUntilChanged()
      .switchMap(term => this.searchAddressEntries(term));
  }

  searchAddressEntries(term) {
    let streetObj = {
      street: term
    }
    if(term.length > 2) 
    {  
      this.lessChars = false;  
    return this._http.post(environment.services.user.url + "suggestAddress", streetObj)
  }else {
    this.lessChars = true;
    return this.lessChars+term;        
  }
  }
}
