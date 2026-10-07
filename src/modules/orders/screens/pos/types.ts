export type ProductArtVariant =
  | "amber"
  | "cream"
  | "berry"
  | "sage"
  | "orange"
  | "chocolate"
  | "mint"
  | "coral";

export interface PosProduct {
  id: string;
  name: string;
  note: string;
  category: string;
  /** Price in EGP minor units. */
  priceMinor: number;
  stock: number;
  art: ProductArtVariant;
}

export interface CartLine {
  product: PosProduct;
  qty: number;
}
