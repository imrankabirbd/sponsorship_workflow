import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestorRoutingModule } from './requestor-routing.module';
import { CreateRequestComponent } from './pages/create-request/create-request.component';
import { MyRequestsComponent } from './pages/my-requests/my-requests.component';
import { RequestDetailComponent } from './pages/request-detail/request-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CreateRequestComponent,
    MyRequestsComponent,
    RequestDetailComponent
  ],
  imports: [
    CommonModule,
    RequestorRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RequestorModule { }
