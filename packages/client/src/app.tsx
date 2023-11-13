import React, { FC, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { Locale } from './types/locale';
import { THEME } from './const/theme';
import { Router } from './router';
import { LocaleState } from './state/locale';
import { setIntl } from './utility/intl';
import { Notification } from './molecule/notification';
import { PageMessage } from './atom/page-message';
import { IntlProvider } from 'react-intl';

export const App: FC = () => {
  const locale = useRecoilValue(LocaleState);

  const [messages, setMessages] = useState<null | Record<string, string>>(null);

  // setting up lang.
  // application will be ready once the lang's messages are loaded.
  useEffect(() => {
    const main = async () => {
      const response = await fetch(`./locale/${locale}.json`);
      const data = await response.json();
      const intl = setIntl(locale, data);
      document.title = intl.formatMessage({ id: 'APP-NAME' });
      setMessages(data);
    };
    main();
  }, [locale]);

  return (
    <ThemeProvider theme={THEME}>
      <CssBaseline>
        {messages ? (
          <IntlProvider
            defaultLocale={Locale.English}
            locale={locale}
            messages={messages}
          >
            <BrowserRouter>
              <Router />
            </BrowserRouter>
            <Notification />
          </IntlProvider>
        ) : (
          <PageMessage title='Relax!'>
            We are getting things ready for you.
          </PageMessage>
        )}
      </CssBaseline>
    </ThemeProvider>
  );
};
