import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ShipComponent{
  addressArr;
  constructor() { }

}
