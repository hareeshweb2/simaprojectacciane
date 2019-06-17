import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import * as profiles from './index';

const profileRoute: Routes = [
    { path: '', redirectTo: 'detail', pathMatch: 'full', data: { title: 'Profile Detail' } },
    { path: 'detail', component: profiles.DetailComponent, data: { title: 'Profile Detail' } },
    { path: 'detail/edit', component: profiles.DetailComponent, data: { title: 'Edit Profile Detail' } },
    { path: 'detail/edit-shipping', component: profiles.DetailComponent, data: { title: 'Shipping Edit Profile Detail' } },
    { path: 'detail/edit-billing', component: profiles.DetailComponent, data: { title: 'Billing Edit Profile Detail' } },
    { path: 'detail/edit-general', component: profiles.DetailComponent, data: { title: 'General Edit Profile Detail' } },
    { path: 'changepassword', component: profiles.ChangepasswordComponent, data: { title: 'MyProfile Change Password' } },
    { path: 'addChurch', component: profiles.AddChurchDetailsComponent, data: { title: 'MyProfile Add Your Church' } },
    { path: 'detail/edit-profile-pic', component: profiles.DetailComponent, data: { title: 'Change Photo' } }
]

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(profileRoute)
    ],
    exports: [RouterModule]
})

export class ProfileRoute { }