// types.ts
export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  _id: string;
}

export interface CartItems {
  product: string;
  quantity: number;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  ingredients: Ingredient[];
  price: number;
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface ProductData {
  products: Product[];
}

export interface ProductGetData {
  results: number;
  product: Product[];
}

export interface ApiResponse {
  status: string;
  data: ProductData;
}

export interface CartApiResponse {
  status: string;
  meesage: string;
  data: string;
}

export interface OrderApiResponse {
  status: string;
  message: string;
}

export interface ApiGetResponse {
  status: string;
  data: ProductGetData;
}

export interface cartItemsPopulated {
  product: Product;
  quantity: number;
}

export interface CartDataPopulated {
  _id: string;
  id: string;
  user: string;
  items: cartItemsPopulated[];
  total: number;
}

export interface PopulatedCartData {
  data: {
    cart: CartDataPopulated[];
  };
  status: string;
}

export interface ApiProductResponse {
  status: string;
  data: {
    product:Product;
  };
}
