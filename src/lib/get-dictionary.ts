import type { Locale } from './i18n-config';
import { supabase } from '@/integrations/supabase/client';

const dictionaries = {
  nl: () => import('@/dictionaries/nl.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  fr: () => import('@/dictionaries/fr.json').then((module) => module.default),
  de: () => import('@/dictionaries/de.json').then((module) => module.default),
};

// Verbeterde deep merge helper die lege strings/nulls uit de bron negeert
function deepMerge(target: any, source: any) {
  if (!source) return target;
  
  for (const key in source) {
    const sourceValue = source[key];
    
    // Als het een object is (en geen array), recursief samenvoegen
    if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], sourceValue);
    } 
    // Alleen overschrijven als de bron een waarde heeft die niet leeg is
    else if (sourceValue !== undefined && sourceValue !== null && sourceValue !== "") {
      target[key] = sourceValue;
    }
  }
  return target;
}

export const getDictionary = async (locale: Locale) => {
  console.log("getDictionary called with locale:", locale);
  
  // Laad lokaal bestand
  let localDict = {};
  try {
    localDict = await (dictionaries[locale]?.() ?? dictionaries.nl());
    console.log("Local dictionary loaded:", localDict);
  } catch (error) {
    console.error("Error loading local dictionary:", error);
    localDict = await dictionaries.nl(); // Fallback to Dutch
  }
  
  try {
    // Haal database overrides op
    const { data, error } = await supabase
      .from('site_settings')
      .select('content')
      .eq('locale', locale)
      .maybeSingle();

    console.log("Database content result:", { data, error });

    if (data?.content && !error) {
      // Voeg database content samen met lokale content, behoud defaults voor lege velden
      // We gebruiken een kloon van localDict om mutatie van de module te voorkomen
      const merged = deepMerge(JSON.parse(JSON.stringify(localDict)), data.content);
      console.log("Merged dictionary:", merged);
      return merged;
    }
  } catch (e) {
    console.error("Error fetching dictionary from DB:", e);
  }

  console.log("Returning local dictionary:", localDict);
  return localDict;
};