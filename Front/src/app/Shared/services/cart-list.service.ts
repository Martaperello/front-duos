import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartListService {
  constructor() {}

  addProduct(index:string, quantity: number) {}

  updateProductt(index:string, quantity: number) {}

  deleteProduct(index:string) {}
}
