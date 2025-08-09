import type { Store, Product, Flavor, Liquid } from '../types';

export const storesData: Store[] = [
  {
    id: '1',
    name: 'VAPE CAPITOL Pitonse',
    location: 'Pitonse Region',
    phone: '+213 XX XX XX XX',
    workingHours: '9:00 - 21:00',
  },
  {
    id: '2',
    name: 'VAPE CAPITOL Nouval Ville 1',
    location: 'Nouval Ville 1',
    phone: '+213 XX XX XX XX',
    workingHours: '9:00 - 21:00',
  },
  {
    id: '3',
    name: 'VAPE CAPITOL Ain Milia',
    location: 'Ain Milia Region',
    phone: '+213 XX XX XX XX',
    workingHours: '9:00 - 21:00',
  },
  {
    id: '4',
    name: 'VAPE CAPITOL Khenshla',
    location: 'Khenshla Region',
    phone: '+213 XX XX XX XX',
    workingHours: '9:00 - 21:00',
  },
];

export const flavorsData: Flavor[] = [
  {
    id: 'f1',
    name: 'Strawberry Blast',
    category: 'fruit',
    description: 'Sweet and juicy strawberry flavor',
    strength: 2
  },
  {
    id: 'f2',
    name: 'Vanilla Custard',
    category: 'dessert',
    description: 'Rich and creamy vanilla custard',
    strength: 1
  },
  {
    id: 'f3',
    name: 'Arctic Menthol',
    category: 'menthol',
    description: 'Strong and cooling menthol',
    strength: 3
  },
  {
    id: 'f4',
    name: 'Classic Tobacco',
    category: 'tobacco',
    description: 'Authentic tobacco taste',
    strength: 2
  },
  {
    id: 'f5',
    name: 'Coffee Supreme',
    category: 'beverage',
    description: 'Rich coffee with subtle notes of caramel',
    strength: 2
  }
];

export const liquidsData: Liquid[] = [
  {
    id: 'l1',
    name: 'Fruit Paradise',
    flavors: [flavorsData[0], flavorsData[2]], // Strawberry + Menthol
    nicotineLevel: 3,
    volume: 60,
    price: 24.99,
    image: '/images/liquid-fruit.jpg',
    inStock: 25,
    store: '1',
    baseRatio: { vg: 70, pg: 30 }
  },
  {
    id: 'l2',
    name: 'Dessert Dreams',
    flavors: [flavorsData[1], flavorsData[4]], // Vanilla + Coffee
    nicotineLevel: 6,
    volume: 30,
    price: 19.99,
    image: '/images/liquid-dessert.jpg',
    inStock: 15,
    store: '2',
    baseRatio: { vg: 50, pg: 50 }
  }
];

export const productsData: Product[] = [
  {
    id: '1',
    name: 'Vape Device Pro',
    description: 'Advanced vaping device with temperature control',
    price: 79.99,
    image: '/images/device-pro.jpg',
    category: 'devices',
    inStock: 15,
    store: '1'
  },
  {
    id: '2',
    name: 'Premium Coils (5-Pack)',
    description: 'High-quality replacement coils',
    price: 19.99,
    image: '/images/coils.jpg',
    category: 'coils',
    inStock: 50,
    store: '1'
  },
  {
    id: '3',
    name: 'Organic Cotton',
    description: 'Pure organic Japanese cotton',
    price: 5.99,
    image: '/images/cotton.jpg',
    category: 'cotton',
    inStock: 100,
    store: '2'
  },
];
