export const theme = {
  light: {
    bg: {
      primary: 'bg-gray-50',
      secondary: 'bg-white',
      card: 'bg-white',
      elevated: 'bg-gray-100',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-500',
      tertiary: 'text-gray-400',
      brand: 'text-yellow-600',
    },
    border: {
      default: 'border-gray-200',
      strong: 'border-gray-300',
    },
  },
  dark: {
    bg: {
      primary: 'bg-gray-950',
      secondary: 'bg-gray-900',
      card: 'bg-gray-900',
      elevated: 'bg-gray-800',
    },
    text: {
      primary: 'text-white',
      secondary: 'text-gray-400',
      tertiary: 'text-gray-500',
      brand: 'text-yellow-500',
    },
    border: {
      default: 'border-gray-800',
      strong: 'border-gray-700',
    },
  },
};

// Color utilities for business theming
export const getColorShades = (colorClass) => {
  const colorMap = {
    'bg-amber-600': { light: 'bg-amber-50', medium: 'bg-amber-100', dark: 'bg-amber-600', text: 'text-amber-600', gradient: 'from-amber-500 to-amber-700' },
    'bg-blue-500': { light: 'bg-blue-50', medium: 'bg-blue-100', dark: 'bg-blue-500', text: 'text-blue-500', gradient: 'from-blue-400 to-blue-600' },
    'bg-pink-500': { light: 'bg-pink-50', medium: 'bg-pink-100', dark: 'bg-pink-500', text: 'text-pink-500', gradient: 'from-pink-400 to-pink-600' },
    'bg-orange-500': { light: 'bg-orange-50', medium: 'bg-orange-100', dark: 'bg-orange-500', text: 'text-orange-500', gradient: 'from-orange-400 to-orange-600' },
    'bg-red-400': { light: 'bg-red-50', medium: 'bg-red-100', dark: 'bg-red-400', text: 'text-red-400', gradient: 'from-red-300 to-red-500' },
    'bg-red-500': { light: 'bg-red-50', medium: 'bg-red-100', dark: 'bg-red-500', text: 'text-red-500', gradient: 'from-red-400 to-red-600' },
    'bg-yellow-500': { light: 'bg-yellow-50', medium: 'bg-yellow-100', dark: 'bg-yellow-500', text: 'text-yellow-500', gradient: 'from-yellow-400 to-yellow-600' },
    'bg-cyan-400': { light: 'bg-cyan-50', medium: 'bg-cyan-100', dark: 'bg-cyan-400', text: 'text-cyan-400', gradient: 'from-cyan-300 to-cyan-500' },
    'bg-cyan-500': { light: 'bg-cyan-50', medium: 'bg-cyan-100', dark: 'bg-cyan-500', text: 'text-cyan-500', gradient: 'from-cyan-400 to-cyan-600' },
    'bg-indigo-500': { light: 'bg-indigo-50', medium: 'bg-indigo-100', dark: 'bg-indigo-500', text: 'text-indigo-500', gradient: 'from-indigo-400 to-indigo-600' },
    'bg-stone-500': { light: 'bg-stone-50', medium: 'bg-stone-100', dark: 'bg-stone-500', text: 'text-stone-500', gradient: 'from-stone-400 to-stone-600' },
    'bg-amber-700': { light: 'bg-amber-50', medium: 'bg-amber-100', dark: 'bg-amber-700', text: 'text-amber-700', gradient: 'from-amber-600 to-amber-800' },
    'bg-gray-500': { light: 'bg-gray-50', medium: 'bg-gray-100', dark: 'bg-gray-500', text: 'text-gray-500', gradient: 'from-gray-400 to-gray-600' },
    'bg-orange-700': { light: 'bg-orange-50', medium: 'bg-orange-100', dark: 'bg-orange-700', text: 'text-orange-700', gradient: 'from-orange-600 to-orange-800' },
    'bg-purple-500': { light: 'bg-purple-50', medium: 'bg-purple-100', dark: 'bg-purple-500', text: 'text-purple-500', gradient: 'from-purple-400 to-purple-600' },
    'bg-emerald-500': { light: 'bg-emerald-50', medium: 'bg-emerald-100', dark: 'bg-emerald-500', text: 'text-emerald-500', gradient: 'from-emerald-400 to-emerald-600' },
    'bg-rose-500': { light: 'bg-rose-50', medium: 'bg-rose-100', dark: 'bg-rose-500', text: 'text-rose-500', gradient: 'from-rose-400 to-rose-600' },
    'bg-yellow-600': { light: 'bg-yellow-50', medium: 'bg-yellow-100', dark: 'bg-yellow-600', text: 'text-yellow-600', gradient: 'from-yellow-500 to-yellow-700' },
    'bg-violet-500': { light: 'bg-violet-50', medium: 'bg-violet-100', dark: 'bg-violet-500', text: 'text-violet-500', gradient: 'from-violet-400 to-violet-600' },
    'bg-slate-600': { light: 'bg-slate-50', medium: 'bg-slate-100', dark: 'bg-slate-600', text: 'text-slate-600', gradient: 'from-slate-500 to-slate-700' },
    'bg-sky-500': { light: 'bg-sky-50', medium: 'bg-sky-100', dark: 'bg-sky-500', text: 'text-sky-500', gradient: 'from-sky-400 to-sky-600' },
  };
  return colorMap[colorClass] || colorMap['bg-gray-500'];
};