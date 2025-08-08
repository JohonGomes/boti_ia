import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

document.addEventListener("DOMContentLoaded", function () {
    const apiKeyInput = document.getElementById("apiKeyInput");
    const modelDropdownButton = document.getElementById("modelDropdownButton");
    const modelDropdown = document.getElementById("modelDropdown");
    const responseArea = document.getElementById("responseArea");
    const promptTextarea = document.getElementById("promptTextarea");
    const submitButton = document.getElementById("submitButton");

    // let currentModel = "gemini-1.5-flash-latest";
    let currentModel = null; // Modelo padrão

    // Adiciona o listener para os modelos no dropdown
    modelDropdown.addEventListener("click", function (event) {
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

        // Nova validação para o modelo
        if (!currentModel) {
            responseArea.textContent = "Por favor, selecione um modelo de IA.";
            return;
        }

        // Validação da pergunta
        if (!prompt) {
            responseArea.textContent = "Por favor, digite sua pergunta.";
            return;
        }

        responseArea.innerHTML = 
        `
        <div class="spinner-grow text-success" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-danger" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-warning" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>

        ` 
        ;

        promptTextarea.value = "";

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