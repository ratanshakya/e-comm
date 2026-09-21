import { Product } from '@/types';
import { PRODUCTS } from '@/data/products';

// Global in-memory cache to ensure changes persist even if MongoDB is not connected
declare global {
  // eslint-disable-next-line no-var
  var memoryCatalog: Product[] | undefined;
}

if (!global.memoryCatalog) {
  global.memoryCatalog = [...PRODUCTS];
}

export const getMemoryProducts = (): Product[] => {
  if (!global.memoryCatalog) {
    global.memoryCatalog = [...PRODUCTS];
  }
  return global.memoryCatalog;
};

export const setMemoryProducts = (products: Product[]) => {
  global.memoryCatalog = products;
};

export const addMemoryProduct = (product: Product) => {
  const current = getMemoryProducts();
  global.memoryCatalog = [product, ...current];
  return product;
};

export const updateMemoryProduct = (id: string, updates: Partial<Product>) => {
  const current = getMemoryProducts();
  const index = current.findIndex((p) => p.id === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...updates };
    global.memoryCatalog = [...current];
    return current[index];
  }
  return null;
};

export const deleteMemoryProduct = (id: string) => {
  const current = getMemoryProducts();
  global.memoryCatalog = current.filter((p) => p.id !== id);
  return true;
};
