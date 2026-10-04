const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const WEB_PASSWORD = process.env.WEB_PASSWORD || "queso123";
const BOT_API_URL = process.env.BOT_API_URL;
const BOT_API_KEY = process.env.BOT_API_KEY;

app.use(express.json());
app.use(express.static("public"));

/* =========================
   LOGIN
========================= */

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

/* =========================
   OBTENER CONFIGURACIÓN
========================= */

app.get("/api/config", async (req, res) => {
  try {
    if (!BOT_API_URL || !BOT_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "La API del bot no está configurada en Render."
      });
    }

    const response = await fetch(`${BOT_API_URL}/api/config`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${BOT_API_KEY}`
      }
    });

    const data = await response.json();

    res.status(response.status).json(data);

  } catch (error) {
    console.error("Error obteniendo configuración:", error);

    res.status(500).json({
      success: false,
      message: "No se pudo conectar con Akari Bot."
    });
  }
});

/* =========================
   GUARDAR CONFIGURACIÓN
========================= */

app.post("/api/config", async (req, res) => {
  try {
    if (!BOT_API_URL || !BOT_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "La API del bot no está configurada en Render."
      });
    }

    const response = await fetch(`${BOT_API_URL}/api/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BOT_API_KEY}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    res.status(response.status).json(data);

  } catch (error) {
    console.error("Error guardando configuración:", error);

    res.status(500).json({
      success: false,
      message: "No se pudo conectar con Akari Bot."
    });
  }
});

/* =========================
   RUTA PRINCIPAL
========================= */

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

/* =========================
   SERVIDOR
========================= */

app.listen(PORT, () => {
  console.log(`🌸 Akari Web funcionando en el puerto ${PORT}`);
});
