import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileService } from '../../services/profile.service';
import { SearchService, AlertService} from '../../services/index';
import { HttpErrorResponse } from '@angular/common/http';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { SortChurchPipe } from '../../profile/pipes/sortchurchPipe';
import { Router } from '@angular/router';
import { CommonService } from '../../services';
import { AddYourChurchMessagesAndLabels, ErrorMessages } from '../../messages';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-add-church-details',
  templateUrl: './add-church-details.component.html',
  styleUrls: ['./add-church-details.component.scss']
})
export class AddChurchDetailsComponent implements OnInit {
  public query = '';
  public filteredList = [];
  data: any;
  churchList: any;
  addchurchbutton: boolean = true;
  messages = AddYourChurchMessagesAndLabels;
  keyUpSearch:boolean = true;
  tempSelected: any;
  finalAwanarole: any = [];
  displaySelected: boolean = false;
  lessCharactersEntered: boolean = false;
  displayAddChruch: boolean = true;
  public currentFocus = -1;
  tempRoles: any = [];
  tempRolesChurch: any = [];
  dropdownList = [];
  itemList = [];
  selectedItems = [];
  selectedChurchItems:string='';
  settings = {};
  churchSettings = {};
  private searchUpdated: Subject<string> = new Subject<string>();
  errorHandleObject = {
    churchError: false,
    roleError: false,
    dataNotFound: false
  };

  constructor( private profile: ProfileService, private common: CommonService, public route: Router, private searchService: SearchService,private alertService: AlertService) {
    this.searchService.search(this.searchUpdated)
    .subscribe(
      (result: any) => {
        if(!result.churches)
        {
          this.errorHandleObject.dataNotFound = false;
          this.lessCharactersEntered = false;
          this.filteredList = [];
          this.churchList = [];
          
        }else {        
          if (result.churches.length > 0) 
          { 
            this.errorHandleObject.dataNotFound = false;                 
            this.churchList = result.churches;
            this.filteredList = this.churchList;            
            this.lessCharactersEntered = false;
          }else
          {
            this.filteredList = [];
            this.churchList = [];
            this.lessCharactersEntered = true;
            this.errorHandleObject.dataNotFound = true;
          }
        }

      },
      (error: HttpErrorResponse) => {
        this.churchList = [];
        this.filteredList = [];
        this.alertService.error(ErrorMessages.serviceError, true);
      }
    );
  }

  searchTerm(event){
    this.keyUpSearch = true;
    if(this.keyUpSearch){
      this.searchUpdated.next(event);
    }
  }

  filterSearch(event) {
    var t;
    var x = document.getElementsByClassName("search-input-dropdown")[0];
    if (x) t = x.getElementsByTagName("ul");  
    if(this.filteredList.length > 0){  
      if(event.keyCode == 40){
        this.currentFocus++;
        this.addActive(t);
        document.getElementById('search-list').scrollTop = this.currentFocus * 77;
      }
      else if (event.keyCode == 38) { 
        this.currentFocus--;
        this.addActive(t);
        document.getElementById('search-list').scrollTop = this.currentFocus * 77;
      }
      else if (event.keyCode == 13) {
        event.preventDefault();
        if (this.currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (t) t[this.currentFocus].click();
          this.keyUpSearch = false;
          this.currentFocus = -1;
        }
      }
    }
  }

