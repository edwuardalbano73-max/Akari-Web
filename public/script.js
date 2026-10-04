const loginButton =
    document.getElementById("loginButton");

const passwordInput =
    document.getElementById("password");

const message =
    document.getElementById("message");

if (loginButton) {

    loginButton.addEventListener(
        "click",
        async () => {

            const password =
                passwordInput.value.trim();

            if (!password) {
                message.textContent =
                    "🌸 Escribe la contraseña.";
                return;
            }

            loginButton.disabled = true;

            try {

                const response =
                    await fetch(
                        "/login",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body:
                                JSON.stringify({
                                    password
                                })
                        }
                    );

                const data =
                    await response.json();

                if (
                    !response.ok ||
                    !data.success
                ) {
                    message.textContent =
                        "❌ Contraseña incorrecta.";
                    return;
                }

                window.location.href =
                    "/panel.html";

            } catch (error) {

                console.error(error);

                message.textContent =
                    "❌ Error conectando con la web.";

            } finally {

                loginButton.disabled =
                    false;
            }
        }
    );
}

// =====================================================
// 🌸 PANEL
// =====================================================

const saveButton =
    document.getElementById(
        "saveButton"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

if (saveButton) {

    loadConfig();

    saveButton.addEventListener(
        "click",
        saveConfig
    );
}

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            await fetch(
                "/logout",
                {
                    method: "POST"
                }
            );

            window.location.href =
                "/";
        }
    );
}

// =====================================================
// 📥 CARGAR
// =====================================================

async function loadConfig() {

    try {

        const response =
            await fetch(
                "/api/config"
            );

        if (
            response.status ===
            401
        ) {
            window.location.href =
                "/";
            return;
        }

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {
            throw new Error(
                data.message
            );
        }

        document.getElementById(
            "guildName"
        ).textContent =
            `Servidor: ${data.guild.name}`;

        const e =
            data.economy;

        document.getElementById(
            "workTime"
        ).value =
            msToText(e.work.time);

        document.getElementById(
            "workMin"
        ).value =
            e.work.min;

        document.getElementById(
            "workMax"
        ).value =
            e.work.max;

        document.getElementById(
            "slutTime"
        ).value =
            msToText(e.slut.time);

        document.getElementById(
            "slutMin"
        ).value =
            e.slut.min;

        document.getElementById(
            "slutMax"
        ).value =
            e.slut.max;

        document.getElementById(
            "slutWin"
        ).value =
            e.slut.winChance;

        document.getElementById(
            "crimeTime"
        ).value =
            msToText(e.crime.time);

        document.getElementById(
            "crimeMin"
        ).value =
            e.crime.min;

        document.getElementById(
            "crimeMax"
        ).value =
            e.crime.max;

        document.getElementById(
            "crimeWin"
        ).value =
            e.crime.winChance;

        document.getElementById(
            "robTime"
        ).value =
            msToText(e.rob.time);

        document.getElementById(
            "robWin"
        ).value =
            e.rob.winChance;

        document.getElementById(
            "dailyAmount"
        ).value =
            e.daily.amount;

        document.getElementById(
            "dailyTime"
        ).value =
            msToText(e.daily.time);

        document.getElementById(
            "bjTime"
        ).value =
            msToText(e.bj.time);

        document.getElementById(
            "bjWin"
        ).value =
            e.bj.winChance;

        document.getElementById(
            "logsChannel"
        ).value =
            data.logs.channel || "";

        document.getElementById(
            "logsEnabled"
        ).checked =
            data.logs.enabled;

        document.getElementById(
            "welcomeChannel"
        ).value =
            data.welcome.channel || "";

        document.getElementById(
            "welcomeEnabled"
        ).checked =
            data.welcome.enabled;

        document.getElementById(
            "welcomeMessage"
        ).value =
            data.welcome.message || "";

        document.getElementById(
            "goodbyeChannel"
        ).value =
            data.goodbye.channel || "";

        document.getElementById(
            "goodbyeEnabled"
        ).checked =
            data.goodbye.enabled;

        document.getElementById(
            "goodbyeMessage"
        ).value =
            data.goodbye.message || "";

        document.getElementById(
            "antiLink"
        ).checked =
            data.security.antiLink;

        document.getElementById(
            "antiSpam"
        ).checked =
            data.security.antiSpam;

        document.getElementById(
            "spamLimit"
        ).value =
            data.security.spamLimit;

        document.getElementById(
            "autoEnabled"
        ).checked =
            data.auto.enabled;

        renderShop(
            data.shop || []
        );

    } catch (error) {

        console.error(error);

        showStatus(
            "❌ " +
            error.message
        );
    }
}

// =====================================================
// 💾 GUARDAR
// =====================================================

