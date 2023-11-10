// encrypting string to base64.
export const stringToBase64 = (data?: string) =>
  data ? btoa(data) : '';
