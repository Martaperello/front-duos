import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import {
  ApiGetResponse,
  ApiProductResponse,
  ApiResponse,
  CartApiResponse,
  CartItems,
  OrderApiResponse,
  PopulatedCartData,
} from '../../../types';
import { loadZone } from 'zone.js/lib/zone';

@Injectable({ providedIn: 'root' })
export class FetchProductService {
  private apiUrl = 'https://back-duos.onrender.com/api/products';
  constructor(private http: HttpClient) {}

  fetchProductByIds(productIds: String[]) {
    return this.http
      .post<any>('https://back-duos.onrender.com/api/products/products/by-id', {
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
      .get<ApiGetResponse>('https://back-duos.onrender.com/api/products')
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
      .post<CartApiResponse>(`https://back-duos.onrender.com/api/cart/${userId}`, {
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
      .get<PopulatedCartData>(`https://back-duos.onrender.com/api/cart/${userId}`)
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
      .post<OrderApiResponse>(`https://back-duos.onrender.com/api/order/${userId}`, {
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

  getFeaturedProducts() {
    return this.http
      .get<any>('https://back-duos.onrender.com/api/products/featured')
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
   // Create a new product
   createProduct(productData: any) {
    return this.http.post<ApiProductResponse>(`${this.apiUrl}`, productData).pipe(
      catchError((error) => this.handleError(error, 'Failed to create product'))
    );
  }

  // Update a product
  updateProduct(productId: string, productData: any) {
    return this.http.put(`${this.apiUrl}/${productId}`, productData).pipe(
      catchError((error) =>
        this.handleError(error, `Failed to update product with ID: ${productId}`)
      )
    );
  }

  // Delete a product
  deleteProduct(productId: string) {
    return this.http.delete(`${this.apiUrl}/${productId}`).pipe(
      catchError((error) =>
        this.handleError(error, `Failed to delete product with ID: ${productId}`)
      )
    );
  }


  private handleError(error: any, defaultMessage: string) {
    const errorMessage = error?.error?.message || defaultMessage;
    return throwError(() => new Error(errorMessage));
  }
}
