document.addEventListener("DOMContentLoaded", function () {
    const apiKeyInput = document.getElementById("apiKeyInput");
    const modelDropdownButton = document.getElementById("modelDropdownButton");
    const modelDropdown = document.getElementById("modelDropdown");
    const responseArea = document.getElementById("responseArea");
    const promptTextarea = document.getElementById("promptTextarea");
    const submitButton = document.getElementById("submitButton");

    let currentModel = null;

    // Inicializar o conteúdo da área de resposta, caso seja nulo ou vazio
    if (!responseArea.innerHTML.trim()) {
        responseArea.innerHTML = `<div class="p-3"><p class="fw-bold text-warning fs-4 text-justify">Bem-vindos ao Boti IA!</p></div>`;
    }


    modelDropdown.addEventListener("click", function (event) {
        const selectedModel = event.target.getAttribute("data-model");
        if (selectedModel) {
            currentModel = selectedModel;
            modelDropdownButton.textContent = event.target.textContent;
        }
    });

    // Adicionado: Evento para enviar a mensagem ao pressionar "Enter"
    promptTextarea.addEventListener("keydown", function (event) {
        // Verifica se a tecla pressionada é "Enter" e se a tecla "Shift" não está pressionada
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Impede a quebra de linha padrão
            submitButton.click(); // Dispara o evento de clique do botão de enviar
        }
    });

    submitButton.addEventListener("click", async () => {
        const apiKey = apiKeyInput.value;
        const prompt = promptTextarea.value;

        // 1. Validar se os campos estão preenchidos
        if (!apiKey || !currentModel || !prompt) {
            let errorMessage = "";
            if (!apiKey) errorMessage = "Por favor, insira sua chave da API.";
            else if (!currentModel) errorMessage = "Por favor, escolha o modelo de IA.";
            else if (!prompt) errorMessage = "Por favor, digite sua pergunta.";

            // Adicionar uma mensagem de erro temporária ao histórico
            adicionarMensagem("error", errorMessage);
            return;
        }

        // 2. Adicionar a pergunta do usuário ao histórico de chat
        adicionarMensagem("user", prompt);

        // 3. Adicionar o spinner de carregamento
        const spinner = adicionarMensagem("ia-loading", "");

        // Limpar a caixa de texto
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

            // 4. Remover o spinner e adicionar a resposta da IA
            responseArea.removeChild(spinner);
            adicionarMensagem("ia", text);

        } catch (error) {
            console.error("Erro ao chamar a API do Gemini:", error);
            // 5. Remover o spinner em caso de erro e mostrar a mensagem de erro
            responseArea.removeChild(spinner);
            adicionarMensagem("error", `Ocorreu um erro: ${error.message}.`);
        }
    });

    // Função auxiliar para adicionar mensagens ao histórico
    function adicionarMensagem(tipo, conteudo) {
        const mensagemDiv = document.createElement("div");
        mensagemDiv.classList.add("chat-bubble");

        if (tipo === "user") {
            mensagemDiv.classList.add("user-bubble");
            // Adicionar a pergunta do utilizador
            mensagemDiv.innerHTML = `<p>${conteudo}</p>`;
        } else if (tipo === "ia") {
            mensagemDiv.classList.add("ia-bubble");
            // Formatar a resposta da IA para parágrafos
            const formattedText = conteudo.split('\n').map(p => `<p>${p}</p>`).join('');
            mensagemDiv.innerHTML = formattedText;
        } else if (tipo === "ia-loading") {
            mensagemDiv.classList.add("ia-bubble");
            mensagemDiv.innerHTML = `
                <div class="d-flex justify-content-start align-items-center gap-2">
                    <div class="spinner-grow text-success" role="status"></div>
                    <div class="spinner-grow text-danger" role="status"></div>
                    <div class="spinner-grow text-warning" role="status"></div>
                </div>
            `;
        } else if (tipo === "error") {
            mensagemDiv.classList.add("ia-bubble", "text-danger");
            mensagemDiv.innerHTML = `<p>${conteudo}</p>`;
        }

        responseArea.appendChild(mensagemDiv);

        // Garantir que a área de chat "scrolla" para baixo
        responseArea.scrollTop = responseArea.scrollHeight;

        return mensagemDiv;
    }
});
