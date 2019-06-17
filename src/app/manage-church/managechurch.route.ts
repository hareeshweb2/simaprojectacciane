import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import * as managechurch from './index';

const managechurchRoute:Routes = [
    { path:'',redirectTo:'programs',pathMatch:'full', data: { title: 'Manage Leader'}},
    { path:'leaders',component:managechurch.LeaderListComponent , data: { title: 'Manage Leader'}},
    { path:'leaders/:id/update',component:managechurch.UpdateLeaderComponent , data: { title: 'Manage Leader Details'}},
    { path:'leaders/add',component:managechurch.LeaderDetailComponent , data: { title: 'Manage Leader Details'}},
    { path:'programs',component:managechurch.DisplayProgramsComponent , data: { title: 'Manage Programs'}},
    { path:'programs/modify',component:managechurch.ModifyProgramsComponent , data: { title: 'Manage Programs'}},
    { path:'leaders/:id',component:managechurch.ViewLeaderComponent , data: { title: 'Manage Leader Details'}}
]

@NgModule({
    imports:[
        CommonModule,
        RouterModule.forChild(managechurchRoute)
    ],
    exports:[ RouterModule ]
})
export class ManageChurchRoute {}