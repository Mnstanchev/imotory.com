import { Metadata } from 'next';

export type Language = 'en' | 'bg' | 'ru';

export interface LocalizedMetadata {
  title: Record<Language, string>;
  description: Record<Language, string>;
  keywords?: Record<Language, string>;
  openGraph?: {
    title: Record<Language, string>;
    description: Record<Language, string>;
  };
}

export interface PageMetadata extends LocalizedMetadata {
  canonical: string;
  alternates?: {
    languages: Record<Language, string>;
  };
}

// Base metadata configuration for all pages
export const siteMetadata = {
  siteName: {
    en: "Imotory - Premium Real Estate in Bulgaria",
    bg: "Имотори - Премиум недвижими имоти в България", 
    ru: "Имотори - Премиум недвижимость в Болгарии"
  },
  baseUrl: 'https://imotory.com',
  defaultImage: '/Home-Page-Image-Search.png',
  twitterHandle: '@imotory',
  facebook: 'imotory',
  instagram: 'imotory'
};

// Page-specific metadata
export const pageMetadata: Record<string, PageMetadata> = {
  home: {
    title: {
      en: "Imotory - Premium Real Estate & Properties in Bulgaria",
      bg: "Имотори - Премиум недвижими имоти и жилища в България",
      ru: "Имотори - Премиум недвижимость и объекты в Болгарии"
    },
    description: {
      en: "Discover luxury real estate in Bulgaria. Browse premium apartments, houses, and commercial properties in Sofia, Plovdiv, Varna, and Burgas. Expert real estate services since 1993.",
      bg: "Открийте луксозни недвижими имоти в България. Разгледайте премиум апартаменти, къщи и търговски имоти в София, Пловдив, Варна и Бургас. Експертни услуги от 1993г.",
      ru: "Откройте роскошную недвижимость в Болгарии. Просматривайте премиум квартиры, дома и коммерческие объекты в Софии, Пловдиве, Варне и Бургасе. Экспертные услуги с 1993 года."
    },
    keywords: {
      en: "Bulgaria real estate, luxury properties, apartments Sofia, houses Plovdiv, Varna properties, Burgas real estate, Bulgarian property market, premium homes",
      bg: "недвижими имоти България, луксозни имоти, апартаменти София, къщи Пловдив, имоти Варна, недвижими имоти Бургас, пазар на имоти България, премиум жилища",
      ru: "недвижимость Болгария, роскошная недвижимость, квартиры София, дома Пловдив, недвижимость Варна, недвижимость Бургас, рынок недвижимости Болгария, премиум дома"
    },
    canonical: '/',
    openGraph: {
      title: {
        en: "Premium Real Estate in Bulgaria | Imotory",
        bg: "Премиум недвижими имоти в България | Имотори",
        ru: "Премиум недвижимость в Болгарии | Имотори"
      },
      description: {
        en: "Discover luxury real estate in Bulgaria with Imotory. Premium apartments, houses, and commercial properties across major Bulgarian cities.",
        bg: "Открийте луксозни недвижими имоти в България с Имотори. Премиум апартаменти, къщи и търговски имоти в основните български градове.",
        ru: "Откройте роскошную недвижимость в Болгарии с Имотори. Премиум квартиры, дома и коммерческие объекты в крупных болгарских городах."
      }
    }
  },

  about: {
    title: {
      en: "About Imotory - Your Trusted Real Estate Partner Since 1993",
      bg: "За Имотори - Вашият доверен партньор за недвижими имоти от 1993г.",
      ru: "О Имотори - Ваш надежный партнер по недвижимости с 1993 года"
    },
    description: {
      en: "Learn about Imotory's 30+ years of experience in Bulgarian real estate. Our mission, values, and commitment to exceptional property services and client satisfaction.",
      bg: "Научете за 30+ годишния опит на Имотори в българските недвижими имоти. Нашата мисия, ценности и ангажираност към изключителни услуги и клиентско удовлетворение.",
      ru: "Узнайте о 30+ летнем опыте Имотори в болгарской недвижимости. Наша миссия, ценности и приверженность исключительным услугам и удовлетворенности клиентов."
    },
    keywords: {
      en: "Imotory history, real estate experience Bulgaria, property experts, real estate company Sofia, trusted property services",
      bg: "история Имотори, опит недвижими имоти България, експерти по имоти, фирма за недвижими имоти София, доверени услуги",
      ru: "история Имотори, опыт недвижимости Болгария, эксперты по недвижимости, компания недвижимости София, надежные услуги"
    },
    canonical: '/about'
  },

  contact: {
    title: {
      en: "Contact Imotory - Get Expert Real Estate Advice Today",
      bg: "Свържете се с Имотори - Получете експертен съвет за недвижими имоти днес",
      ru: "Свяжитесь с Имотори - Получите экспертную консультацию по недвижимости сегодня"
    },
    description: {
      en: "Contact our real estate experts for personalized property advice. Visit our Sofia office, call us, or send a message. Professional real estate consultation available.",
      bg: "Свържете се с нашите експерти за персонализиран съвет за недвижими имоти. Посетете нашия офис в София, обадете ни се или изпратете съобщение.",
      ru: "Свяжитесь с нашими экспертами для персонализированной консультации по недвижимости. Посетите наш офис в Софии, позвоните нам или отправьте сообщение."
    },
    keywords: {
      en: "contact real estate agent Bulgaria, property consultation Sofia, real estate advice, Imotory office, property experts contact",
      bg: "контакт агент недвижими имоти България, консултация имоти София, съвет недвижими имоти, офис Имотори, контакт експерти",
      ru: "контакт агент недвижимости Болгария, консультация недвижимости София, совет недвижимости, офис Имотори, контакт экспертов"
    },
    canonical: '/contact'
  },

  concierge: {
    title: {
      en: "Premium Concierge Services - Luxury Real Estate Support | Imotory",
      bg: "Премиум консиерж услуги - Поддръжка за луксозни имоти | Имотори",
      ru: "Премиум консьерж услуги - Поддержка роскошной недвижимости | Имотори"
    },
    description: {
      en: "Experience premium concierge services for luxury properties. From property management to exclusive viewings, we provide comprehensive support for high-end real estate clients.",
      bg: "Изживейте премиум консиерж услуги за луксозни имоти. От управление на имоти до ексклузивни огледи, предоставяме цялостна поддръжка за клиенти с висок клас имоти.",
      ru: "Испытайте премиум консьерж услуги для роскошной недвижимости. От управления недвижимостью до эксклюзивных просмотров, мы предоставляем комплексную поддержку для клиентов элитной недвижимости."
    },
    keywords: {
      en: "luxury concierge services, premium property support, exclusive real estate services, high-end property management, VIP real estate",
      bg: "луксозни консиерж услуги, премиум поддръжка имоти, ексклузивни услуги недвижими имоти, висок клас управление, VIP недвижими имоти",
      ru: "роскошные консьерж услуги, премиум поддержка недвижимости, эксклюзивные услуги недвижимости, элитное управление недвижимостью, VIP недвижимость"
    },
    canonical: '/concierge'
  },

  search: {
    title: {
      en: "Search Properties in Bulgaria - Find Your Perfect Home | Imotory",
      bg: "Търсене на имоти в България - Намерете вашия перфектен дом | Имотори",
      ru: "Поиск недвижимости в Болгарии - Найдите свой идеальный дом | Имотори"
    },
    description: {
      en: "Search thousands of properties across Bulgaria. Advanced filters for apartments, houses, and commercial real estate in Sofia, Plovdiv, Varna, Burgas and more.",
      bg: "Търсете сред хиляди имоти в цяла България. Разширени филтри за апартаменти, къщи и търговски недвижими имоти в София, Пловдив, Варна, Бургас и още.",
      ru: "Ищите среди тысяч объектов недвижимости по всей Болгарии. Расширенные фильтры для квартир, домов и коммерческой недвижимости в Софии, Пловдиве, Варне, Бургасе и др."
    },
    keywords: {
      en: "Bulgaria property search, find apartments Sofia, houses for sale Bulgaria, commercial real estate search, property finder Bulgaria",
      bg: "търсене имоти България, намиране апартаменти София, къщи за продажба България, търсене търговски имоти, намиране имоти България",
      ru: "поиск недвижимости Болгария, найти квартиры София, дома на продажу Болгария, поиск коммерческой недвижимости, поиск недвижимости Болгария"
    },
    canonical: '/search'
  },

  searchMap: {
    title: {
      en: "Property Map Search - Explore Bulgaria Real Estate by Location | Imotory",
      bg: "Търсене на имоти с карта - Разгледайте недвижими имоти в България по локация | Имотори",
      ru: "Поиск недвижимости на карте - Исследуйте недвижимость Болгарии по местоположению | Имотори"
    },
    description: {
      en: "Interactive map search for Bulgarian properties. Explore neighborhoods, view property locations, and discover real estate opportunities across Bulgaria with our advanced map interface.",
      bg: "Интерактивно търсене с карта за български имоти. Разгледайте квартали, вижте местоположения на имоти и открийте възможности за недвижими имоти в България.",
      ru: "Интерактивный поиск на карте болгарской недвижимости. Исследуйте районы, просматривайте местоположения объектов и открывайте возможности недвижимости по всей Болгарии."
    },
    keywords: {
      en: "property map Bulgaria, real estate map search, interactive property finder, location-based property search, Bulgaria property locations",
      bg: "карта имоти България, търсене с карта недвижими имоти, интерактивен търсач имоти, търсене по локация, местоположения имоти България",
      ru: "карта недвижимости Болгария, поиск на карте недвижимости, интерактивный поиск недвижимости, поиск по местоположению, локации недвижимости Болгария"
    },
    canonical: '/search-map'
  },

  privacy: {
    title: {
      en: "Privacy Policy - How We Protect Your Data | Imotory",
      bg: "Политика за поверителност - Как защитаваме вашите данни | Имотори",
      ru: "Политика конфиденциальности - Как мы защищаем ваши данные | Имотори"
    },
    description: {
      en: "Learn how Imotory protects your personal information and respects your privacy. Comprehensive privacy policy for our real estate services and website.",
      bg: "Научете как Имотори защитава вашата лична информация и уважава вашата поверителност. Цялостна политика за поверителност за нашите услуги и уебсайт.",
      ru: "Узнайте, как Имотори защищает вашу личную информацию и уважает вашу конфиденциальность. Комплексная политика конфиденциальности для наших услуг и веб-сайта."
    },
    canonical: '/privacy'
  },

  terms: {
    title: {
      en: "Terms of Service - Legal Terms & Conditions | Imotory",
      bg: "Условия за ползване - Правни условия и разпоредби | Имотори",
      ru: "Условия обслуживания - Правовые условия и положения | Имотори"
    },
    description: {
      en: "Read the terms and conditions for using Imotory's real estate services and website. Legal agreements and user responsibilities.",
      bg: "Прочетете условията за ползване на услугите и уебсайта на Имотори. Правни споразумения и отговорности на потребителите.",
      ru: "Прочтите условия использования услуг и веб-сайта Имотори. Правовые соглашения и обязанности пользователей."
    },
    canonical: '/terms'
  },

  cookiePreferences: {
    title: {
      en: "Cookie Preferences - Manage Your Privacy Settings | Imotory",
      bg: "Предпочитания за бисквитки - Управлявайте настройките за поверителност | Имотори",
      ru: "Настройки файлов cookie - Управляйте настройками конфиденциальности | Имотори"
    },
    description: {
      en: "Manage your cookie preferences and privacy settings. Control how we use cookies to enhance your experience on our real estate website.",
      bg: "Управлявайте предпочитанията за бисквитки и настройките за поверителност. Контролирайте как използваме бисквитки за подобряване на изживяването ви.",
      ru: "Управляйте настройками файлов cookie и конфиденциальности. Контролируйте, как мы используем файлы cookie для улучшения вашего опыта на нашем сайте недвижимости."
    },
    canonical: '/cookie-preferences'
  }
};

