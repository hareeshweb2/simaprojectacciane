import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupportComponent } from './support/support.component';

const routes: Routes = [
  { path: '', redirectTo: 'support', pathMatch: 'full', data: { title: 'Myawana Help And Support' } },
  { path: 'support', component: SupportComponent, data: {title: 'Myawana Help And Support' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpRoutingModule { }
