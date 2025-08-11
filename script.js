document.addEventListener("DOMContentLoaded", function () {
    const apiKeyInput = document.getElementById("apiKeyInput");
    const modelDropdownButton = document.getElementById("modelDropdownButton");
    const modelDropdown = document.getElementById("modelDropdown");
    const responseArea = document.getElementById("responseArea");
    const promptTextarea = document.getElementById("promptTextarea");
    const submitButton = document.getElementById("submitButton");

    let currentModel = null;

    modelDropdown.addEventListener("click", function (event) {
        const selectedModel = event.target.getAttribute("data-model");
        if (selectedModel) {
            currentModel = selectedModel;
            modelDropdownButton.textContent = event.target.textContent;
        }
    });

    submitButton.addEventListener("click", async () => {
        const apiKey = apiKeyInput.value;
        const prompt = promptTextarea.value;

        if (!apiKey) {
            responseArea.textContent = "Por favor, insira sua chave da API.";
            return;
        }

        if (!currentModel) {
            responseArea.textContent = "Por favor, selecione um modelo de IA.";
            return;
        }

        if (!prompt) {
            responseArea.textContent = "Por favor, digite sua pergunta.";
            return;
        }

        responseArea.innerHTML =
            `
            <div class="d-flex justify-content-center align-items-center gap-2">
                <div class="spinner-grow text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-danger" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            `;

        promptTextarea.value = "";

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "contents": [{
                        "parts": [{
                            "text": prompt
                        }]
                    }]
                }),
            });

            if (!response.ok) {
                // Se a resposta da API não for ok, lê o erro e lança uma exceção
                const errorData = await response.json();
                throw new Error(errorData.error.message || "Erro na chamada da API.");
            }

            const data = await response.json();

            // Extrai o texto da resposta
            const text = data.candidates[0].content.parts[0].text;

            responseArea.textContent = text;
        } catch (error) {
            console.error("Erro ao chamar a API do Gemini:", error);
            responseArea.textContent = `Ocorreu um erro ao processar sua solicitação: ${error.message}. Verifique sua chave da API ou tente novamente mais tarde.`;
        }
    });
});