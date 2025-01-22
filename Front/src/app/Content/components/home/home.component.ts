import { Component, OnInit } from '@angular/core';
import { Product } from '../../../../types';
import { FetchProductService } from '../../Services/fetch-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  productsData: Product[] | [];

  constructor(private fetchService: FetchProductService) {
    this.productsData = [];
  }

  ngOnInit(): void {
    this.fetchService
      .getFeaturedProducts()
      .subscribe((fetchData) => {
        if (fetchData) {
         this.productsData = fetchData.data.products
        } else {
          this.productsData  =[];
        }
      });
  }
}
