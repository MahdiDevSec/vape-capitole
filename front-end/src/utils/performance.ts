// أدوات تحسين الأداء

// تحسين تحميل الصور
export const optimizeImage = (src: string, width: number = 300): string => {
  // يمكن إضافة تحسين للصور هنا
  return src;
};

// تحسين الكاش
export class PerformanceCache {
  private cache = new Map<string, any>();
  private maxSize = 100;

  set(key: string, value: any, ttl: number = 300000): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// تحسين التمرير
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// تحسين البحث
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// تحسين تحميل البيانات
export const lazyLoad = (callback: () => void, options: IntersectionObserverInit = {}) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(entry.target);
      }
    });
  }, options);

  return observer;
};

// تحسين الذاكرة
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// تحسين التحميل
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// تحسين التحميل المتوازي
export const preloadImages = (srcs: string[]): Promise<void[]> => {
  return Promise.all(srcs.map(preloadImage));
};

// تحسين الأداء العام
export const optimizePerformance = () => {
  // تحسين التمرير
  let ticking = false;
  
  const updateScroll = () => {
    // تحديث العناصر المرئية فقط
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateScroll);
      ticking = true;
    }
  };

  // تحسين تحميل الصور
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  // تطبيق على جميع الصور
  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });

  return {
    imageObserver,
    requestTick
  };
};

// تحسين التحميل التدريجي
export const progressiveLoad = <T>(
  items: T[],
  batchSize: number = 10,
  delay: number = 100
): Promise<T[]> => {
  return new Promise((resolve) => {
    const result: T[] = [];
    let index = 0;

    const loadBatch = () => {
      const batch = items.slice(index, index + batchSize);
      result.push(...batch);
      index += batchSize;

      if (index >= items.length) {
        resolve(result);
      } else {
        setTimeout(loadBatch, delay);
      }
    };

    loadBatch();
  });
};

// تحسين البحث
export const searchOptimizer = {
  // البحث الثنائي
  binarySearch: <T>(arr: T[], target: T, compare: (a: T, b: T) => number): number => {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const comparison = compare(arr[mid], target);

      if (comparison === 0) return mid;
      if (comparison < 0) left = mid + 1;
      else right = mid - 1;
    }

    return -1;
  },

  // البحث بالفلتر
  filterSearch: <T>(items: T[], query: string, fields: (keyof T)[]): T[] => {
    const searchTerm = query.toLowerCase();
    return items.filter(item => 
      fields.some(field => {
        const value = item[field];
        return value && String(value).toLowerCase().includes(searchTerm);
      })
    );
  },

  // البحث بالترتيب
  rankedSearch: <T>(items: T[], query: string, fields: (keyof T)[]): T[] => {
    const searchTerm = query.toLowerCase();
    const results = items.map(item => {
      let score = 0;
      fields.forEach(field => {
        const value = item[field];
        if (value && String(value).toLowerCase().includes(searchTerm)) {
          score += 1;
        }
      });
      return { item, score };
    });

    return results
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(result => result.item);
  }
};

// تحسين التخزين المحلي
export const storageOptimizer = {
  // تخزين مع انتهاء الصلاحية
  setWithExpiry: (key: string, value: any, ttl: number): void => {
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  // استرجاع مع التحقق من الصلاحية
  getWithExpiry: (key: string): any | null => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  },

  // تنظيف التخزين المحلي
  cleanup: (): void => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      try {
        const item = JSON.parse(localStorage.getItem(key) || '');
        if (item.expiry && Date.now() > item.expiry) {
          localStorage.removeItem(key);
        }
      } catch {
        // تجاهل العناصر غير الصالحة
      }
    });
  }
};

// تحسين الشبكة
export const networkOptimizer = {
  // إعادة المحاولة
  retry: async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError!;
  },

  // التحميل المتوازي مع حد أقصى
  parallelWithLimit: async <T>(
    tasks: (() => Promise<T>)[],
    limit: number = 5
  ): Promise<T[]> => {
    const results: T[] = [];
    const executing: Promise<void>[] = [];

    for (const task of tasks) {
      const promise = task().then(result => {
        results.push(result);
        const index = executing.indexOf(promise);
        if (index > -1) executing.splice(index, 1);
      });

      executing.push(promise);

      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }

    await Promise.all(executing);
    return results;
  }
}; 