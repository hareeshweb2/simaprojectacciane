import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpRoutingModule } from './help-routing.module';
import { SupportComponent } from './support/support.component';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../services';

@NgModule({
  imports: [
    CommonModule,
    HelpRoutingModule,
    SharedModule
  ],
  declarations: [SupportComponent],
  providers: [AuthService]
})
export class HelpModule { }
