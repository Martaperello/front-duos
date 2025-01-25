import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './components/admin/admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SidebarComponent } from './parts/sidebar/sidebar.component';
import { UsersComponent } from './sections/users/users.component';
import { ProductsComponent } from './sections/products/products.component';
import { OrdersComponent } from './sections/orders/orders.component';
import {MatIconModule} from '@angular/material/icon';
import { CreateProductDialogComponent } from './parts/create-product-dialog/create-product-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';



@NgModule({
  declarations: [
    AdminComponent,
    SidebarComponent,
    UsersComponent,
    ProductsComponent,
    OrdersComponent,
    CreateProductDialogComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
  ]
})
export class AdminModule { }
