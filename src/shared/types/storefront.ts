export type Service = {
  id: string;
  number: string;
  name: string;
  description: string;
  duration: string;
  price: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  label: string;
  shade: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  shade: string;
  products: Product[];
};

export type BookingRequest = {
  id: string;
  number: number;
  name: string;
  service: string;
  createdAt: string;
};
