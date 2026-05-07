/**
 * Environment variables configuration and validation strategy.
 * 
 * This file acts as a central hub for all environment variables,
 * ensuring separation between public (client-side) and private (server-side) variables.
 * It also defines the API base URL strategy.
 */

// 1. PUBLIC VARIABLES (Accessible in both Client and Server Components)
// Must be prefixed with NEXT_PUBLIC_
export const publicEnv = {
  // Base URL for the external API backend
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  
  // Base URL for the Frontend Application itself
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
  
  // Application mode environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  get isProduction() {
    return this.NODE_ENV === 'production';
  },
  
  get isDevelopment() {
    return this.NODE_ENV === 'development';
  },
};

// 2. PRIVATE VARIABLES (Accessible ONLY in Server Components / API Routes)
// Accessing these in client-side components will result in undefined or build errors
export const privateEnv = {
  // Add server-only secrets here (e.g., SECRET_KEY, DATABASE_URL, etc.)
  // SECRET_KEY: process.env.SECRET_KEY,
};

// 3. API URL Helper Strategy
// Helper to easily get the full URL for an API endpoint
export const getApiUrl = (endpoint: string) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Ensure the base URL does not have a trailing slash
  const baseUrl = publicEnv.API_URL.endsWith('/') 
    ? publicEnv.API_URL.slice(0, -1) 
    : publicEnv.API_URL;
    
  return `${baseUrl}/${cleanEndpoint}`;
};
