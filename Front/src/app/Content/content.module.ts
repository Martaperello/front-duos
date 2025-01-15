import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { ContentRoutingModule } from './content-routing-module';
import { HttpClientModule } from '@angular/common/http';
import { ShopComponent } from './components/shop/shop.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from './components/cart/cart.component';



@NgModule({
  declarations: [
    HomeComponent,
    ShopComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    ContentRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class ContentModule { }
