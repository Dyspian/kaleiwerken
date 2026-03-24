import type { Locale } from './i18n-config';
import { supabase } from '@/integrations/supabase/client';

const dictionaries = {
  nl: () => import('@/dictionaries/nl.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  fr: () => import('@/dictionaries/fr.json').then((module) => module.default),
  de: () => import('@/dictionaries/de.json').then((module) => module.default),
};

// Deep merge helper
function deepMerge(target: any, source: any) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

export const getDictionary = async (locale: Locale) => {
  // Load local file
  const localDict = await (dictionaries[locale]?.() ?? dictionaries.nl());
  
  try {
    // Fetch database overrides
    const { data, error } = await supabase
      .from('site_settings')
      .select('content')
      .eq('locale', locale)
      .maybeSingle();

    if (data?.content && !error) {
      // Merge database content over local content
      return deepMerge({ ...localDict }, data.content);
    }
  } catch (e) {
    console.error("Error fetching dictionary from DB:", e);
  }

  return localDict;
};