// Helper function to generate metadata for a specific page and language
export function generatePageMetadata(
  pageKey: keyof typeof pageMetadata, 
  language: Language = 'en',
  additionalData?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  }
): Metadata {
  const page = pageMetadata[pageKey];
  const baseUrl = siteMetadata.baseUrl;
  
  if (!page) {
    throw new Error(`Page metadata not found for key: ${pageKey}`);
  }

  const title = additionalData?.title || page.title[language];
  const description = additionalData?.description || page.description[language];
  const url = additionalData?.url || `${baseUrl}${page.canonical}`;
  const image = additionalData?.image || siteMetadata.defaultImage;

  return {
    title,
    description,
    keywords: page.keywords?.[language],
    
    // Open Graph
    openGraph: {
      title: page.openGraph?.title[language] || title,
      description: page.openGraph?.description[language] || description,
      url,
      siteName: siteMetadata.siteName[language],
      images: [
        {
          url: image.startsWith('http') ? image : `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: getLocaleFromLanguage(language),
      type: 'website',
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${baseUrl}${image}`],
      creator: siteMetadata.twitterHandle,
    },

    // Canonical URL
    alternates: {
      canonical: url,
      languages: {
        'en': `${baseUrl}/en${page.canonical}`,
        'bg': `${baseUrl}${page.canonical}`,
        'ru': `${baseUrl}/ru${page.canonical}`,
      },
    },

    // Additional SEO
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },

    // Verification (add your actual verification codes)
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
  };
}

