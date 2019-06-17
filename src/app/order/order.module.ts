import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OrderService } from '../services/order.service';
import { HttpClientModule } from '@angular/common/http';
import * as orders from './index';
import { OrderRoute } from './order.route';
import { HistoryComponent } from './history/history.component';
import { NgxPaginationModule } from 'ngx-pagination'; //for pagination
import { InsertPeiodInDateFormatPipe } from '../pipes/insertPeriodInDateFormat.pipe';
import { SharedModule } from '../shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { CustomMaterialModule } from '../shared/custom.material.module';

@NgModule({
    declarations:[
        ...orders.orderContainer,
        InsertPeiodInDateFormatPipe
    ],
    imports:[
        FormsModule,
        CommonModule,
        NgxPaginationModule,
        OrderRoute,
        SharedModule,
        InfiniteScrollModule,
        CustomMaterialModule
    ],
    exports:[
        ...orders.orderContainer,
        NgxPaginationModule,
        CustomMaterialModule
    ],
    providers:[]

})

export class OrderModule {}