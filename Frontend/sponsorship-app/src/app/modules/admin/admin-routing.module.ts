import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllRequestsComponent } from './pages/all-requests/all-requests.component';
import { ManageTypesComponent } from './pages/manage-types/manage-types.component';
import { AdminDetailsComponent } from './pages/admin-details/admin-details.component';

const routes: Routes = [
  { path: 'all-requests', component: AllRequestsComponent },
  { path: 'manage-types', component: ManageTypesComponent },
  { path: 'detail/:id', component: AdminDetailsComponent },
  { path: '', redirectTo: 'all-requests', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
