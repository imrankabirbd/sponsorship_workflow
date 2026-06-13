import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { DeshboardComponent } from './shared/components/deshboard/deshboard.component';

const routes: Routes = [
   {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'deshboard',
    component: DeshboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Requestor','Manager', 'SystemAdmin','FinanceAdmin'] }
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path: 'requestor',
    loadChildren: () => import('./modules/requestor/requestor.module').then(m => m.RequestorModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Requestor', 'SystemAdmin'] }
  },
  {
    path: 'manager',
    loadChildren: () => import('./modules/manager/manager.module').then(m => m.ManagerModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Manager', 'SystemAdmin'] }
  },
  {
    path: 'finance',
    loadChildren: () => import('./modules/finance/finance.module').then(m => m.FinanceModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['FinanceAdmin', 'SystemAdmin'] }
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['SystemAdmin'] }
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
