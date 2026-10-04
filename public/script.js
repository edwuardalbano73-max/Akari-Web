const loginButton = document.getElementById("loginButton");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

if (loginButton) {
  loginButton.addEventListener("click", async () => {
    const password = passwordInput.value.trim();

    if (!password) {
      message.textContent = "🌸 Escribe la contraseña.";
      return;
    }

    loginButton.disabled = true;
    loginButton.textContent = "Entrando...";

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        message.textContent = "❌ Contraseña incorrecta.";
        return;
      }

      sessionStorage.setItem("akariLogged", "true");

      window.location.href = "/panel.html";

    } catch (error) {
      console.error(error);
      message.textContent = "❌ No se pudo conectar con la web.";
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "Entrar al panel 🌸";
    }
  });
}

/* =========================
   PANEL
========================= */

const saveButton = document.getElementById("saveButton");
const logoutButton = document.getElementById("logoutButton");

if (saveButton) {

  if (sessionStorage.getItem("akariLogged") !== "true") {
    window.location.href = "/";
  }

  loadConfig();

  saveButton.addEventListener("click", saveConfig);
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("akariLogged");
    window.location.href = "/";
  });
}

/* =========================
   CARGAR CONFIGURACIÓN
========================= */

async function loadConfig() {

  try {

    const response = await fetch("/api/config");

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Error cargando configuración");
    }

    const economy = data.economy;

    document.getElementById("workTime").value =
      economy.work.time;

    document.getElementById("workMin").value =
      economy.work.min;

    document.getElementById("workMax").value =
      economy.work.max;

    document.getElementById("slutTime").value =
      economy.slut.time;

    document.getElementById("slutMin").value =
      economy.slut.min;

    document.getElementById("slutMax").value =
      economy.slut.max;

    document.getElementById("slutWinChance").value =
      economy.slut.winChance;

    document.getElementById("crimeTime").value =
      economy.crime.time;

    document.getElementById("crimeMin").value =
      economy.crime.min;

    document.getElementById("crimeMax").value =
      economy.crime.max;

    document.getElementById("crimeWinChance").value =
      economy.crime.winChance;

    document.getElementById("robTime").value =
      economy.rob.time;

    document.getElementById("robWinChance").value =
      economy.rob.winChance;

  } catch (error) {

    console.error(error);

    const status = document.getElementById("statusMessage");

    if (status) {
      status.textContent =
        "❌ No se pudo cargar la configuración del bot.";
    }
  }
}

/* =========================
   GUARDAR CONFIGURACIÓN
========================= */

async function saveConfig() {

  const status = document.getElementById("statusMessage");

  saveButton.disabled = true;
  saveButton.textContent = "Guardando...";

  const config = {

    economy: {

      work: {
        time: document.getElementById("workTime").value,
        min: Number(document.getElementById("workMin").value),
        max: Number(document.getElementById("workMax").value)
      },

      slut: {
        time: document.getElementById("slutTime").value,
        min: Number(document.getElementById("slutMin").value),
        max: Number(document.getElementById("slutMax").value),
        winChance: Number(
          document.getElementById("slutWinChance").value
        )
      },

      crime: {
        time: document.getElementById("crimeTime").value,
        min: Number(document.getElementById("crimeMin").value),
        max: Number(document.getElementById("crimeMax").value),
        winChance: Number(
          document.getElementById("crimeWinChance").value
        )
      },

      rob: {
        time: document.getElementById("robTime").value,
        winChance: Number(
          document.getElementById("robWinChance").value
        )
      }

    }

  };

  try {

    const response = await fetch("/api/config", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(config)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "No se pudieron guardar los cambios."
      );
    }

    status.textContent =
      "✅ Configuración guardada correctamente.";

  } catch (error) {

    console.error(error);

    status.textContent =
      "❌ No se pudieron guardar los cambios.";

  } finally {

    saveButton.disabled = false;
    saveButton.textContent = "💾 Guardar cambios";

  }
}
