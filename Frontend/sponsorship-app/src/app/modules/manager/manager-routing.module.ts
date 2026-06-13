import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingApprovalsComponent } from './pages/pending-approvals/pending-approvals.component';
import { ManagerDetailComponent } from './pages/manager-detail/manager-detail.component';

const routes: Routes = [
  {
    path: 'pending',
    component: PendingApprovalsComponent
  },
   {
    path: 'detail/:id',
    component: ManagerDetailComponent
  },
  {
    path: '',
    redirectTo: 'pending',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