// Helper function to generate dynamic metadata for listings
export function generateListingMetadata(
  listing: any,
  language: Language = 'en'
): Metadata {
  const baseUrl = siteMetadata.baseUrl;
  const title = listing.title?.[language] || listing.title?.en || listing.slug;
  const description = listing.description?.[language] || listing.description?.en || 
    `${listing.bedrooms || 0} bedroom property in ${listing.location?.name?.[language] || 'Bulgaria'} for ${listing.price} ${listing.currency}`;
  
  const url = `${baseUrl}/listings/${listing.slug}`;
  const image = listing.images?.[0] || siteMetadata.defaultImage;

  return {
    title: `${title} - Premium Property | Imotory`,
    description,
    
    openGraph: {
      title,
      description,
      url,
      siteName: siteMetadata.siteName[language],
      images: [
        {
          url: image.startsWith('http') ? image : `${baseUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: getLocaleFromLanguage(language),
      type: 'article',
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.startsWith('http') ? image : `${baseUrl}${image}`],
      creator: siteMetadata.twitterHandle,
    },

    alternates: {
      canonical: url,
      languages: {
        'en': `${baseUrl}/en/listings/${listing.slug}`,
        'bg': `${baseUrl}/listings/${listing.slug}`,
        'ru': `${baseUrl}/ru/listings/${listing.slug}`,
      },
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

// Helper function to convert language to locale
function getLocaleFromLanguage(language: Language): string {
  const localeMap: Record<Language, string> = {
    'en': 'en_US',
    'bg': 'bg_BG',
    'ru': 'ru_RU',
  };
  return localeMap[language];
}

// Helper function for JSON-LD structured data
export function generateStructuredData(pageKey: keyof typeof pageMetadata, language: Language = 'en') {
  const page = pageMetadata[pageKey];
  const baseUrl = siteMetadata.baseUrl;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title[language],
    description: page.description[language],
    url: `${baseUrl}${page.canonical}`,
    inLanguage: language,
    isPartOf: {
      '@type': 'WebSite',
      name: siteMetadata.siteName[language],
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Imotory',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
    },
  };
}
