import { Component, OnInit,ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-recent-subscription',
  templateUrl: './recent-subscription.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class RecentSubscriptionComponent{

  constructor() { }

}
