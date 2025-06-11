import api from '../config/api';

const fazerLogin = async (email, senha) => {
    console.log('=== INICIANDO LOGIN ===');
    console.log('Email:', email);
    console.log('URL Base:', api.defaults.baseURL);
    
    try {
        // Teste de conectividade primeiro
        console.log('1. Testando conectividade...');
        const connectivityTest = await fetch('https://httpbin.org/get', { 
            method: 'GET',
            timeout: 5000 
        });
        console.log('✅ Internet OK:', connectivityTest.status);
        
        // Teste do endpoint específico
        console.log('2. Testando endpoint da API...');
        const endpointTest = await fetch(`${api.defaults.baseURL}/health`, {
            method: 'GET',
            timeout: 10000
        });
        console.log('✅ API Endpoint OK:', endpointTest.status);
        
        // Fazer login real
        console.log('3. Fazendo login...');
        const response = await api.post('/auth/login', {
            email: email.trim(),
            senha: senha
        });
        
        console.log('✅ Login bem-sucedido:', {
            status: response.status,
            data: response.data
        });
        
        return response.data;
        
    } catch (error) {
        console.log('=== ERRO NO LOGIN ===');
        console.error('Tipo do erro:', error.constructor.name);
        console.error('Mensagem:', error.message);
        console.error('Código:', error.code);
        
        if (error.response) {
            // Erro da API (4xx, 5xx)
            console.error('Status da resposta:', error.response.status);
            console.error('Dados da resposta:', error.response.data);
            console.error('Headers da resposta:', error.response.headers);
        } else if (error.request) {
            // Requisição foi feita mas não houve resposta
            console.error('Requisição enviada mas sem resposta');
            console.error('Request config:', {
                url: error.request.url || error.config?.url,
                method: error.config?.method,
                timeout: error.config?.timeout,
                headers: error.config?.headers
            });
        } else {
            // Erro na configuração da requisição
            console.error('Erro na configuração:', error.config);
        }
        
        // Stack trace completo
        console.error('Stack trace:', error.stack);
        
        // Retornar erro tratado
        if (error.message === 'Network Error') {
            throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
        } else if (error.code === 'ECONNABORTED') {
            throw new Error('O servidor demorou muito para responder.');
        } else if (error.response?.status === 401) {
            throw new Error('Email ou senha incorretos.');
        } else if (error.response?.status >= 500) {
            throw new Error('Erro interno do servidor. Tente novamente mais tarde.');
        } else {
            throw new Error(error.response?.data?.message || error.message || 'Erro desconhecido');
        }
    }
};

// Função para testar a API manualmente
export const testarAPI = async () => {
    console.log('=== TESTE MANUAL DA API ===');
    
    const tests = [
        {
            name: 'Internet connectivity',
            url: 'https://httpbin.org/get',
            method: 'GET'
        },
        {
            name: 'API Base URL',
            url: api.defaults.baseURL,
            method: 'GET'
        },
        {
            name: 'API Health endpoint',
            url: `${api.defaults.baseURL}/health`,
            method: 'GET'
        },
        {
            name: 'API Login endpoint (OPTIONS)',
            url: `${api.defaults.baseURL}/auth/login`,
            method: 'OPTIONS'
        }
    ];
    
    for (const test of tests) {
        try {
            console.log(`\n🧪 Testando: ${test.name}`);
            console.log(`URL: ${test.url}`);
            
            const startTime = Date.now();
            const response = await fetch(test.url, {
                method: test.method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });
            const endTime = Date.now();
            
            console.log(`✅ ${test.name}: ${response.status} (${endTime - startTime}ms)`);
            
        } catch (error) {
            console.log(`❌ ${test.name}: ${error.message}`);
        }
    }
};

export default fazerLogin; 