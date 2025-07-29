import { useState, useEffect } from 'react';
import { FaFlask, FaLightbulb, FaStar, FaPlus, FaTrash, FaSearch, FaThermometerHalf, FaCandyCane, FaLayerGroup, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import type { Liquid } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { rateSuggestion, fetchRatingCounts } from '../services/ratings';

// إزالة CSS مخصص للـ sliders
// (سنكتفي بتصميم Tailwind الافتراضي)

interface LiquidAnalysis {
  flavorProfile: {
    primary: string;
    secondary: string[];
    mentholLevel: number;
    sweetness: number;
    intensity: number;
    complexity: number;
    creaminess: number;
    fruitiness: number;
    spiciness: number;
  };
  compatibility: {
    compatibleWith: string[];
    incompatibleWith: string[];
    neutral: string[];
    recommendedPercentage: number;
  };
  chemicalProfile: {
    vgRatio: number;
    pgRatio: number;
    nicotineLevel: number;
    acidity: number;
    viscosity: number;
  };
  mixingRecommendations: string[];
}

interface MixSuggestion {
  name: string;
  liquids: Array<{
    liquid: string;
    percentage: number;
  }>;
  estimatedProfile: {
    mentholLevel: number;
    sweetness: number;
    complexity: number;
  };
  difficulty: string;
  mixHash: string;
}

interface MixAnalysis {
  totalPercentage: number;
  estimatedProfile: {
    mentholLevel: number;
    sweetness: number;
    complexity: number;
    intensity: number;
  };
  compatibility: string;
  warnings: string[];
  recommendations: string[];
  score?: number;
  incompatiblePairs?: string[];
}

const MixLiquids = () => {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'custom'>('suggestions');
  const [liquids, setLiquids] = useState<Liquid[]>([]);
  const [suggestions, setSuggestions] = useState<(MixSuggestion & {likes?:number,dislikes?:number})[]>([]);
  const [analysis, setAnalysis] = useState<MixAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();

  // Form states for suggestions
  const [suggestionForm, setSuggestionForm] = useState({
    desiredFlavor: 'fruit',
    mentholLevel: 0,
    sweetness: 5,
    complexity: 5,
    maxLiquids: 3
  });

  // Form states for custom mix
  const [customMix, setCustomMix] = useState<Array<{
    liquid: string;
    percentage: number;
  }>>([]);

  useEffect(() => {
    fetchLiquids();
  }, []);

  const fetchLiquids = async () => {
    try {
      const response = await axios.get('/api/liquids');
      setLiquids(response.data.liquids || response.data);
    } catch (err: any) {
      console.error('Error fetching liquids:', err);
      setError(err?.response?.data?.message || t('mix.noLiquidsAvailable'));
    }
  };

  const getSuggestions = async () => {
    if (liquids.length === 0) {
      setError(t('mix.noLiquidsInDatabase'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post('/api/mixes/suggestions', suggestionForm);
      setSuggestions(response.data.suggestions);
    } catch (err: any) {
      console.error('Error getting suggestions:', err);
      setError(err?.response?.data?.message || t('mix.suggestionsFailed'));
    } finally {
      setLoading(false);
    }
  };

  const analyzeCustomMix = async () => {
    if (customMix.length === 0) {
      setError(t('mix.addAtLeastOne'));
      return;
    }

    // التحقق من أن جميع السوائل محددة
    const hasEmptyLiquids = customMix.some(item => !item.liquid);
    if (hasEmptyLiquids) {
      setError(t('mix.selectAllLiquids'));
      return;
    }

    const totalPercentage = customMix.reduce((sum, item) => sum + item.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.1) {
      setError(t('mix.totalPercentage'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // تحضير البيانات بالشكل الصحيح
      const liquidsData = customMix.map(item => ({
        liquid: item.liquid,
        percentage: parseFloat(item.percentage.toString())
      }));
      
      const response = await axios.post('/api/mixes/analyze', { liquids: liquidsData });
      setAnalysis(response.data);
    } catch (err: any) {
      console.error('Error analyzing mix:', err);
      setError(err?.response?.data?.message || t('mix.analysisFailed'));
    } finally {
      setLoading(false);
    }
  };

  const addLiquidToCustomMix = () => {
    if (liquids.length === 0) {
      setError(t('mix.noLiquidsInDatabase'));
      return;
    }

    if (customMix.length >= 5) {
      setError(t('mix.maxFiveLiquids'));
      return;
    }
    setCustomMix([...customMix, { liquid: '', percentage: 0 }]);
  };

  const removeLiquidFromCustomMix = (index: number) => {
    setCustomMix(customMix.filter((_, i) => i !== index));
  };

  const updateCustomMixLiquid = (index: number, field: 'liquid' | 'percentage', value: string | number) => {
    const updatedMix = [...customMix];
    updatedMix[index] = { ...updatedMix[index], [field]: value };
    setCustomMix(updatedMix);
    
    // إذا تم تغيير السائل، إعادة حساب النسب تلقائياً
    if (field === 'liquid' && updatedMix.length > 1) {
      const equalPercentage = Math.round(100 / updatedMix.length);
      updatedMix.forEach((item, i) => {
        if (i === updatedMix.length - 1) {
          // آخر عنصر يأخذ الباقي
          const totalSoFar = updatedMix.slice(0, -1).reduce((sum, item) => sum + (item.percentage || 0), 0);
          updatedMix[i].percentage = 100 - totalSoFar;
        } else {
          updatedMix[i].percentage = equalPercentage;
        }
      });
      setCustomMix([...updatedMix]);
    }
  };

  const getFlavorIcon = (flavor: string) => {
    switch (flavor.toLowerCase()) {
      case 'fruit': return '🍎';
      case 'dessert': return '🍰';
      case 'tobacco': return '🚬';
      case 'menthol': return '❄️';
      case 'cream': return '🥛';
      case 'spice': return '🌶️';
      default: return '🍃';
    }
  };

  const getDifficultyColor = (difficulty: string | undefined) => {
    if (!difficulty) return 'text-gray-600';
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCompatibilityIcon = (compatibility: string) => {
    switch (compatibility.toLowerCase()) {
      case 'excellent': return <FaCheck className="text-green-500" />;
      case 'good': return <FaCheck className="text-blue-500" />;
      case 'fair': return <FaTimes className="text-yellow-500" />;
      case 'poor': return <FaExclamationTriangle className="text-red-500" />;
      default: return <FaTimes className="text-gray-500" />;
    }
  };

  const getCompatibilityColor = (compatibility: string) => {
    switch (compatibility.toLowerCase()) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const loadCounts = async (mixHash: string) => {
    try {
      const counts = await fetchRatingCounts(mixHash);
      setSuggestions(prev => prev.map(s => 
        s.mixHash === mixHash ? { ...s, likes: counts.likes, dislikes: counts.dislikes } : s
      ));
    } catch (error) {
      console.error('Error loading counts:', error);
    }
  };

  const handleRate = async (mixHash:string, like:boolean)=>{
    try {
      await rateSuggestion(mixHash, like);
      await loadCounts(mixHash);
    } catch (error) {
      console.error('Error rating suggestion:', error);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('mix.title')}</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <p className="text-gray-600 mb-4">{t('mix.contactAdmin')}</p>
        </div>
      </div>
    );
  }

  if (liquids.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t('mix.title')}</h1>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            {t('mix.noLiquidsInDatabase')}
          </div>
          <p className="text-gray-600 mb-4">{t('mix.adminMustAddLiquids')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-200 dark:from-black dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent mb-4">
            {t('mix.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('mix.smartSuggestions')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-8 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'suggestions' 
                  ? 'bg-gradient-to-r from-gray-800 to-black text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary'
              }`}
            >
              <FaLightbulb className="text-lg" />
              <span className="font-semibold">{t('mix.smartSuggestions')}</span>
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-8 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'custom' 
                  ? 'bg-gradient-to-r from-gray-800 to-black text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary'
              }`}
            >
              <FaFlask className="text-lg" />
              <span className="font-semibold">{t('mix.customMix')}</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-xl" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suggestions' ? (
          <div className="max-w-6xl mx-auto">
            {/* Suggestions Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                {t('mix.tellUsWhat')}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Desired Flavor */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('mix.desiredFlavor')}
                  </label>
                  <select
                    value={suggestionForm.desiredFlavor}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, desiredFlavor: e.target.value })}
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    <option value="fruit">🍎 {t('mix.fruit')}</option>
                    <option value="dessert">🍰 {t('mix.dessert')}</option>
                    <option value="tobacco">🚬 {t('mix.tobacco')}</option>
                    <option value="menthol">❄️ {t('mix.menthol')}</option>
                    <option value="cream">🥛 {t('mix.cream')}</option>
                    <option value="spice">🌶️ {t('mix.spice')}</option>
                  </select>
                </div>

                {/* Menthol Level */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('mix.mentholLevel')}: {suggestionForm.mentholLevel}/10
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={suggestionForm.mentholLevel}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, mentholLevel: parseInt(e.target.value) })}
                      className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>

                {/* Sweetness */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('mix.sweetness')}: {suggestionForm.sweetness}/10
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={suggestionForm.sweetness}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, sweetness: parseInt(e.target.value) })}
                      className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>

                {/* Complexity */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('mix.complexity')}: {suggestionForm.complexity}/10
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={suggestionForm.complexity}
                      onChange={(e) => setSuggestionForm({ ...suggestionForm, complexity: parseInt(e.target.value) })}
                      className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Get Suggestions Button */}
              <div className="text-center">
                <button
                  onClick={getSuggestions}
                  disabled={loading || liquids.length === 0}
                  className="bg-gradient-to-r from-gray-800 to-black text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>{t('mix.gettingSuggestions')}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <FaLightbulb className="text-xl" />
                      <span>{t('mix.getSuggestions')}</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Suggestions List */}
            {suggestions.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-8">
                  {t('mix.suggestedMixes')}
                </h3>
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {suggestion.name}
                      </h4>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor(suggestion.difficulty)}`}>
                          {suggestion.difficulty ? t(`mix.${suggestion.difficulty.toLowerCase()}`) : 'N/A'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRate(suggestion.mixHash, true)}
                            className="text-green-500 hover:text-green-700 transition-colors p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <FaStar className="text-lg" />
                          </button>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {suggestion.likes || 0}
                          </span>
                          <button
                            onClick={() => handleRate(suggestion.mixHash, false)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <FaTimes className="text-lg" />
                          </button>
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {suggestion.dislikes || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {t('mix.estimatedProfile')}
                        </h5>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-300">{t('mix.menthol')}:</span>
                            <span className="font-semibold text-gray-800 dark:text-white">
                              {suggestion.estimatedProfile.mentholLevel}/10
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-300">{t('mix.sweet')}:</span>
                            <span className="font-semibold text-gray-800 dark:text-white">
                              {suggestion.estimatedProfile.sweetness}/10
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-300">{t('mix.complex')}:</span>
                            <span className="font-semibold text-gray-800 dark:text-white">
                              {suggestion.estimatedProfile.complexity}/10
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
                          {t('mix.liquids')}
                        </h5>
                        <div className="space-y-2">
                          {suggestion.liquids.map((item, idx) => {
                            const liquid = liquids.find(l => l._id === item.liquid);
                            return (
                              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <span className="text-gray-800 dark:text-white font-medium">
                                  {liquid ? liquid.name : item.liquid}
                                </span>
                                <span className="text-primary font-semibold">
                                  {item.percentage}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Custom Mix Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                {t('mix.createCustomMix')}
              </h2>
              
              <div className="space-y-6 mb-8">
                {customMix.map((item, index) => {
                  const selectedLiquid = liquids.find(l => l._id === item.liquid);
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex-1">
                        <select
                          value={item.liquid}
                          onChange={(e) => updateCustomMixLiquid(index, 'liquid', e.target.value)}
                          className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="">{t('mix.selectLiquid')}</option>
                          {liquids.map((liquid) => (
                            <option key={liquid._id} value={liquid._id}>
                              {liquid.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={item.percentage}
                          onChange={(e) => updateCustomMixLiquid(index, 'percentage', parseInt(e.target.value) || 0)}
                          className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="%"
                        />
                      </div>
                      {selectedLiquid && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 w-40 truncate">
                          {selectedLiquid.name}
                        </div>
                      )}
                      <button
                        onClick={() => removeLiquidFromCustomMix(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={addLiquidToCustomMix}
                  disabled={liquids.length === 0}
                  className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FaPlus className="text-lg" />
                  {t('mix.addLiquid')}
                </button>
                <button
                  onClick={analyzeCustomMix}
                  disabled={loading || customMix.length === 0 || liquids.length === 0}
                  className="bg-gradient-to-r from-gray-800 to-black text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>{t('mix.analyzing')}</span>
                    </div>
                  ) : (
                    <span>{t('mix.analyzeMix')}</span>
                  )}
                </button>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>{t('mix.totalPercentage')}</p>
                <p>{t('mix.addAtLeastOne')}</p>
                <p>{t('mix.maxFiveLiquids')}</p>
                {liquids.length === 0 && (
                  <p className="text-red-600 font-semibold">{t('mix.adminMustAddLiquids')}</p>
                )}
              </div>
            </div>

            {/* Analysis Results */}
            {analysis && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                  {t('mix.mixAnalysis')}
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {t('mix.estimatedProfile')}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-300">{t('mix.menthol')}:</span>
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {analysis.estimatedProfile.mentholLevel}/10
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-300">{t('mix.sweet')}:</span>
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {analysis.estimatedProfile.sweetness}/10
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-300">{t('mix.complex')}:</span>
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {analysis.estimatedProfile.complexity}/10
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-300">{t('mix.intensity')}:</span>
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {analysis.estimatedProfile.intensity}/10
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {t('mix.compatibility')}
                    </h4>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {getCompatibilityIcon(analysis.compatibility)}
                      <span className={`font-semibold ${getCompatibilityColor(analysis.compatibility)}`}>
                        {t(`mix.${analysis.compatibility.toLowerCase()}`)}
                      </span>
                    </div>
                  </div>
                </div>

                {analysis.warnings.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-xl font-semibold mb-4 text-red-600 flex items-center gap-2">
                      <FaExclamationTriangle />
                      {t('mix.warnings')}
                    </h4>
                    <ul className="space-y-2">
                      {analysis.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                          <FaExclamationTriangle className="text-sm mt-0.5 flex-shrink-0" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.recommendations.length > 0 && (
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-green-600 flex items-center gap-2">
                      <FaCheck />
                      {t('mix.recommendations')}
                    </h4>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
                          <FaCheck className="text-sm mt-0.5 flex-shrink-0" />
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MixLiquids;
