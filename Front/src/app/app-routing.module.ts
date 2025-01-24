import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/components/login/login.component';
import { AuthGuard } from './Auth/auth.guard';
import { AdminAuthGuard } from './Auth/adminAuth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./Auth/auth.module').then(m => m.AuthModule),
    data: { hideLayout: true},
  },
  { path: 'admin',
    loadChildren: () => import('./Admin/admin.module').then(m => m.AdminModule),
 
    data: { hideLayout: false }, },
  {path: '',
  loadChildren: () => import('./Content/content.module').then(m => m.ContentModule),
  canActivate: [AuthGuard], 
  data: { hideLayout: false},
}
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
