import { createSwaggerSpec } from 'next-swagger-doc';

export const swaggerOptions = {
  apiFolder: 'app/api',
  title: 'PicSel API Docs',
  version: '1.0.0',
  description: 'PicSel Backend API (Next.js + Prisma + MySQL)',
  openapi: '3.0.0',
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PicSel API Docs',
      version: '1.0.0',
      description: 'PicSel Backend API (Next.js + Prisma + MySQL)',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
};

export const swaggerSpec = createSwaggerSpec(swaggerOptions);
