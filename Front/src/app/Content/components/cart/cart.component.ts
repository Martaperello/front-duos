import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { LocalStorageService } from '../../../Auth/services/local-storage.service';
import { CartDataPopulated, cartItemsPopulated } from '../../../../types';
import { FetchProductService } from '../../Services/fetch-data.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, AfterViewInit {
  @ViewChildren('minusButton') minusButtons!: QueryList<ElementRef>;
  @ViewChildren('plusButton') plusButtons!: QueryList<ElementRef>;
  @ViewChildren('inputBox') inputBoxes!: QueryList<ElementRef>;

  productsData: cartItemsPopulated[];
  cartItems: { product: string; quantity: number }[] = [];
  cartTotal: number;
  cartId: string;
  productForms: FormGroup[];
  OrderSuccessMessage: string;

  constructor(
    private localstorage: LocalStorageService,
    private fetchservice: FetchProductService,
    private renderer: Renderer2,
    private fb: FormBuilder
  ) {
    this.productsData = [];
    this.cartTotal = 0;
    this.productForms = [];
    this.cartId = '';
    this.OrderSuccessMessage = '';
  }

  ngOnInit(): void {
    // Load cart items from localStorage
    const userId = this.localstorage.get('userId') ?? '';
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('carItems');
    this.cartItems = savedCart ? JSON.parse(savedCart) : [];

    if (userId) {
      this.fetchservice.getCartItems(userId).subscribe((cartData) => {
        if (cartData.status === 'success') {
          this.productsData = cartData.data.cart[0].items;
          this.cartTotal = cartData.data.cart[0].total;
          this.cartId = cartData.data.cart[0].id;
          this.productForms = this.productsData.map((element) => {
            const cartItem = this.cartItems.find(
              (item) => item?.product === element.product._id
            );
            return this.fb.group({
              product: [element.product._id],
              quantity: [cartItem ? cartItem.quantity : 0],
            });
          });
        }
      });
    }
  }

  ngAfterViewInit(): void {
    /*******************Quantity Buttons****************************/

    this.minusButtons.changes.subscribe(() => {
      this.minusButtons.forEach((button: ElementRef, index: number) => {
        this.renderer.listen(button.nativeElement, 'click', (event) => {
          this.decreaseValue(index, event);
          // console.log('minus');
        });
      });
    });

    this.plusButtons.changes.subscribe(() => {
      this.plusButtons.forEach((button: ElementRef, index: number) => {
        this.renderer.listen(button.nativeElement, 'click', (event) => {
          this.increaseValue(index, event);
          // console.log('add');
        });
      });
    });
  }

  increaseValue(index: number, event: Event): void {
    event.preventDefault(); // Prevent default action
    let currentValue = this.productForms[index].get('quantity')?.value;
    const max = parseInt(this.inputBoxes.get(index)?.nativeElement.max) || 10;
    currentValue === 0 ? (currentValue = 1) : currentValue;
    const newValue = Math.min(currentValue + 1, max);
    this.productForms[index].get('quantity')?.setValue(newValue);
    this.updateButtonStates(index);
    this.handleQuantityChange(index);
  }

  decreaseValue(index: number, event: Event): void {
    event.preventDefault(); // Prevent default action
    const inputBox = this.inputBoxes.get(index)?.nativeElement;
    if (inputBox) {
      // let value = parseInt(inputBox.value);
      const currentValue = this.productForms[index].get('quantity')?.value;
      const newValue = Math.max(currentValue - 1, 1);
      // inputBox.value = value;
      this.productForms[index].get('quantity')?.setValue(newValue);
      this.updateButtonStates(index);
      this.handleQuantityChange(index);
    }
  }

  updateButtonStates(index: number): void {
    const quantity = this.productForms[index].get('quantity')?.value;

    const max = parseInt(this.inputBoxes.get(index)?.nativeElement.max) || 10;

    const minusBtn = this.minusButtons.get(index)?.nativeElement;
    const plusBtn = this.plusButtons.get(index)?.nativeElement;

    if (minusBtn && plusBtn) {
      minusBtn.disabled = quantity <= 1;
      plusBtn.disabled = quantity >= max;
    }
  }

  handleQuantityChange(index: number): void {
    const inputBox = this.inputBoxes.get(index)?.nativeElement;
    const userId = this.localstorage.get('userId') ?? '';

    let quantityControl = this.productForms[index].get('quantity');
    if (inputBox && quantityControl) {
      const value = quantityControl.value === 0 ? 0 : quantityControl.value;
      inputBox.value = value; // Synchronize the input box with the form control

      // Update the cartItems array with the new quantity
      const productId = this.productForms[index].get('product')?.value;
      const cartItemIndex = this.cartItems.findIndex(
        (item) => item.product === productId
      );
      if (value === 0) {
        // Remove the product from cartItems and productForms
        if (cartItemIndex !== -1) {
          this.cartItems.splice(cartItemIndex, 1);
        }

        // Remove the product from productsData
        this.productsData.splice(index, 1);

        // Remove the corresponding form group
        this.productForms.splice(index, 1);
      } else {
        if (cartItemIndex !== -1) {
          this.cartItems[cartItemIndex].quantity = value;
        } else {
          this.cartItems.push({ product: productId, quantity: value });
        }
      }

      this.fetchservice
        .createCart(this.cartItems, userId)
        .subscribe((fetchData) => {
          // console.log(fetchData);
          if (fetchData) {
            this.localstorage.set('carItems', JSON.stringify(this.cartItems));
          }
        });

      // console.log(`Quantity changed for product at index ${index}: ${value}`);
    }
  }

  removeProduct(index: number, event: Event): void {
    event.preventDefault(); // Prevent default action
    this.productForms[index].get('quantity')?.setValue(0);
    this.updateButtonStates(index);
    // Synchronize the input box with the form control
    this.handleQuantityChange(index);
    // const inputBox = this.inputBoxes.get(index)?.nativeElement;
    // if (inputBox) inputBox.value = 1;

    // Update cart by removing the product
    const productId = this.productForms[index].get('product')?.value;
    this.cartItems = this.cartItems.filter(
      (item) => item.product !== productId
    );

    // Send the updated cart to the server
    const userId = this.localstorage.get('userId') ?? '';
    this.fetchservice
      .createCart(this.cartItems, userId)
      .subscribe((fetchData) => {
        this.localstorage.set('carItems', JSON.stringify(this.cartItems));
      });
  }

  createOrder(): void {
    const userId = this.localstorage.get('userId') ?? '';
    const confirmation = window.confirm('¿Está seguro de completar la compra?');

    if (confirmation) {
      this.fetchservice
        .createOrder(this.cartId, userId)
        .subscribe((fetchData) => {
          if (fetchData.status === 'success') {
            this.localstorage.remove('carItems');
            this.productsData = [];
            this.OrderSuccessMessage = fetchData.message;
            // console.log(this.OrderSuccessMessage);
          }
        });
    } else {
      // Handle cancellation
      console.log('Orden cancelada');
    }
  }
}
