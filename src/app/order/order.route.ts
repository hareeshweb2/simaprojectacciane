import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import * as orders from './index';

const orderRoute:Routes = [
    { path:'',redirectTo:'history',pathMatch:'full', data: { title: 'Order History'}},
    { path:'history',component:orders.HistoryComponent , data: { title: 'Order History'}},
    { path:'history/:id',component:orders.OrderDetailComponent , data: { title: 'Order History Item'}},
    { path:'report',component:orders.ReportComponent , data: { title: 'Order Report'}},
    { path:'ship',component:orders.ShipComponent , data: { title: 'Order Shipment'}},
]

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(orderRoute)
    ],
    exports:[ RouterModule ]
})

export class OrderRoute {}