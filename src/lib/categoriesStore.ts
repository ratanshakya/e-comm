export interface CategoryItem {
  id: string;
  categoryId: string;
  label: string;
  hindiLabel?: string;
  icon?: string;
  count?: number;
  order?: number;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'all', categoryId: 'all', label: 'All Collections', hindiLabel: 'सभी संग्रह', icon: 'Sparkles', order: 0 },
  { id: 'poshak', categoryId: 'poshak', label: 'Festive Heavy Poshaks', hindiLabel: 'राजसी भारी पोशाकें', icon: 'Shirt', order: 1 },
  { id: 'shringar', categoryId: 'shringar', label: 'Crown & Jewelry Sets', hindiLabel: 'मुकुट एवं शृंगार सेट', icon: 'Crown', order: 2 },
  { id: 'singhasan-jhula', categoryId: 'singhasan-jhula', label: 'Royal Thrones & Swings', hindiLabel: 'सिंहासन एवं झूले', icon: 'Armchair', order: 3 },
  { id: 'winter-special', categoryId: 'winter-special', label: 'Winter Velvet Collection', hindiLabel: 'शीतकालीन गर्म पोशाकें', icon: 'Snowflake', order: 4 },
  { id: 'seva-samagri', categoryId: 'seva-samagri', label: 'Puja & Seva Essentials', hindiLabel: 'पूजा एवं सेवा सामग्री', icon: 'Flame', order: 5 },
];

declare global {
  // eslint-disable-next-line no-var
  var memoryCategoriesStore: CategoryItem[] | undefined;
}

if (!global.memoryCategoriesStore) {
  global.memoryCategoriesStore = [...DEFAULT_CATEGORIES];
}

export const getMemoryCategories = (): CategoryItem[] => {
  if (!global.memoryCategoriesStore || global.memoryCategoriesStore.length === 0) {
    global.memoryCategoriesStore = [...DEFAULT_CATEGORIES];
  }
  return global.memoryCategoriesStore;
};

export const addMemoryCategory = (cat: CategoryItem) => {
  const current = getMemoryCategories();
  global.memoryCategoriesStore = [...current, cat];
  return cat;
};

export const updateMemoryCategory = (id: string, updates: Partial<CategoryItem>) => {
  const current = getMemoryCategories();
  const index = current.findIndex((c) => c.id === id || c.categoryId === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...updates };
    global.memoryCategoriesStore = [...current];
    return current[index];
  }
  return null;
};

export const deleteMemoryCategory = (id: string) => {
  if (id === 'all') return false; // cannot delete 'all'
  const current = getMemoryCategories();
  global.memoryCategoriesStore = current.filter((c) => c.id !== id && c.categoryId !== id);
  return true;
};