async function saveConfig() {

    saveButton.disabled =
        true;

    saveButton.textContent =
        "Guardando...";

    const shop =
        collectShop();

    const config = {

        economy: {

            work: {
                time:
                    document.getElementById(
                        "workTime"
                    ).value,

                min:
                    Number(
                        document.getElementById(
                            "workMin"
                        ).value
                    ),

                max:
                    Number(
                        document.getElementById(
                            "workMax"
                        ).value
                    )
            },

            slut: {
                time:
                    document.getElementById(
                        "slutTime"
                    ).value,

                min:
                    Number(
                        document.getElementById(
                            "slutMin"
                        ).value
                    ),

                max:
                    Number(
                        document.getElementById(
                            "slutMax"
                        ).value
                    ),

                winChance:
                    Number(
                        document.getElementById(
                            "slutWin"
                        ).value
                    )
            },

            crime: {
                time:
                    document.getElementById(
                        "crimeTime"
                    ).value,

                min:
                    Number(
                        document.getElementById(
                            "crimeMin"
                        ).value
                    ),

                max:
                    Number(
                        document.getElementById(
                            "crimeMax"
                        ).value
                    ),

                winChance:
                    Number(
                        document.getElementById(
                            "crimeWin"
                        ).value
                    )
            },

            rob: {
                time:
                    document.getElementById(
                        "robTime"
                    ).value,

                winChance:
                    Number(
                        document.getElementById(
                            "robWin"
                        ).value
                    )
            },

            daily: {
                amount:
                    Number(
                        document.getElementById(
                            "dailyAmount"
                        ).value
                    ),

                time:
                    document.getElementById(
                        "dailyTime"
                    ).value
            },

            bj: {
                time:
                    document.getElementById(
                        "bjTime"
                    ).value,

                winChance:
                    Number(
                        document.getElementById(
                            "bjWin"
                        ).value
                    )
            }
        },

        logs: {
            enabled:
                document.getElementById(
                    "logsEnabled"
                ).checked,

            channel:
                document.getElementById(
                    "logsChannel"
                ).value
        },

        welcome: {
            enabled:
                document.getElementById(
                    "welcomeEnabled"
                ).checked,

            channel:
                document.getElementById(
                    "welcomeChannel"
                ).value,

            message:
                document.getElementById(
                    "welcomeMessage"
                ).value
        },

        goodbye: {
            enabled:
                document.getElementById(
                    "goodbyeEnabled"
                ).checked,

            channel:
                document.getElementById(
                    "goodbyeChannel"
                ).value,

            message:
                document.getElementById(
                    "goodbyeMessage"
                ).value
        },

        security: {
            antiLink:
                document.getElementById(
                    "antiLink"
                ).checked,

            antiSpam:
                document.getElementById(
                    "antiSpam"
                ).checked,

            spamLimit:
                Number(
                    document.getElementById(
                        "spamLimit"
                    ).value
                )
        },

        auto: {
            enabled:
                document.getElementById(
                    "autoEnabled"
                ).checked
        },

        shop
    };

    try {

        const response =
            await fetch(
                "/api/config",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            config
                        )
                }
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {
            throw new Error(
                data.message ||
                "No se pudo guardar."
            );
        }

        showStatus(
            "✅ Configuración guardada correctamente."
        );

    } catch (error) {

        console.error(error);

        showStatus(
            "❌ " +
            error.message
        );

    } finally {

        saveButton.disabled =
            false;

        saveButton.textContent =
            "💾 Guardar todos los cambios";
    }
}

// =====================================================
// 🛒 SHOP
// =====================================================

let currentShop = [];

function renderShop(shop) {

    currentShop =
        Array.isArray(shop)
            ? shop
            : [];

    const container =
        document.getElementById(
            "shopList"
        );

    container.innerHTML = "";

    currentShop.forEach(
        (item, index) => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "shop-item";

            div.innerHTML = `
                <strong>${escapeHtml(item.name)}</strong>
                <br>
                💰 ${item.price}
                <br>
                ${escapeHtml(item.description || "")}
                <br>
                <button onclick="removeShop(${index})">
                    🗑️ Eliminar
                </button>
            `;

            container.appendChild(div);
        }
    );
}

function collectShop() {
    return currentShop;
}

document.getElementById(
    "addShop"
)?.addEventListener(
    "click",
    () => {

        const name =
            document.getElementById(
                "shopName"
            ).value.trim();

        const price =
            Number(
                document.getElementById(
                    "shopPrice"
                ).value
            );

        const description =
            document.getElementById(
                "shopDescription"
            ).value.trim();

        if (!name) {
            showStatus(
                "❌ Escribe un nombre."
            );
            return;
        }

        if (
            !Number.isFinite(price) ||
            price < 0
        ) {
            showStatus(
                "❌ Precio inválido."
            );
            return;
        }

        currentShop.push({
            name,
            price,
            description
        });

        renderShop(
            currentShop
        );

        document.getElementById(
            "shopName"
        ).value = "";

        document.getElementById(
            "shopPrice"
        ).value = "";

        document.getElementById(
            "shopDescription"
        ).value = "";
    }
);

function removeShop(index) {

    currentShop.splice(
        index,
        1
    );

    renderShop(
        currentShop
    );
}

// =====================================================
// 🛠️ UTILIDADES
// =====================================================

function msToText(ms) {

    if (
        ms %
        (24 * 60 * 60 * 1000) ===
        0
    ) {
        return (
            ms /
            (24 * 60 * 60 * 1000)
        ) + "d";
    }

    if (
        ms %
        (60 * 60 * 1000) ===
        0
    ) {
        return (
            ms /
            (60 * 60 * 1000)
        ) + "h";
    }

    if (
        ms %
        (60 * 1000) ===
        0
    ) {
        return (
            ms /
            (60 * 1000)
        ) + "m";
    }

    return (
        ms / 1000
    ) + "s";
}

function showStatus(text) {

    const status =
        document.getElementById(
            "statusMessage"
        );

    if (!status) return;

    status.textContent =
        text;
}

function escapeHtml(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}
