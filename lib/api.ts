const USE_NEXTJS_API = true // Set to false to use external API

const EXTERNAL_API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "http://m950911v.beget.tech/api" // Ваш домен на Beget
    : "http://localhost/api" // Локальная разработка

const NEXTJS_API_BASE_URL = "/api"

const API_BASE_URL = USE_NEXTJS_API ? NEXTJS_API_BASE_URL : EXTERNAL_API_BASE_URL

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}/${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  // Добавляем токен если есть
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")
    if (token) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  }

  try {
    const response = await fetch(url, defaultOptions)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// API методы
export const api = {
  // Авторизация
  login: (email: string, password: string) =>
    apiRequest("auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (userData: any) =>
    apiRequest("auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Курсы
  getCourses: () => apiRequest("courses/list"),
  getCourse: (id: string) => apiRequest(`courses/detail?id=${id}`),

  // Профиль
  updateProfile: (profileData: any) =>
    apiRequest("profile/update", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  changePassword: (passwordData: any) =>
    apiRequest("profile/change-password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    }),
}
