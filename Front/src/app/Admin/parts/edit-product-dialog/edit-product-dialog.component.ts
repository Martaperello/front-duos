import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FetchProductService } from '../../../Content/Services/fetch-data.service';



@Component({
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.component.html',
  styleUrls: ['./edit-product-dialog.component.scss'],
})
export class EditProductDialogComponent implements OnInit {
  editProductForm: FormGroup;
  categories = ['cafe', 'bolleria', 'bocatas'];

  constructor(
    private fb: FormBuilder,
    private fetchProductService: FetchProductService,
    private dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the product to edit
  ) {
    this.editProductForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required]],
      category: ['', Validators.required],
      ingredients: this.fb.array([]),
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Populate the form with the product data
    if (this.data?.product) {
      this.editProductForm.patchValue({
        title: this.data.product.title,
        description: this.data.product.description,
        category: this.data.product.category,
        price: this.data.product.price,
        stock: this.data.product.stock,
        image: this.data.product.image,
      });

      // Populate the ingredients array
      if (this.data.product.ingredients?.length) {
        this.data.product.ingredients.forEach((ingredient: any) => {
          this.addIngredient(ingredient);
        });
      } else {
        // Add a default empty ingredient if none exist
        this.addIngredient();
      }
    }
  }

  get ingredients(): FormArray {
    return this.editProductForm.get('ingredients') as FormArray;
  }

  addIngredient(ingredient?: any): void {
    const ingredientGroup = this.fb.group({
      name: [ingredient?.name || '', [Validators.required, Validators.minLength(2)]],
      quantity: [ingredient?.quantity || 0, [Validators.required, Validators.min(0)]],
      unit: [ingredient?.unit || '', Validators.required],
    });

    this.ingredients.push(ingredientGroup);
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.editProductForm.valid) {
      const updatedProduct = this.editProductForm.value;
      this.fetchProductService.updateProduct(this.data.product._id, updatedProduct).subscribe({
        next: (response) => {
          alert('Producto actualizado exitosamente.');
          this.dialogRef.close(response.data.product); // Pass updated product back
        },
        error: (err) => {
          alert('Error al actualizar el producto: ' + err.message);
        },
      });
    }
  }
}
