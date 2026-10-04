const express = require("express");
const crypto = require("crypto");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const WEB_PASSWORD = process.env.WEB_PASSWORD || "queso123";
const BOT_API_URL = process.env.BOT_API_URL;
const BOT_API_KEY = process.env.BOT_API_KEY;

const sessions = new Map();

const publicPath = path.join(__dirname, "public");

app.use(express.json());


// ===============================
// ARCHIVOS DE LA WEB
// ===============================

app.get("/", (req, res) => {
    res.type("html");
    res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/style.css", (req, res) => {
    res.type("css");
    res.sendFile(path.join(publicPath, "style.css"));
});

app.get("/script.js", (req, res) => {
    res.type("js");
    res.sendFile(path.join(publicPath, "script.js"));
});

app.get("/panel.html", (req, res) => {
    res.type("html");
    res.sendFile(path.join(publicPath, "panel.html"));
});


// ===============================
// COOKIES
// ===============================

function getCookie(req, name) {
    const cookies = req.headers.cookie || "";

    for (const part of cookies.split(";")) {
        const [key, ...rest] = part.trim().split("=");

        if (key === name) {
            return decodeURIComponent(rest.join("="));
        }
    }

    return null;
}


// ===============================
// SESIÓN
// ===============================

function requireSession(req, res, next) {
    const token = getCookie(req, "akari_session");

    if (!token || !sessions.has(token)) {
        return res.status(401).json({
            success: false,
            message: "Sesión no válida."
        });
    }

    next();
}


// ===============================
// LOGIN
// ===============================

app.post("/login", (req, res) => {
    const password = req.body?.password;

    if (password !== WEB_PASSWORD) {
        return res.status(401).json({
            success: false,
            message: "Contraseña incorrecta."
        });
    }

    const token = crypto
        .randomBytes(32)
        .toString("hex");

    sessions.set(token, Date.now());

    res.setHeader(
        "Set-Cookie",
        `akari_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
    );

    res.json({
        success: true
    });
});


// ===============================
// LOGOUT
// ===============================

app.post("/logout", requireSession, (req, res) => {
    const token = getCookie(req, "akari_session");

    if (token) {
        sessions.delete(token);
    }

    res.setHeader(
        "Set-Cookie",
        "akari_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0"
    );

    res.json({
        success: true
    });
});


// ===============================
// PETICIONES AL BOT
// ===============================

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
        BOT_API_URL.replace(/\/$/, "") + endpoint;

    const response = await fetch(url, {
        ...options,

        headers: {
            ...(options.headers || {}),

            Authorization:
                `Bearer ${BOT_API_KEY}`,

            "Content-Type":
                "application/json"
        }
    });

    const text = await response.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        throw new Error(
            `Akari Bot respondió con HTTP ${response.status}.`
        );
    }

    return {
        status: response.status,
        data
    };
}


// ===============================
// OBTENER CONFIGURACIÓN
// ===============================

app.get(
    "/api/config",
    requireSession,
    async (req, res) => {

        try {
            const result =
                await botRequest(
                    "/api/config",
                    {
                        method: "GET"
                    }
                );

            res
                .status(result.status)
                .json(result.data);

        } catch (error) {

            console.error(
                "Error obteniendo configuración:",
                error
            );

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);


// ===============================
// GUARDAR CONFIGURACIÓN
// ===============================

app.post(
    "/api/config",
    requireSession,
    async (req, res) => {

        try {
            const result =
                await botRequest(
                    "/api/config",
                    {
                        method: "POST",

                        body:
                            JSON.stringify(
                                req.body
                            )
                    }
                );

            res
                .status(result.status)
                .json(result.data);

        } catch (error) {

            console.error(
                "Error guardando configuración:",
                error
            );

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);


// ===============================
// INICIAR SERVIDOR
// ===============================

app.listen(PORT, () => {
    console.log(
        `🌸 Akari Web funcionando en el puerto ${PORT}`
    );
});
