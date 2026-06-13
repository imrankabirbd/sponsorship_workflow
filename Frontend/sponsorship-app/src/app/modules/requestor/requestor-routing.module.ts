import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRequestComponent } from './pages/create-request/create-request.component';
import { MyRequestsComponent } from './pages/my-requests/my-requests.component';
import { RequestDetailComponent } from './pages/request-detail/request-detail.component';

const routes: Routes = [
  { path: 'create', component: CreateRequestComponent },
  { path: 'my-requests', component: MyRequestsComponent },
  { path: 'detail/:id', component: RequestDetailComponent },
  { path: 'edit/:id', component: CreateRequestComponent },
  { path: '', redirectTo: 'my-requests', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestorRoutingModule { }
