export const translations = {
  en: {
    // Navigation
    nav: {
      about: "About",
      stack: "Stack",
      projects: "Projects",
      services: "Services"
    },
    // Contact
    contact: {
      title: "Contact"
    },
    copyright: "Artur Mamedov",

    // Welcome section
    welcome: {
      greeting: "Hello Everyone!",
      intro: "I'm Mamedov Artur."
    },

    // About section
    about: {
      text: "My name is Artur.\\nI`m the best one."
    },

    // Services section (для веб-студии)
    services: {
      title: "Our Services",
      webDev: {
        title: "Web Development",
        desc: "Modern, fast, and responsive websites tailored to your business needs"
      },
      design: {
        title: "UI/UX Design",
        desc: "Beautiful and intuitive interfaces that users love"
      },
      seo: {
        title: "SEO Optimization",
        desc: "Improve your website's visibility in search engines"
      },
      support: {
        title: "Technical Support",
        desc: "24/7 support and maintenance for your web projects"
      },
      mobile: {
        title: "Mobile Apps",
        desc: "Cross-platform mobile applications for iOS and Android"
      },
      consulting: {
        title: "IT Consulting",
        desc: "Expert advice on technology and digital transformation"
      }
    },

    // Stack section
    stack: {
      frontend: "Frontend",
      backend: "Backend",
      other: "Other Tools",
      experience: "exp"
    },

    // Projects section
    projects: {
      title: "Projects"
    },

    // Sudoku
    sudoku: {
      title: "Sudoku Game",
      check: "Check",
      new: "New Game",
      time: "Time",
      incomplete: "Sudoku is not completed yet...",
      incorrect: "Some numbers are incorrect...",
      congrats: "🎉 Congratulations! Time:"
    }
  },

  ru: {
    // Navigation
    nav: {
      about: "Обо мне",
      stack: "Стек",
      projects: "Проекты",
      services: "Услуги"
    },
    // Contact
    contact: {
      title: "Контакты"
    },
    copyright: "Артур Мамедов",

    // Welcome section
    welcome: {
      greeting: "Всем привет!",
      intro: "Я Мамедов Артур."
    },

    // About section
    about: {
      text: "Меня зовут Артур.\\nЯ лучший."
    },

    // Services section (для веб-студии)
    services: {
      title: "Наши услуги",
      webDev: {
        title: "Веб-разработка",
        desc: "Современные, быстрые и адаптивные сайты под ваш бизнес"
      },
      design: {
        title: "UI/UX дизайн",
        desc: "Красивые и интуитивные интерфейсы, которые нравятся пользователям"
      },
      seo: {
        title: "SEO оптимизация",
        desc: "Улучшите видимость вашего сайта в поисковых системах"
      },
      support: {
        title: "Техподдержка",
        desc: "Круглосуточная поддержка и обслуживание ваших веб-проектов"
      },
      mobile: {
        title: "Мобильные приложения",
        desc: "Кроссплатформенные приложения для iOS и Android"
      },
      consulting: {
        title: "IT консалтинг",
        desc: "Экспертные советы по технологиям и цифровой трансформации"
      }
    },

    // Stack section
    stack: {
      frontend: "Фронтенд",
      backend: "Бэкенд",
      other: "Другие инструменты",
      experience: "опыт"
    },

    // Projects section
    projects: {
      title: "Проекты"
    },

    // Sudoku
    sudoku: {
      title: "Игра Судоку",
      check: "Проверить",
      new: "Новая игра",
      time: "Время",
      incomplete: "Судоку ещё не завершено...",
      incorrect: "Некоторые цифры неверны...",
      congrats: "🎉 Поздравляем! Время:"
    }
  },

  uk: {
    // Navigation
    nav: {
      about: "Про мене",
      stack: "Стек",
      projects: "Проєкти",
      services: "Послуги"
    },
    // Contact
    contact: {
      title: "Контакти"
    },
    copyright: "Артур Мамедов",

    // Welcome section
    welcome: {
      greeting: "Всім привіт!",
      intro: "Я Мамедов Артур."
    },

    // About section
    about: {
      text: "Мене звати Артур.\\nЯ найкращий."
    },

    // Services section (для веб-студії)
    services: {
      title: "Наші послуги",
      webDev: {
        title: "Веб-розробка",
        desc: "Сучасні, швидкі та адаптивні сайти під ваш бізнес"
      },
      design: {
        title: "UI/UX дизайн",
        desc: "Красиві та інтуїтивні інтерфейси, які подобаються користувачам"
      },
      seo: {
        title: "SEO оптимізація",
        desc: "Покращте видимість вашого сайту в пошукових системах"
      },
      support: {
        title: "Техпідтримка",
        desc: "Цілодобова підтримка та обслуговування ваших веб-проєктів"
      },
      mobile: {
        title: "Мобільні додатки",
        desc: "Кросплатформені додатки для iOS та Android"
      },
      consulting: {
        title: "IT консалтинг",
        desc: "Експертні поради з технологій та цифрової трансформації"
      }
    },

    // Stack section
    stack: {
      frontend: "Фронтенд",
      backend: "Бекенд",
      other: "Інші інструменти",
      experience: "досвід"
    },

    // Projects section
    projects: {
      title: "Проєкти"
    },

    // Sudoku
    sudoku: {
      title: "Гра Судоку",
      check: "Перевірити",
      new: "Нова гра",
      time: "Час",
      incomplete: "Судоку ще не завершено...",
      incorrect: "Деякі цифри невірні...",
      congrats: "🎉 Вітаємо! Час:"
    }
  }
};

export class I18n {
  constructor() {
    this.currentLang = localStorage.getItem('language') || 'en';
    this.translations = translations;
  }

  setLanguage(lang) {
    if (!this.translations[lang]) {
      console.error(`Language '${lang}' not found`);
      return;
    }
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    this.updatePage();
  }

  t(path) {
    const keys = path.split('.');
    let value = this.translations[this.currentLang];

    for (const key of keys) {
      value = value?.[key];
    }

    return value || path;
  }

  updatePage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        element.textContent = translation;
      }
    });

    // Update welcome text (special case - no data-i18n attribute)
    const welcomeText1 = document.querySelector('#welcome-text-1');
    const welcomeText2 = document.querySelector('#welcome-text-2');
    if (welcomeText1) welcomeText1.textContent = this.t('welcome.greeting');
    if (welcomeText2) welcomeText2.textContent = this.t('welcome.intro');

    // Dispatch event for other components to update
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: this.currentLang } }));
  }

  getCurrentLanguage() {
    return this.currentLang;
  }
}
