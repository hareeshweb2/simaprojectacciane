import { Component, OnInit,ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-articles',
  templateUrl: './articles-and-newsletters.component.html',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ArticlesComponent{

  constructor() { }

}
