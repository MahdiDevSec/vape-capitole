import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface UsedProduct {
  _id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  image: string;
  images: string[];
  price: number;
  originalPrice: number;
  category: 'vape-kit' | 'box-vape' | 'atomizer';
  condition: 'excellent' | 'good' | 'fair';
  status: 'available' | 'sold' | 'reserved';
  description: string;
  descriptionAr: string;
  descriptionFr: string;
  seller: string;
  sellerContact: string;
  rating: number;
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsedProductsResponse {
  products: UsedProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UsedProductFilters {
  category?: string;
  condition?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UsedProductStats {
  total: number;
  available: number;
  sold: number;
  reserved: number;
  categoryStats: Array<{ _id: string; count: number }>;
  conditionStats: Array<{ _id: string; count: number }>;
}

class UsedProductService {
  // Get all used products with filters
  async getUsedProducts(filters: UsedProductFilters = {}): Promise<UsedProductsResponse> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${API_URL}/used-products?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching used products:', error);
      throw error;
    }
  }

  // Get single used product
  async getUsedProduct(id: string): Promise<UsedProduct> {
    try {
      const response = await axios.get(`${API_URL}/used-products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching used product:', error);
      throw error;
    }
  }

  // Create new used product (Admin only)
  async createUsedProduct(productData: Partial<UsedProduct>): Promise<UsedProduct> {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${API_URL}/used-products`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating used product:', error);
      throw error;
    }
  }

  // Update used product (Admin only)
  async updateUsedProduct(id: string, productData: Partial<UsedProduct>): Promise<UsedProduct> {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(`${API_URL}/used-products/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating used product:', error);
      throw error;
    }
  }

  // Delete used product (Admin only)
  async deleteUsedProduct(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/used-products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error deleting used product:', error);
      throw error;
    }
  }

  // Get used products statistics (Admin only)
  async getUsedProductsStats(): Promise<UsedProductStats> {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/used-products/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching used products stats:', error);
      throw error;
    }
  }

  // Update product status (Admin only)
  async updateProductStatus(id: string, status: 'available' | 'sold' | 'reserved'): Promise<UsedProduct> {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.patch(`${API_URL}/used-products/${id}/status`, 
        { status }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating product status:', error);
      throw error;
    }
  }

  // Upload image for used product
  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('adminToken');
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Get category display name
  getCategoryDisplayName(category: string, language: 'ar' | 'en' | 'fr' = 'en'): string {
    const categoryNames = {
      'vape-kit': {
        ar: 'كيت فايب',
        en: 'Vape Kit',
        fr: 'Kit de Vape'
      },
      'box-vape': {
        ar: 'بوكس فايب',
        en: 'Box Vape',
        fr: 'Box Vape'
      },
      'atomizer': {
        ar: 'أتومايزر',
        en: 'Atomizer',
        fr: 'Atomiseur'
      }
    };

    return categoryNames[category as keyof typeof categoryNames]?.[language] || category;
  }

  // Get condition display name
  getConditionDisplayName(condition: string, language: 'ar' | 'en' | 'fr' = 'en'): string {
    const conditionNames = {
      'excellent': {
        ar: 'ممتاز',
        en: 'Excellent',
        fr: 'Excellent'
      },
      'good': {
        ar: 'جيد',
        en: 'Good',
        fr: 'Bon'
      },
      'fair': {
        ar: 'مقبول',
        en: 'Fair',
        fr: 'Correct'
      }
    };

    return conditionNames[condition as keyof typeof conditionNames]?.[language] || condition;
  }

  // Get status display name
  getStatusDisplayName(status: string, language: 'ar' | 'en' | 'fr' = 'en'): string {
    const statusNames = {
      'available': {
        ar: 'متوفر',
        en: 'Available',
        fr: 'Disponible'
      },
      'sold': {
        ar: 'تم البيع',
        en: 'Sold',
        fr: 'Vendu'
      },
      'reserved': {
        ar: 'محجوز',
        en: 'Reserved',
        fr: 'Réservé'
      }
    };

    return statusNames[status as keyof typeof statusNames]?.[language] || status;
  }

  // Get localized product name
  getLocalizedName(product: UsedProduct, language: 'ar' | 'en' | 'fr' = 'en'): string {
    switch (language) {
      case 'ar':
        return product.nameAr || product.name;
      case 'fr':
        return product.nameFr || product.name;
      default:
        return product.name;
    }
  }

  // Get localized product description
  getLocalizedDescription(product: UsedProduct, language: 'ar' | 'en' | 'fr' = 'en'): string {
    switch (language) {
      case 'ar':
        return product.descriptionAr || product.description;
      case 'fr':
        return product.descriptionFr || product.description;
      default:
        return product.description;
    }
  }
}

export default new UsedProductService();
