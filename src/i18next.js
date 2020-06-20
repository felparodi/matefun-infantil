import i18next from 'i18next';
import es from './i18nextEsp';

export default i18next.init({
    lng: 'es',
    debug: true,
    resources: {
      es: {
        translation: es
      }
    }
  }
)