// contains the environment variables for the application.
export const ENV = {
  PORT: process.env.PORT as string,
  MYSQL_HOST: process.env.MYSQL_HOST as string,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE as string,
  MYSQL_USER: process.env.MYSQL_USER as string,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD as string,
  NODE_ENV: process.env.NODE_ENV as 'development' | 'beta' | 'production',
  SALT_LENGTH: parseInt(process.env.SALT_LENGTH as string),
  SECRET: process.env.SECRET as string,
  MONGODB_URL: process.env.MONGODB_URL as string,
  SMS_AUTH_KEY: process.env.SMS_AUTH_KEY as string,
};
