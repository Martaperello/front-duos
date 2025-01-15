import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/components/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./Auth/auth.module').then(m => m.AuthModule)
  },
  {path: '',
  loadChildren: () => import('./Content/content.module').then(m => m.ContentModule)
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
