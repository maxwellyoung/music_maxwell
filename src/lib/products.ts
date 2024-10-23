export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Vinyl Record",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=400&text=Vinyl",
  },
  {
    id: 2,
    name: "T-Shirt",
    price: 24.99,
    image: "/placeholder.svg?height=400&width=400&text=T-Shirt",
  },
  {
    id: 3,
    name: "Poster",
    price: 19.99,
    image: "/placeholder.svg?height=400&width=400&text=Poster",
  },
];
