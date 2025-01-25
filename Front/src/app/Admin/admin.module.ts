import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './components/admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SidebarComponent } from './parts/sidebar/sidebar.component';
import { UsersComponent } from './sections/users/users.component';
import { ProductsComponent } from './sections/products/products.component';
import { OrdersComponent } from './sections/orders/orders.component';



@NgModule({
  declarations: [
    AdminComponent,
    SidebarComponent,
    UsersComponent,
    ProductsComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
