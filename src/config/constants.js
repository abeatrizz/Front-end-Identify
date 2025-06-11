export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        FORGOT_PASSWORD: '/auth/recuperar-senha',
        RESET_PASSWORD: '/auth/reset-password',
        CHANGE_PASSWORD: '/auth/alterar-senha',
        CHANGE_EMAIL: '/auth/alterar-email',
        UPDATE_PROFILE_PHOTO: '/auth/foto-perfil'
    },
    USER: {
        PROFILE: '/user/profile',
        UPDATE: '/user/update'
    }
};

export const STORAGE_KEYS = {
    AUTH_TOKEN: '@auth_token',
    USER_DATA: '@user_data'
};

export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
    TIMEOUT: 'O servidor demorou muito para responder.',
    INVALID_CREDENTIALS: 'Email ou senha incorretos.',
    SERVER_ERROR: 'Erro interno do servidor. Tente novamente mais tarde.',
    UNKNOWN_ERROR: 'Ocorreu um erro inesperado. Tente novamente.'
}; 