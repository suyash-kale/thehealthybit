import { createIntl } from 'react-intl';

import { Locale } from '../types/locale';

export let intl = createIntl({ locale: Locale.English, messages: {} });

export const setIntl = (locale: Locale, messages: Record<string, string>) => {
  intl = createIntl({ locale, messages });
  return intl;
};
