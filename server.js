const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const WEB_PASSWORD =
    process.env.WEB_PASSWORD || "queso123";

const BOT_API_URL =
    process.env.BOT_API_URL;

const BOT_API_KEY =
    process.env.BOT_API_KEY;

app.use(express.json());
app.use(express.static("public"));

// =====================================================
// 🔐 LOGIN
// =====================================================

app.post("/login", (req, res) => {

    const { password } = req.body;

    if (password !== WEB_PASSWORD) {
        return res.status(401).json({
            success: false,
            message: "Contraseña incorrecta."
        });
    }

    res.json({
        success: true
    });
});

// =====================================================
// 🌸 FUNCIÓN PARA LLAMAR A AKARI BOT
// =====================================================

async function botRequest(endpoint, options = {}) {

    if (!BOT_API_URL) {
        throw new Error(
            "BOT_API_URL no está configurada."
        );
    }

    if (!BOT_API_KEY) {
        throw new Error(
            "BOT_API_KEY no está configurada."
        );
    }

    const url =
        `${BOT_API_URL.replace(/\/$/, "")}${endpoint}`;

    const response = await fetch(url, {
        ...options,

        headers: {
            ...(options.headers || {}),
            "Authorization":
                `Bearer ${BOT_API_KEY}`,
            "Content-Type":
                "application/json"
        }
    });

    const text =
        await response.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        console.error(
            "❌ Akari Bot devolvió algo que NO es JSON:"
        );

        console.error(
            "Status:",
            response.status
        );

        console.error(
            "Respuesta:",
            text.substring(0, 500)
        );

        throw new Error(
            `Akari Bot respondió con HTTP ${response.status} en ${endpoint}.`
        );
    }

    return {
        status: response.status,
        data
    };
}

// =====================================================
// 📥 OBTENER CONFIGURACIÓN
// =====================================================

app.get("/api/config", async (req, res) => {

    try {

        const result =
            await botRequest("/api/config", {
                method: "GET"
            });

        res.status(
            result.status
        ).json(
            result.data
        );

    } catch (error) {

        console.error(
            "❌ Error obteniendo configuración:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                error.message ||
                "No se pudo conectar con Akari Bot."
        });
    }
});

// =====================================================
// 📤 GUARDAR CONFIGURACIÓN
// =====================================================

app.post("/api/config", async (req, res) => {

    try {

        const result =
            await botRequest("/api/config", {
                method: "POST",

                body: JSON.stringify(
                    req.body
                )
            });

        res.status(
            result.status
        ).json(
            result.data
        );

    } catch (error) {

        console.error(
            "❌ Error guardando configuración:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                error.message ||
                "No se pudo conectar con Akari Bot."
        });
    }
});

// =====================================================
// 🌐 PÁGINA PRINCIPAL
// =====================================================

app.get("/", (req, res) => {

    res.sendFile(
        __dirname +
        "/public/index.html"
    );
});

// =====================================================
// 🚀 SERVIDOR
// =====================================================

app.listen(PORT, () => {

    console.log(
        `🌸 Akari Web funcionando en el puerto ${PORT}`
    );

});
