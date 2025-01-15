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
  /************Ids de los productos a destacar en la pagina de inicio */
  productsIds = [
    '6733aeef69db33c1ba87f459',
    '6733aeef69db33c1ba87f45f',
    '6733aeef69db33c1ba87f47a',
    '6733aeef69db33c1ba87f48a',
    '6733aeef69db33c1ba87f474',
    '6733aeef69db33c1ba87f462',
  ];

  constructor(private fetchService: FetchProductService) {
    this.productsData = [];
  }

  ngOnInit(): void {
    this.fetchService
      .fetchProductByIds(this.productsIds)
      .subscribe((fetchData) => {
        if (fetchData) {
         this.productsData = fetchData.data.products
        } else {
          this.productsData  =[];
        }
      });
  }
}
