/** @type {import('next').NextConfig} */
const nextConfig = {
  // Для статического экспорта на Beget
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Отключаем оптимизацию изображений для статического экспорта
  images: {
    unoptimized: true
  },
  
  // Игнорируем ошибки при сборке
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Базовый путь для Beget
  basePath: '',
  
  // Переменные окружения для продакшена
  env: {
    API_BASE_URL: 'http://m950911v.beget.tech/api',
    NEXT_PUBLIC_SITE_URL: 'http://m950911v.beget.tech',
  }
}

export default nextConfig
