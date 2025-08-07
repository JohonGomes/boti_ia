// Acessar os elementos HTML usando os IDs que você criou
const apiKeyInput = document.getElementById('apiKeyInput');
const modelDropdownButton = document.getElementById('modelDropdownButton');
const modelDropdown = document.getElementById('modelDropdown');
const promptTextarea = document.getElementById('promptTextarea');
const submitButton = document.getElementById('submitButton');
const responseArea = document.getElementById('responseArea');


let selectedModel = "gemini-1.5-pro-latest"; // Define um modelo padrão

// Adicionar um 'listener' à lista do dropdown para capturar a seleção do usuário
modelDropdown.addEventListener('click', (event) => {
    // Verifica se o clique foi em um dos itens do dropdown
    if (event.target.classList.contains('dropdown-item')) {
        // Pega o nome do modelo do atributo `data-model` do HTML
        selectedModel = event.target.getAttribute('data-model');
        // Atualiza o texto do botão com o modelo selecionado
        modelDropdownButton.textContent = event.target.textContent;
    }
});

// Adicionar um 'listener' ao botão de perguntar
submitButton.addEventListener('click', async () => {
    // Obter os valores dos campos
    const apiKey = apiKeyInput.value;
    const prompt = promptTextarea.value;

    // Validar se a API Key e o prompt foram preenchidos
    if (!apiKey) {
        alert("Por favor, insira sua API Key.");
        return;
    }
    if (!prompt) {
        alert("Por favor, digite sua pergunta.");
        return;
    }

    // Exibe uma mensagem de carregamento na tela enquanto a IA responde
    responseArea.textContent = "Pensando na sua resposta...";

    // Chama a função que interage com a API
    await run(apiKey, selectedModel, prompt);
});

// Função para interagir com a API
async function run(apiKey, model, prompt) {
    try {
        // Importar a biblioteca do Google Gemini dinamicamente
        const { GoogleGenerativeAI } = await import('https://unpkg.com/@google/generative-ai');
        const genAI = new GoogleGenerativeAI(apiKey);

        // Pega o modelo selecionado
        const geminiModel = genAI.getGenerativeModel({ model: model });
        
        // Exemplo de como gerar conteúdo
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Exibir a resposta na tela
        responseArea.textContent = text;

    } catch (error) {
        console.error("Erro ao chamar a API:", error);
        responseArea.textContent = "Erro: Não foi possível conectar à API. Verifique sua chave ou tente novamente.";
    }
}