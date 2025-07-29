export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: number;
  store: string;
  nicotineLevel?: number;
  volume?: number;
  baseRatio?: { vg: number; pg: number };
}

export interface Store {
  _id: string;
  name: string;
  location: string;
  phone: string;
  workingHours: string;
  image?: string;
}

export interface Liquid {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  nicotineLevel: number;
  volume: number;
  image: string;
  inStock: number;
  store: string;
  baseRatio: {
    vg: number;
    pg: number;
  };
  flavorProfile: {
    primary: string;
    secondary: string[];
    mentholLevel: number;
    sweetness: number;
    intensity: number;
    complexity: number;
  };
  mixingInfo: {
    isMixable: boolean;
    recommendedPercentage: number;
    compatibility: string[];
    notes: string;
  };
  category: string;
  tags: string[];
  fruitTypes?: string[];

  // التحليل الذكي القادم من الخادم
  analysis?: any;

  // طابع زمني لإنشاء السائل (مستخدم للفرز)
  createdAt?: string;
}

export interface Mix {
  _id: string;
  name: string;
  description: string;
  creator: string;
  liquids: Array<{
    liquid: Liquid;
    percentage: number;
  }>;
  totalPercentage: number;
  flavorProfile: {
    primary: string;
    secondary: string[];
    mentholLevel: number;
    sweetness: number;
    complexity: number;
  };
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTaste: string;
  rating: {
    average: number;
    count: number;
  };
  reviews: Array<{
    user: {
      _id: string;
      name: string;
    };
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Flavor {
  id: string;
  name: string;
  category: 'fruit' | 'dessert' | 'menthol' | 'tobacco' | 'beverage';
  description: string;
  strength: 1 | 2 | 3; // 1 = mild, 2 = medium, 3 = strong
}

export interface Order {
  id: string;
  products: { productId: string; quantity: number }[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  storeId: string;
  createdAt: Date;
}
