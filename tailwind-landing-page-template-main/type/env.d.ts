declare namespace NodeJS {
    interface ProcessEnv {
      // Strapi
      NEXT_PUBLIC_STRAPI_URL: string;
      STRAPI_API_TOKEN: string;
      
      // SMTP
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_USER: string;
      SMTP_PASSWORD: string;
      CONTACT_RECEIVER_EMAIL: string;
    }
  }