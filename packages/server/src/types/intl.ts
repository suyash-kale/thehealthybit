export enum Locale {
  'English' = 'en',
}

export type MessagesType = {
  [L in Locale]: Record<string, string>;
};
