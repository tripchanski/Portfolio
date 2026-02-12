// Simple language switcher - no bullshit
const translations = {
  en: {
    'nav.about': 'About',
    'nav.stack': 'Stack',
    'nav.projects': 'Projects',
    'nav.services': 'Services',
    'contact.title': 'Contact',
    'services.title': 'Our Services',
    'services.webDev.title': 'Web Development',
    'services.webDev.desc': 'Modern, fast, and responsive websites tailored to your business needs',
    'services.design.title': 'UI/UX Design',
    'services.design.desc': 'Beautiful and intuitive interfaces that users love',
    'services.seo.title': 'SEO Optimization',
    'services.seo.desc': 'Improve your website\'s visibility in search engines',
    'services.support.title': 'Technical Support',
    'services.support.desc': '24/7 support and maintenance for your web projects',
    'services.mobile.title': 'Mobile Apps',
    'services.mobile.desc': 'Cross-platform mobile applications for iOS and Android',
    'services.consulting.title': 'IT Consulting',
    'services.consulting.desc': 'Expert advice on technology and digital transformation'
  },
  ru: {
    'nav.about': 'Обо мне',
    'nav.stack': 'Стек',
    'nav.projects': 'Проекты',
    'nav.services': 'Услуги',
    'contact.title': 'Контакты',
    'services.title': 'Наши услуги',
    'services.webDev.title': 'Веб-разработка',
    'services.webDev.desc': 'Современные, быстрые и адаптивные сайты под ваш бизнес',
    'services.design.title': 'UI/UX дизайн',
    'services.design.desc': 'Красивые и интуитивные интерфейсы, которые нравятся пользователям',
    'services.seo.title': 'SEO оптимизация',
    'services.seo.desc': 'Улучшите видимость вашего сайта в поисковых системах',
    'services.support.title': 'Техподдержка',
    'services.support.desc': 'Круглосуточная поддержка и обслуживание ваших веб-проектов',
    'services.mobile.title': 'Мобильные приложения',
    'services.mobile.desc': 'Кроссплатформенные приложения для iOS и Android',
    'services.consulting.title': 'IT консалтинг',
    'services.consulting.desc': 'Экспертные советы по технологиям и цифровой трансформации'
  },
  uk: {
    'nav.about': 'Про мене',
    'nav.stack': 'Стек',
    'nav.projects': 'Проекти',
    'nav.services': 'Послуги',
    'contact.title': 'Контакти',
    'services.title': 'Наші послуги',
    'services.webDev.title': 'Веб-розробка',
    'services.webDev.desc': 'Сучасні, швидкі та адаптивні сайти під ваш бізнес',
    'services.design.title': 'UI/UX дизайн',
    'services.design.desc': 'Красиві та інтуїтивні інтерфейси, які подобаються користувачам',
    'services.seo.title': 'SEO оптимізація',
    'services.seo.desc': 'Покращте видимість вашого сайту в пошукових системах',
    'services.support.title': 'Техпідтримка',
    'services.support.desc': 'Цілодобова підтримка та обслуговування ваших веб-проектів',
    'services.mobile.title': 'Мобільні додатки',
    'services.mobile.desc': 'Крос-платформні додатки для iOS та Android',
    'services.consulting.title': 'IT консалтинг',
    'services.consulting.desc': 'Експертні поради з технологій та цифрової трансформації'
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function updateLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Set initial language
  updateLanguage();

  // Get all language buttons
  const langButtons = document.querySelectorAll('.lang-btn');

  // Set active button
  langButtons.forEach(btn => {
    if (btn.dataset.lang === currentLang) {
      btn.classList.add('active');
    }

    // Add click handler
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      localStorage.setItem('lang', currentLang);

      // Update active state
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update page text
      updateLanguage();
    });
  });
});
