import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ForbiddenComponent{

  constructor() { }

}
