import { Component, OnInit } from '@angular/core';
import {HelpAndSupportMessages} from './../../messages';
import { CommonService } from '../../services';
@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {
  
  messages = HelpAndSupportMessages;
  constructor(private common:CommonService) { }

  chat(){
    var se = document.createElement("script");
        se.type = "text/javascript";
        se.async = true;
        se.src = "https://vcc-na17.8x8.com/CHAT/common/js/chat.js";
  
        var os = document.getElementsByTagName("script")[0];
        os.parentNode.insertBefore(se, os);
  }
  ngOnInit() {
    window.scrollTo(0, 0);
    this.chat();
    this.hideProfileHead();
  }

  hideProfileHead() {
    this.common.showHeaderProfile = false;
  }

}
