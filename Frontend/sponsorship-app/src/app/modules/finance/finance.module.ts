import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceReviewComponent } from './pages/finance-review/finance-review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FinanceDetailsComponent } from './pages/finance-details/finance-details.component';


@NgModule({
  declarations: [
    FinanceReviewComponent,
    FinanceDetailsComponent,
    FinanceDetailsComponent
  ],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FinanceModule { }
