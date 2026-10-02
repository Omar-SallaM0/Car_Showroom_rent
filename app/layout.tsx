import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import './globals.css';
import Footer from './../components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider, Theme } from '@/context/ThemeContext';
import { Locale } from '@/translations';

import { FavoritesProvider } from '@/context/FavoritesContext';

export const metadata: Metadata = {
  title: 'Car Showroom | معرض السيارات',
  description: 'Discover and rent the best cars in the world | اكتشف واستأجر أفضل السيارات في العالم',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();

  // Language setup
  const savedLocaleCookie = cookieStore.get('showroom_locale')?.value;
  const initialLocale: Locale = savedLocaleCookie === 'en' ? 'en' : 'ar';
  const initialDir = initialLocale === 'ar' ? 'rtl' : 'ltr';

  // Theme setup
  const savedThemeCookie = cookieStore.get('showroom_theme')?.value;
  const initialTheme: Theme = savedThemeCookie === 'dark' ? 'dark' : 'light';

  return (
    <html
      lang={initialLocale}
      dir={initialDir}
      className={initialTheme === 'dark' ? 'dark' : ''}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedLocale = localStorage.getItem('showroom_locale');
                  if (savedLocale === 'ar' || savedLocale === 'en') {
                    document.documentElement.lang = savedLocale;
                    document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr';
                  }
                  var savedTheme = localStorage.getItem('showroom_theme');
                  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else if (savedTheme === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="relative antialiased selection:bg-primary-blue selection:text-white bg-white dark:bg-slate-950 text-black-100 dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider initialTheme={initialTheme}>
          <LanguageProvider initialLocale={initialLocale}>
            <FavoritesProvider>
              {children}
              <Footer />
            </FavoritesProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
