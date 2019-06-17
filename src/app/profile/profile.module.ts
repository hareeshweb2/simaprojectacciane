import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthService, CommonService } from '../services/index';
import { HttpClientModule } from '@angular/common/http';
import * as profile from './index';
import { ProfileRoute } from './profile.route';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AddChurchDetailsComponent } from '../profile/add-church-details/add-church-details.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { SortChurchPipe } from '../profile/pipes/sortchurchPipe';
import { PhonePipe } from '../profile/pipes/telFormat.pipe';
import { ZipCodePipe } from '../profile/pipes/zipCodeFormat.pipe';
import {AppendCommaAndSpacePipe} from '../profile/pipes/comma&space.pipe';
import { CustomMaterialModule } from '../shared/custom.material.module';
import { TextMaskModule } from 'angular2-text-mask';
import { ClickOutsideModule } from 'ng4-click-outside';

@NgModule({
  declarations: [
    ...profile.profileContainer,
    AddChurchDetailsComponent,
    SortChurchPipe,
    PhonePipe,
    ZipCodePipe,
    AppendCommaAndSpacePipe
  ],
  imports: [
    CommonModule,
    ProfileRoute,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AngularMultiSelectModule,
    CustomMaterialModule,
    TextMaskModule,
    ClickOutsideModule
  ],
  exports: [...profile.profileContainer, CustomMaterialModule],
  providers: []
})
export class ProfileModule { }
