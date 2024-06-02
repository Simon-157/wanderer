import "dotenv/config";

export const corsMiddleware = {
  origin:
    process.env.NODE_ENV == "production"
      ? process.env.CLIENT_URI_PROD
      : process.env.CLIENT_URI,
  credentials: true,
    
};