import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AllRequestsComponent } from './pages/all-requests/all-requests.component';
import { ManageTypesComponent } from './pages/manage-types/manage-types.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminDetailsComponent } from './pages/admin-details/admin-details.component';


@NgModule({
  declarations: [
    AllRequestsComponent,
    AdminDetailsComponent,
    ManageTypesComponent,
    AdminDetailsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
