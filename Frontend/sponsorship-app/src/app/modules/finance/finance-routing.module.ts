import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceReviewComponent } from './pages/finance-review/finance-review.component';
import { FinanceDetailsComponent } from './pages/finance-details/finance-details.component';

const routes: Routes = [
  {
    path: 'review',
    component: FinanceReviewComponent
  },
  {
    path: 'detail/:id',
    component: FinanceDetailsComponent
  },
  {
    path: '',
    redirectTo: 'review',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
