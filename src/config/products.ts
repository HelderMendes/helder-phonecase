export const PRODUCT_PRICES = {
  material: {
    silicone: 0,
    polycarbonate: 5_00, // in javascript 5_00 is equal to 5.00 (ex: 1_000_100 === one million)
  },
  finish: {
    smooth: 0,
    textured: 3_00,
  },
} as const;

export const BASE_PRICE = 12_50;
