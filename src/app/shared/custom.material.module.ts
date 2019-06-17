import {MatNativeDateModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [MatNativeDateModule, MatDatepickerModule, MatSelectModule],
  exports: [MatNativeDateModule, MatDatepickerModule, MatSelectModule],
})
export class CustomMaterialModule { }