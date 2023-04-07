import fs from 'fs';
import path from 'path';

import { MessagesType, Locale } from '../types/intl';

// message for all the locales.
const MESSAGES: MessagesType = Object.values(Locale).reduce((acc, locale) => {
  const data = fs.readFileSync(
    path.resolve(__dirname, `../../public/locale/${locale}.json`),
    'utf8',
  );
  return {
    ...acc,
    [locale]: JSON.parse(data.toString()),
  };
}, {} as MessagesType);

// handing internationalization for language support.
export class Intl {
  locale: Locale = Locale.English;

  constructor(locale?: Locale) {
    if (locale && Object.values(Locale).includes(locale)) {
      this.locale = locale;
    }
  }

  formatMessage({ id }: { id: string }): string {
    return MESSAGES[this.locale][id];
  }
}
