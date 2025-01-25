import { Component, OnInit } from '@angular/core';
import { FetchProductService } from '../../../Content/Services/fetch-data.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductDialogComponent } from '../../parts/create-product-dialog/create-product-dialog.component';
import { EditProductDialogComponent } from '../../parts/edit-product-dialog/edit-product-dialog.component';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  message: string | null = null;

  constructor(private productService: FetchProductService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.fetchAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.data.product || [];
      },
      error: (error) => {
        this.message = 'Failed to fetch products. Please try again later.';
        console.error(error);
      },
    });
  }

  confirmDelete(productId: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.deleteProduct(productId);
    }
  }

  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.message = 'Product deleted successfully.';
        this.loadProducts(); // Reload the products after deletion
      },
      error: (error) => {
        this.message = 'Failed to delete the product. Please try again later.';
        console.error(error);
      },
    });
  }


  editProduct(product: any) {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '600px',
      data: { product }, // Pass the product data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Update the product in the table
        const index = this.products.findIndex((p) => p._id === result._id);
        if (index > -1) {
          this.products[index] = result;
        }
      }
    });
  }

  openCreateProductDialog() {
    const dialogRef = this.dialog.open(CreateProductDialogComponent, {
      width: '600px',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh the product list or update the table
        this.products.push(result);
      }
    });
}
}

