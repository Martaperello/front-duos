import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {
  ApiGetResponse,
  ApiResponse,
  CartApiResponse,
  CartItems,
  OrderApiResponse,
  PopulatedCartData,
} from '../../../types';
import { loadZone } from 'zone.js/lib/zone';

@Injectable({ providedIn: 'root' })
export class FetchProductService {
  constructor(private http: HttpClient) {}

  fetchProductByIds(productIds: String[]) {
    return this.http
      .post<any>('http://localhost:8000/api/products/products/by-id', {
        products_ids: productIds,
      })
      .pipe(
        catchError((error) => {
          // Log the error or handle it
          // console.error('Error fetching products:', error);
          // Optionally transform the error into a more user-friendly message
          const errorMessage =
            error?.error?.message ||
            'Failed to fetch products. Please try again later.';
          // Return an observable with an error
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  fetchAllProducts() {
    return this.http
      .get<ApiGetResponse>('http://localhost:8000/api/products')
      .pipe(
        catchError((error) => {
          // Log the error or handle it
          // console.error('Error fetching products:', error);
          // Optionally transform the error into a more user-friendly message
          const errorMessage =
            error?.error?.message ||
            'Failed to fetch products. Please try again later.';
          // Return an observable with an error
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  createCart(cartItems: CartItems[], userId: string) {
    return this.http
      .post<CartApiResponse>(`http://localhost:8000/api/cart/${userId}`, {
        items: cartItems,
      })
      .pipe(
        catchError((error) => {
          // Log the error or handle it
          // console.error('Error fetching products:', error);
          // Optionally transform the error into a more user-friendly message
          const errorMessage =
            error?.error?.message ||
            'Failed to fetch products. Please try again later.';
          // Return an observable with an error
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  getCartItems(userId: string) {
    return this.http
      .get<PopulatedCartData>(`http://localhost:8000/api/cart/${userId}`)
      .pipe(
        catchError((error) => {
          // Log the error or handle it
          // console.error('Error fetching products:', error);
          // Optionally transform the error into a more user-friendly message
          const errorMessage =
            error?.error?.message ||
            'Failed to fetch products. Please try again later.';
          // Return an observable with an error
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  createOrder(cartId: string, userId: string) {
    return this.http
      .post<OrderApiResponse>(`http://localhost:8000/api/order/${userId}`, {
        cartId,
      })
      .pipe(
        catchError((error) => {
          // Log the error or handle it
          // console.error('Error fetching products:', error);
          // Optionally transform the error into a more user-friendly message
          const errorMessage =
            error?.error?.message ||
            'Failed to fetch products. Please try again later.';
          // Return an observable with an error
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}
