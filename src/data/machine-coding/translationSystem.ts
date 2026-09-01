import type { MachineCodingProblem } from "../../types";

export const translationSystemProblem: MachineCodingProblem = {
  id: "mc-translation",
  title: "Translation System (i18n)",
  difficulty: "Intermediate",
  category: "Machine Coding",
  tags: [
    "i18n",
    "context",
    "translation",
    "interpolation",
    "pluralization",
    "provider-pattern",
  ],
  problemStatement: `Build a lightweight internationalization (i18n) system in React that allows the entire application to switch between languages dynamically. The system should use React Context to provide translation functions to any component in the tree without prop drilling.

The translation system must support a dictionary-based approach where each language has a flat or nested key-value map. It should handle string interpolation (e.g., "Hello, {{name}}") and basic pluralization rules. Components should re-render efficiently when the language changes. The system should gracefully fall back to a default language if a key is missing in the current locale.

This problem tests understanding of the Context API, custom hooks, string processing, and building reusable infrastructure code.`,
  functionalRequirements: [
    "Switch the active language via a dropdown or button group",
    'Translate keys to strings using a t("key") function available throughout the component tree',
    'Support string interpolation: t("greeting", { name: "Alice" }) → "Hello, Alice"',
    'Support basic pluralization: t("item_count", { count: 5 }) → "5 items"',
    "Fall back to default language (e.g., English) when a key is missing in the selected locale",
    "Display a warning in development when a translation key is entirely missing",
    "Persist the selected language in localStorage and restore on mount",
  ],
  nonFunctionalRequirements: [
    "Efficient re-renders: only components consuming translations should update on language change",
    "Type-safe translation keys using TypeScript generics or mapped types",
    "Extensible: easy to add new languages by providing a new dictionary file",
  ],
  componentHierarchy: `App
├── I18nProvider (context provider)
│   ├── LanguageSwitcher
│   └── PageContent
│       ├── Header (uses t())
│       ├── MainSection (uses t())
│       └── Footer (uses t())`,
  stateDesign: `type Locale = 'en' | 'es' | 'fr';

interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// Dictionaries
const dictionaries: Record<Locale, TranslationDictionary> = {
  en: { greeting: 'Hello, {{name}}!', item_count_one: '{{count}} item', item_count_other: '{{count}} items', ... },
  es: { greeting: '¡Hola, {{name}}!', item_count_one: '{{count}} elemento', item_count_other: '{{count}} elementos', ... },
  fr: { greeting: 'Bonjour, {{name}} !', item_count_one: '{{count}} élément', item_count_other: '{{count}} éléments', ... },
};`,
  architecture: `The I18nProvider creates a React context holding the current locale, a setter, and the t() function. The t() function looks up the key in the current locale's dictionary, falls back to the default locale if missing, and then performs interpolation by replacing {{placeholder}} tokens with provided params. Pluralization is handled by appending _one or _other to the key based on the count param. The provider memoizes the context value to avoid unnecessary re-renders.`,
  implementation: `import React, { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';

type Locale = 'en' | 'es' | 'fr';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const dictionaries: Record<Locale, Record<string, string>> = {
  en: {
    'app.title': 'My Application',
    'greeting': 'Hello, {{name}}!',
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'item_count_one': '{{count}} item',
    'item_count_other': '{{count}} items',
    'welcome.message': 'Welcome to our platform, {{name}}. You have {{count}} notifications.',
    'footer.copyright': '© {{year}} My App. All rights reserved.',
    'language.label': 'Language',
  },
  es: {
    'app.title': 'Mi Aplicación',
    'greeting': '¡Hola, {{name}}!',
    'nav.home': 'Inicio',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'item_count_one': '{{count}} elemento',
    'item_count_other': '{{count}} elementos',
    'welcome.message': 'Bienvenido a nuestra plataforma, {{name}}. Tienes {{count}} notificaciones.',
    'footer.copyright': '© {{year}} Mi App. Todos los derechos reservados.',
    'language.label': 'Idioma',
  },
  fr: {
    'app.title': 'Mon Application',
    'greeting': 'Bonjour, {{name}} !',
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'item_count_one': '{{count}} élément',
    'item_count_other': '{{count}} éléments',
    'welcome.message': 'Bienvenue sur notre plateforme, {{name}}. Vous avez {{count}} notifications.',
    'footer.copyright': '© {{year}} Mon App. Tous droits réservés.',
    'language.label': 'Langue',
  },
};

const DEFAULT_LOCALE: Locale = 'en';

function interpolate(template: string, params: Record<string, string | number>): string {
  return template.replace(/\\{\\{(\\w+)\\}\\}/g, (_, key) => {
    return key in params ? String(params[key]) : \`{{\${key}}}\`;
  });
}

function getPluralized(dict: Record<string, string>, key: string, count: number): string | undefined {
  const suffix = count === 1 ? '_one' : '_other';
  return dict[key + suffix];
}

function getSavedLocale(): Locale {
  try {
    const saved = localStorage.getItem('app-locale') as Locale;
    if (saved && saved in dictionaries) return saved;
  } catch { /* ignore */ }
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getSavedLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try { localStorage.setItem('app-locale', newLocale); } catch { /* ignore */ }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = dictionaries[locale];
      const fallbackDict = dictionaries[DEFAULT_LOCALE];

      let template: string | undefined;

      if (params && typeof params.count === 'number') {
        template = getPluralized(dict, key, params.count) ?? getPluralized(fallbackDict, key, params.count);
      }

      if (!template) {
        template = dict[key] ?? fallbackDict[key];
      }

      if (!template) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(\`[i18n] Missing key: "\${key}" for locale "\${locale}"\`);
        }
        return key;
      }

      return params ? interpolate(template, params) : template;
    },
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider');
  return ctx;
}

function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const locales: { code: Locale; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label htmlFor="lang-select" style={{ fontWeight: 500, fontSize: 14 }}>
        {t('language.label')}:
      </label>
      <select
        id="lang-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #cbd5e1' }}
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function TranslationDemo() {
  return (
    <I18nProvider>
      <TranslationDemoContent />
    </I18nProvider>
  );
}

function TranslationDemoContent() {
  const { t } = useI18n();

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: 'system-ui' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>{t('app.title')}</h1>
        <LanguageSwitcher />
      </header>

      <nav style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <a href="#home" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>{t('nav.home')}</a>
        <a href="#about" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>{t('nav.about')}</a>
        <a href="#contact" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>{t('nav.contact')}</a>
      </nav>

      <section style={{ background: '#f8fafc', padding: 24, borderRadius: 8, marginBottom: 24 }}>
        <h2 style={{ margin: '0 0 8px' }}>{t('greeting', { name: 'Alice' })}</h2>
        <p style={{ margin: '0 0 8px', color: '#475569' }}>
          {t('welcome.message', { name: 'Alice', count: 7 })}
        </p>
        <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
          {t('item_count', { count: 1 })} | {t('item_count', { count: 5 })}
        </p>
      </section>

      <footer style={{ textAlign: 'center', color: '#94a3b8', fontSize: 13, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}`,
  accessibility: `The language selector uses a native <select> with an associated <label> for screen reader support. All text content is translated so screen readers read in the active language. The html lang attribute should be updated when locale changes (in a full app). Navigation links are semantic <a> elements. The UI avoids icon-only language toggles that would be inaccessible.`,
  performance: `The context value is memoized with useMemo to prevent unnecessary re-renders of consumers. The t() function is memoized with useCallback and only changes when locale changes. Dictionary lookups are O(1) hash map access. For very large apps, consider splitting dictionaries by route and lazy-loading them to reduce initial bundle size.`,
  edgeCases: [
    "Missing translation key — fall back to default locale, then return the key itself",
    "Missing interpolation param — leave the {{placeholder}} token visible as a signal",
    "Count of 0 — uses _other suffix in English pluralization rules",
    "Locale in localStorage is invalid or removed — fall back to default locale",
    "Nested key notation (dot-separated) — could be supported by splitting and traversing",
    'RTL languages (Arabic, Hebrew) — need dir="rtl" on the document and layout adjustments',
  ],
  testingStrategy: [
    "Unit test: interpolate replaces all {{placeholders}} with provided params",
    "Unit test: t() returns correct translation for each locale",
    "Unit test: t() falls back to default locale for missing keys",
    "Unit test: pluralization selects _one vs _other correctly",
    "Integration test: switching language re-renders all translated text",
    "Integration test: locale persists in localStorage and restores on remount",
  ],
  improvements: [
    'Support nested key paths like t("nav.home") resolving nested dictionary objects',
    "Lazy-load translation dictionaries per locale to reduce bundle size",
    "Add number and date formatting using Intl APIs based on locale",
    "Support gender-based translations in addition to pluralization",
    "Add a translation management UI for non-developer contributors",
  ],
  followUpQuestions: [
    "How would you handle right-to-left (RTL) languages in your layout?",
    "How would you lazy-load translation files for each locale?",
    "What are the limitations of this approach vs a full library like react-intl or i18next?",
    "How would you add support for complex pluralization rules (e.g., Arabic has 6 plural forms)?",
  ],
};
