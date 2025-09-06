// Arquivo de configuração para variáveis globais
const getEnvironmentVariable = (key, defaultValue) => {
  if (import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  return defaultValue;
};

// Usando import.meta.env para compatibilidade com Vite
export const API_BASE_URL = getEnvironmentVariable(
  "VITE_API_URL",
  "http://localhost:3000/api"
);

export const ASSETS_BASE_URL = getEnvironmentVariable(
  "VITE_ASSETS_URL",
  "http://localhost:3000"
);
