const ENV = {
    dev: {
        API_URL: 'https://backend-pi-26cz.onrender.com',
        TIMEOUT: 30000,
    },
    prod: {
        API_URL: 'https://backend-pi-26cz.onrender.com',
        TIMEOUT: 30000,
    }
};

const getEnvVars = () => {
    // Aqui você pode adicionar lógica para determinar o ambiente
    // Por enquanto, vamos usar o ambiente de desenvolvimento
    return ENV.dev;
};

export default getEnvVars(); 