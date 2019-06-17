import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PaymentComponent{
 
  constructor() { }

}
