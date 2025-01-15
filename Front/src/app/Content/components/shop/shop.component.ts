import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { FetchProductService } from '../../Services/fetch-data.service';
import { Product } from '../../../../types';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalStorageService } from '../../../Auth/services/local-storage.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
})
export class ShopComponent implements OnInit, AfterViewInit, AfterViewChecked {
  productsData: Product[] | [];
  proctsQuantity: number;
  productForms: FormGroup[];
  cartItems: { product: string; quantity: number }[] = [];
  @ViewChildren('buyButton') buyButtons!: QueryList<ElementRef>;
  @ViewChildren('removeButton') removeButtons!: QueryList<ElementRef>;
  @ViewChildren('minusButton') minusButtons!: QueryList<ElementRef>;
  @ViewChildren('plusButton') plusButtons!: QueryList<ElementRef>;
  @ViewChildren('inputBox') inputBoxes!: QueryList<ElementRef>;

  constructor(
    private fetchService: FetchProductService,
    private renderer: Renderer2,
    private fb: FormBuilder,
    private localstorage: LocalStorageService
  ) {
    this.productsData = [];
    this.proctsQuantity = 0;
    this.productForms = [];
  }

  ngOnInit(): void {
    const userId = this.localstorage.get('userId') ?? '';
    this.fetchService.getCartItems(userId).subscribe((cartData) => {
      if (cartData.status === 'success') {
        const cartItems = cartData.data.cart[0].items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        }));
        // console.log(cartItems);

        this.localstorage.set('carItems', JSON.stringify(cartItems));
      }
    });

    // Load cart items from localStorage
    const savedCart = localStorage.getItem('carItems');
    this.cartItems = savedCart ? JSON.parse(savedCart) : [];
    // console.log('dos', this.cartItems);
    /****************************************Fetch Data  ******************************/
    this.fetchService.fetchAllProducts().subscribe((fetchData) => {
      if (fetchData) {
        this.productsData = fetchData.data.product;
        this.proctsQuantity = fetchData.data.results;
        // console.log('tres', this.cartItems);
        this.productForms = this.productsData.map((product) => {
          const cartItem = this.cartItems.find(
            (item) => item?.product === product._id
          );
          return this.fb.group({
            product: [product._id],
            quantity: [cartItem ? cartItem.quantity : 0],
          });
        });
        // console.log(
        //   'Initialized product forms:',
        //   this.productForms.map((form) => form.value)
        // );
      } else {
        this.productsData = [];
      }
    });
  }

  ///// Manage Button

  ngAfterViewInit(): void {
    // console.log('entre view init');
    this.buyButtons.changes.subscribe(() => {
      this.buyButtons.forEach((button: ElementRef, index: number) => {
        this.renderer.listen(button.nativeElement, 'click', () => {
          const bottom = button.nativeElement.closest('.bottom');
          if (bottom) {
            this.renderer.addClass(bottom, 'clicked');
          }
        });
      });
    });

    this.removeButtons.changes.subscribe(() => {
      this.removeButtons.forEach((button: ElementRef, index: number) => {
        this.renderer.listen(button.nativeElement, 'click', () => {
          const bottom = button.nativeElement.closest('.bottom');
          if (bottom) {
            this.renderer.removeClass(bottom, 'clicked');
          }
        });
      });
    });

    /*******************Quantity Buttons****************************/

    this.minusButtons.changes.subscribe(() => {
      this.minusButtons.forEach((button: ElementRef, index: number) => {
        this.renderer.listen(button.nativeElement, 'click', (event) => {
          this.decreaseValue(index, event);
        });
      });
    });

    this.plusButtons.changes.subscribe(() => {
      this.plusButtons.forEach((button: ElementRef, index: number) => {
        this.renderer.listen(button.nativeElement, 'click', (event) => {
          this.increaseValue(index, event);
          const bottom = button.nativeElement
            .closest('.container_card')
            ?.querySelector('.bottom');
          // console.log(bottom);
          if (bottom) {
            this.renderer.removeClass(bottom, 'clicked');
          }
        });
      });
    });
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
    this.fetchService
      .createCart(this.cartItems, userId)
      .subscribe((fetchData) => {
        this.localstorage.set('carItems', JSON.stringify(this.cartItems));
      });
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

    let quantityControl = this.productForms[index].get('quantity');
    // console.log('input', quantityControl);
    if (inputBox && quantityControl) {
      const value = quantityControl.value === 0 ? 1 : quantityControl.value;
      inputBox.value = value; // Synchronize the input box with the form control
      // console.log(`Quantity changed for product at index ${index}: ${value}`);
    }
  }

  ngAfterViewChecked(): void {
    // console.log('entre checked');
    this.productForms.forEach((_, index) => {
      this.handleQuantityChange(index);
    });
  }
  // Manage Form

  addToCart(index: number): void {
    const userId = this.localstorage.get('userId') ?? '';
    const cartItem = this.productForms[index].value;

    // Check if the product is already in the cart
    const existingIndex = this.cartItems.findIndex(
      (item) => item.product === cartItem.product
    );

    if (cartItem.quantity > 0) {
      if (existingIndex > -1) {
        // Update existing product quantity
        this.cartItems[existingIndex].quantity = cartItem.quantity;
      } else {
        // Add new product to the cart
        this.cartItems.push(cartItem);
      }
    } else if (existingIndex > -1) {
      // Remove product from cart if quantity is 0
      this.cartItems.splice(existingIndex, 1);
    }

    // Send the updated cart to the server
    this.fetchService
      .createCart(this.cartItems, userId)
      .subscribe((fetchData) => {
        // console.log(fetchData);
        if (fetchData) {
          this.localstorage.set('carItems', JSON.stringify(this.cartItems));
        }
      });
  }
}
