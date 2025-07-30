export const formatPrice = (value: number, lang: 'ar' | 'en' | 'fr' = 'ar'): string => {
  const locale = lang === 'fr' ? 'fr-DZ' : lang === 'en' ? 'en-DZ' : 'ar-DZ';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 2,
  }).format(value);
};
