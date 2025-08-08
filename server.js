import express from "express";
import ClientGemini from "./client.js";

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    try {
        const response = await ClientGemini("Quem é você? Qual a sua utilidade?");
        res.send(`
            <html>
                <head>
                    <title>Resposta do Gemini</title>
                </head>

                <body>
                    <h1> Resposta do Gemini</h1>
                    <p>${response}</p>
                </body>
            </html>
        `)
    } catch (erro) {
        // Exibe o erro no console para fins de depuração
        console.error('Ocorreu um erro ao processar a requisição:', erro);
        // Envia uma resposta de erro HTTP 500 para o cliente
        res.status(500).send("Ocorreu um erro ao obter a resposta do Gemini.");
    }
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
})