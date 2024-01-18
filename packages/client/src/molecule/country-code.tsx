import React, { FC, useState, useCallback, useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useIntl } from 'react-intl';

import IndiaFlag from './../assets/flags/india.svg';

export interface CountryType {
  code: string;
  name: string;
  flag: string;
}

// list of supported countries.
const COUNTRIES: Array<CountryType> = [
  {
    code: '91',
    name: 'INDIA',
    flag: IndiaFlag,
  },
];

interface CountryCodeProps {
  onChange: (country: CountryType) => void;
}

// selecting country code component.
export const CountryCode: FC<CountryCodeProps> = ({ onChange }) => {
  const { formatMessage } = useIntl();

  // selected country.
  const [country, setCountry] = useState<CountryType>(COUNTRIES[0]);

  // setting default country.
  // will trigger onChange event whenever country value is changed.
  useEffect(() => {
    if (country) {
      onChange(country);
    }
  }, [country, onChange]);

  // handle country change.
  const onChangeCountry = useCallback(
    (event: SelectChangeEvent<string>) => {
      const code = event.target.value;
      // finding country through country code.
      const selectedCountry = COUNTRIES.find(
        (country) => country.code === code,
      );
      if (selectedCountry) {
        setCountry(selectedCountry);
      }
    },
    [onChange],
  );

  return (
    <FormControl fullWidth>
      <Select value={country?.code} onChange={onChangeCountry}>
        {COUNTRIES.map(({ code, name, flag }) => (
          <MenuItem value={code} key={code}>
            <div
              style={{
                display: 'flex',
                width: '100%',
              }}
            >
              <img
                src={flag}
                alt={formatMessage({ id: name })}
                style={{
                  width: '1.5rem',
                  marginRight: '0.5rem',
                }}
              />
              {code}
            </div>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
