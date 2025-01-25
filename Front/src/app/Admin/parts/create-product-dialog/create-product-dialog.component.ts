import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchProductService } from '../../../Content/Services/fetch-data.service';



@Component({
  selector: 'app-create-product-dialog',
  templateUrl: './create-product-dialog.component.html',
  styleUrls: ['./create-product-dialog.component.scss'],
})
export class CreateProductDialogComponent {
  productForm: FormGroup;
  categories = ['cafe', 'bolleria', 'bocatas'];

  constructor(
    private fb: FormBuilder,
    private fetchProductService: FetchProductService,
    private dialogRef: MatDialogRef<CreateProductDialogComponent>
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required]],
      category: ['', Validators.required],
      ingredients: this.fb.array([]),
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      image: ['', Validators.required],
    });
  }

  get ingredients() {
    return this.productForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    const ingredientGroup = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
    });

    this.ingredients.push(ingredientGroup);
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.fetchProductService.createProduct(this.productForm.value).subscribe({
        next: (response) => {
          console.log(response);
          alert('Producto creado exitosamente.');
          this.dialogRef.close(response.data.product); // Close and pass the new product back
        },
        error: (err) => {
          alert('Error al crear el producto: ' + err.message);
        },
      });
    }
  }
}
