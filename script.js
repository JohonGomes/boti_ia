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
            responseArea.innerHTML =
                `
                <div class="d-flex align-items-center gap-2">
                    <i class="fa-solid fa-triangle-exclamation text-danger fs-4"></i>
                    <span>Por favor, insira sua chave da API.</span>
                </div>
            `;
            return;
        }

        if (!currentModel) {
            responseArea.innerHTML =
                `
            <div class="d-flex align-items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation text-danger fs-4"></i>
                <span>Por favor, escolha o modelo de IA.</span>
            </div>

            `;
            return;
        }

        if (!prompt) {
            responseArea.innerHTML =
                `
                    <div class="d-flex align-items-center gap-2">
                        <i class="fa-solid fa-triangle-exclamation text-danger fs-4"></i>
                        <span>Por favor, digite sua pergunta.</span>
                    </div>
                `;
            ;
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
                const errorData = await response.json();
                throw new Error(errorData.error.message || "Erro na chamada da API.");
            }

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;

            // Formatação do texto: substitui quebras de linha por parágrafos
            const formattedText = text.split('\n').map(p => `<p>${p}</p>`).join('');

            // Insere o HTML formatado na área de resposta
            responseArea.innerHTML = formattedText;

        } catch (error) {
            console.error("Erro ao chamar a API do Gemini:", error);
            responseArea.textContent = `Ocorreu um erro ao processar sua solicitação: ${error.message}. Verifique sua chave da API ou tente novamente mais tarde.`;
        }
    });
});