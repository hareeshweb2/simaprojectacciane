import { Component, OnInit } from '@angular/core';
import { CommonService} from '../services/index';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  mobileRecordsLimit: number=5;
  records: any;
  constructor(private common:CommonService,private router:Router) { }

  ngOnInit() {
    this.records=this.common.getNotificationRecords();
  }
  goToParticularPage(notification){
    if(notification.Page=='Recent Orders'){
      this.router.navigate(['/dashboard']);
    }
    else if(notification.Page=='Add your church'){
      this.router.navigate(['/addChurch']);
    }
    else if(notification.Page=='Order History'){
      this.router.navigate(['/order/history']);
    }
    else if(notification.Page=='My Profile'){
      this.router.navigate(['/profile/detail']);
    }
  }
  onScroll(){
    this.mobileRecordsLimit+=5;
  }
}