  addActive(list) {
    if (!list) return false;
    this.removeActive(list);
    if (this.currentFocus >= list.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = (list.length - 1);
    /*add class "autocomplete-active":*/
    list[this.currentFocus].classList.add("autocomplete-active");
  }

  removeActive(list) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < list.length; i++) {
      list[i].classList.remove("autocomplete-active");
    }
  }
 
  //adding church functionality
  addChurch(churchName) {
    this.addchurchbutton = false;
    let data = {
      token: localStorage.getItem('token'),
      contactId: this.profile.currentProfile.user.ContactId,
      accountId: churchName.id,
      awanaRoles: this.finalAwanarole.join("; "),
      churchRoles: this.selectedChurchItems,
      accountOwner: '',
      authorizedPurchaser: '',
      status: 'Pending'
    };
    if(this.finalAwanarole && this.finalAwanarole!==''){
      if(this.selectedChurchItems==''){
        if((this.finalAwanarole.indexOf('Commander') !== -1) && (this.finalAwanarole.indexOf('Club Secretary') !== -1 ))
        {
          data.authorizedPurchaser= 'true';
          data.accountOwner='true';
        }
        else if(this.finalAwanarole.indexOf('Club Secretary') !== -1)
        {
          data.authorizedPurchaser= 'true';
          data.accountOwner='false';
        }
        else if(this.finalAwanarole.indexOf('Commander') !== -1){
          data.authorizedPurchaser= 'true';
          data.accountOwner='true';
        }
        else{
          data.authorizedPurchaser= 'false';
          data.authorizedPurchaser='false';
        }
      }
      else{
        data.authorizedPurchaser= 'true';
        data.accountOwner='true';
      }
  }
  else if(this.selectedChurchItems && this.selectedChurchItems!==''){
        if(this.finalAwanarole ==''){
          data.authorizedPurchaser= 'true';
          data.accountOwner='true';
        }
  }
  else if(this.finalAwanarole=='' && this.selectedChurchItems==''){
    data.authorizedPurchaser= 'false';
    data.accountOwner='false';
  }
    this.profile.affiliateUserWithChurch(data).subscribe(
      (result: any) => {
        if (result.addUserResults.Message === 'Created') {
          this.alertService.success(this.messages.messages.AddChurchSuccess, true);
          this.displayAddChruch = false;
          setTimeout(() => {
            this.displayAddChruch = true;
            this.route.navigateByUrl('/profile/detail');
          }, 2000);
         
          this.addchurchbutton = true;
        }
         else {
          this.profile.profileUpdate();
          this.alertService.info(this.messages.messages.ChurchAlreadyAdded, true);
          setTimeout(() => {
            this.displayAddChruch = true;
          }, 5000);
          this.addchurchbutton = true;
        }
      },
      (error: HttpErrorResponse) => {
        this.alertService.error(ErrorMessages.serviceError, true);
      }
    );
  }
  filter() {
    if (this.query !== '' && this.query.length >= 2) {
      let tempFilteredList;
      tempFilteredList = this.churchList.filter(
        function (el) {
          return (
            el.name.toLowerCase().indexOf(this.query.toLowerCase()) > -1 ||
            el.billing_postal_code.indexOf(this.query.toLowerCase()) > -1
          );
        }.bind(this)
      );
      if (tempFilteredList.length !== 0) {
        this.filteredList = tempFilteredList;
        this.errorHandleObject.dataNotFound = false;
        this.lessCharactersEntered = false;
      } else {
        this.errorHandleObject.dataNotFound = true;
        this.lessCharactersEntered = true;
      }
    } else {
      this.filteredList = [];
      this.errorHandleObject.dataNotFound = false;
      this.lessCharactersEntered = true;
    }
  }
  getAllChurches() {
    this.profile.getChurchBynameZipcode().subscribe(
      (result: any) => {
        this.churchList = result.churches;
      },
      (error: HttpErrorResponse) => {
        this.churchList = [];
        this.alertService.error(ErrorMessages.serviceError, true);
      }
    );
  }
  select(item) {
    this.query = item;
    this.filteredList = [];
    this.displaySelected = true;
  }
  removeItem() {
    this.displaySelected = false;
    if (this.query.constructor === Object) {
      this.tempSelected = this.query;
      this.query = '';
      this.displaySelected = false;
      this.selectedItems.length = 0;
      this.selectedChurchItems='';
      this.finalAwanarole=[];
    } else {
      this.query = '';
      this.tempSelected = '';
      this.displaySelected = false;
    }
    document.getElementById('searchDetail').focus();
  }
  
  getAwanaRoles() {    
    this.profile.getAwanaRoles().subscribe(
      (res: any) => {
        for (let i = 0; i <= res.AwanaRolesResults.AwanaRoles.length; i++) {
          if (res.AwanaRolesResults.AwanaRoles[i]) {
            this.tempRoles.push(res.AwanaRolesResults.AwanaRoles[i].data);
            this.tempRoles[i]['id'] = i + 1;
            this.tempRoles[i]['itemName'] =
              res.AwanaRolesResults.AwanaRoles[i].data.Role;
          }
        }
      },
      (error: HttpErrorResponse) => {
        this.alertService.error(ErrorMessages.serviceError, true);
      }
    );
  }
 
  getChurchRoles() {   
    this.profile.getChurchRoles().subscribe(
      (res: any) => {
        for (let i = 0; i <= res.ChurchRolesResults.ChurchRoles.length; i++) {
          if (res.ChurchRolesResults.ChurchRoles[i]) {
            this.tempRolesChurch.push(
              res.ChurchRolesResults.ChurchRoles[i].data
            );
            this.tempRolesChurch[i]['id'] = i + 1;
            this.tempRolesChurch[i]['itemName'] =
              res.ChurchRolesResults.ChurchRoles[i].data.Role;
          }
        }
      },
      (error: HttpErrorResponse) => {
        this.alertService.error(ErrorMessages.serviceError, true);
      }
    );
  }
  sendMessage() {
    this.query = '';
    this.displaySelected = false; //added this to suppress blank selected church name
    this.selectedItems.length = 0;
    this.selectedChurchItems='';
    this.errorHandleObject.roleError = false;
    this.errorHandleObject.churchError = false;
    this.errorHandleObject.dataNotFound = false;
    this.filteredList.length = 0;
  }
  
  ngOnInit() {
    window.scrollTo(0, 0);
    this.getAwanaRoles();
    this.getChurchRoles();
    this.selectedItems = [];
    this.selectedChurchItems ='';
    this.hideProfileHead();
    //calling this function to get list of churches
   // this.getAllChurches();
    this.settings = {
      text: 'Select Awana Role',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: 'myclass custom-class'
    };
    this.churchSettings = {
      text: 'Select Church Role',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      classes: 'myclass custom-class'
    };
  }
  onItemSelect(item: any) {
    this.finalAwanarole.push(item.Role);
    this.errorHandleObject.roleError = true;
  }
  OnItemDeSelect(item: any) {
    let index = this.finalAwanarole.indexOf(item.Role);
    this.finalAwanarole.splice(index, 1);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  onDeSelectAll(items: any) {
    console.log(items);
  }
  onSelectAllChurch(items: any) {
    console.log(items);
  }
  onDeSelectAllChurch(items: any) {
    console.log(items);
  }
  hideProfileHead() {
    this.common.showHeaderProfile = false;
    this.common.showSidebar = "hidden";
  }
}
