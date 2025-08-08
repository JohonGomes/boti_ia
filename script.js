import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.getElementById("submitButton");
    const apiKeyInput = document.getElementById("apiKeyInput");
    const promptTextarea = document.getElementById("promptTextarea");
    const responseArea = document.getElementById("responseArea");
    const modelDropdown = document.getElementById("modelDropdown");
    const modelDropdownButton = document.getElementById("modelDropdownButton");

    let currentModel = "gemini-1.5-pro-latest"; // Modelo padrão

    // Adiciona o listener para os modelos no dropdown
    modelDropdown.addEventListener("click", function(event) {
        const selectedModel = event.target.getAttribute("data-model");
        if (selectedModel) {
            currentModel = selectedModel;
            modelDropdownButton.textContent = event.target.textContent; // Atualiza o texto do botão
        }
    });

    submitButton.addEventListener("click", async () => {
        const apiKey = apiKeyInput.value;
        const prompt = promptTextarea.value;

        // Validação básica para a chave da API e o prompt
        if (!apiKey) {
            responseArea.textContent = "Por favor, insira sua chave da API.";
            return;
        }

        if (!prompt) {
            responseArea.textContent = "Por favor, digite sua pergunta.";
            return;
        }

        responseArea.textContent = "Carregando...";
        
        try {
            // Inicializa a API com a chave fornecida
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: currentModel });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            responseArea.textContent = text;
        } catch (error) {
            console.error("Erro ao chamar a API do Gemini:", error);
            responseArea.textContent = "Ocorreu um erro ao processar sua solicitação. Verifique sua chave da API ou tente novamente mais tarde.";
        }
    });
});