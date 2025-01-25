import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { ProductsComponent } from './sections/products/products.component';
import { OrdersComponent } from './sections/orders/orders.component';
import { UsersComponent } from './sections/users/users.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent, // Admin layout
    children: [
      { path: 'products', component: ProductsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'users', component: UsersComponent },
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
