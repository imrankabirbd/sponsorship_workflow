import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { PendingApprovalsComponent } from './pages/pending-approvals/pending-approvals.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManagerDetailComponent } from './pages/manager-detail/manager-detail.component';


@NgModule({
  declarations: [
    PendingApprovalsComponent,
    ManagerDetailComponent,
    ManagerDetailComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ManagerModule { }
