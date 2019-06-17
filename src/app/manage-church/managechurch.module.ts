import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { serviceContainer } from '../services';
import { HttpClientModule } from '@angular/common/http';
import * as managechurch from './index';
import { ManageChurchRoute } from './managechurch.route';
import { NgxPaginationModule } from 'ngx-pagination'; //for pagination
import { InsertPeiodInDateFormatPipe } from '../pipes/insertPeriodInDateFormat.pipe';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CustomMaterialModule } from '../shared/custom.material.module';

@NgModule({
    declarations:[
        ...managechurch.manageChurchContainer
    ],
    imports:[
        CommonModule,
        NgxPaginationModule,
        ManageChurchRoute,
        SharedModule,FormsModule,ReactiveFormsModule,AngularMultiSelectModule,InfiniteScrollModule,CustomMaterialModule
    ],
    exports:[
        ...managechurch.manageChurchContainer,
        NgxPaginationModule,CustomMaterialModule      
    ],
    providers:[]

})

export class ManageChurchModule {}