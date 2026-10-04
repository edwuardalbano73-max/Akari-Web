document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // LOGIN
    // ==============================

    const loginButton = document.getElementById("loginButton");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("message");

    if (loginButton && passwordInput) {

        async function login() {

            const password = passwordInput.value.trim();

            if (!password) {
                if (message) {
                    message.textContent = "🔐 Introduce la contraseña.";
                }
                return;
            }

            loginButton.disabled = true;
            loginButton.textContent = "Entrando... 🌸";

            if (message) {
                message.textContent = "";
            }

            try {

                const response = await fetch("/login", {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        password: password
                    })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {

                    throw new Error(
                        data.message || "Contraseña incorrecta."
                    );
                }

                /*
                 * IMPORTANTE:
                 * El panel correcto es /panel.html.
                 *
                 * NO redirigimos a style.css.
                 */

                window.location.assign("/panel.html");

            } catch (error) {

                console.error("Error de login:", error);

                if (message) {
                    message.textContent =
                        "❌ " + error.message;
                }

                loginButton.disabled = false;
                loginButton.textContent =
                    "Entrar al panel 🌸";
            }
        }

        loginButton.addEventListener("click", login);

        passwordInput.addEventListener("keydown", (event) => {

            if (event.key === "Enter") {
                login();
            }

        });
    }


    // ==============================
    // LOGOUT
    // ==============================

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener("click", async () => {

            try {

                await fetch("/logout", {
                    method: "POST"
                });

            } catch (error) {

                console.error(
                    "Error cerrando sesión:",
                    error
                );

            } finally {

                window.location.assign("/");
            }

        });
    }


    // ==============================
    // ELEMENTOS DEL PANEL
    // ==============================

    const saveButton =
        document.getElementById("saveButton");

    const configMessage =
        document.getElementById("configMessage");


    // ==============================
    // CARGAR CONFIGURACIÓN
    // ==============================

    async function loadConfig() {

        try {

            const response =
                await fetch("/api/config");

            if (response.status === 401) {

                window.location.assign("/");
                return;
            }

            const data =
                await response.json();

            if (!data.success) {

                throw new Error(
                    data.message ||
                    "No se pudo cargar la configuración."
                );
            }

            fillConfig(data.config || data);

        } catch (error) {

            console.error(
                "Error cargando configuración:",
                error
            );

            if (configMessage) {

                configMessage.textContent =
                    "❌ " + error.message;
            }
        }
    }


    // ==============================
    // RELLENAR CAMPOS
    // ==============================

    function fillConfig(config) {

        if (!config || typeof config !== "object") {
            return;
        }

        /*
         * Busca automáticamente inputs que tengan
         * data-config="ruta".
         *
         * Ejemplo:
         *
         * <input data-config="welcome.message">
         *
         */

        const fields =
            document.querySelectorAll(
                "[data-config]"
            );

        fields.forEach((field) => {

            const path =
                field.dataset.config;

            const value =
                getValue(config, path);

            if (value === undefined) {
                return;
            }

            if (field.type === "checkbox") {

                field.checked =
                    Boolean(value);

            } else {

                field.value =
                    value ?? "";
            }

        });
    }


    // ==============================
    // OBTENER VALOR
    // ==============================

    function getValue(object, path) {

        return path
            .split(".")
            .reduce((current, key) => {

                if (
                    current === null ||
                    current === undefined
                ) {
                    return undefined;
                }

                return current[key];

            }, object);
    }


    // ==============================
    // CREAR CONFIGURACIÓN
    // ==============================

    function setValue(object, path, value) {

        const keys =
            path.split(".");

        let current = object;

        for (
            let i = 0;
            i < keys.length - 1;
            i++
        ) {

            const key = keys[i];

            if (
                !current[key] ||
                typeof current[key] !== "object"
            ) {

                current[key] = {};
            }

            current =
                current[key];
        }

        current[
            keys[keys.length - 1]
        ] = value;
    }


    // ==============================
    // GUARDAR CONFIGURACIÓN
    // ==============================

    if (saveButton) {

        saveButton.addEventListener(
            "click",
            async () => {

                saveButton.disabled = true;
                saveButton.textContent =
                    "Guardando... 🌸";

                try {

                    const config = {};

                    const fields =
                        document.querySelectorAll(
                            "[data-config]"
                        );

                    fields.forEach((field) => {

                        const path =
                            field.dataset.config;

                        let value;

                        if (
                            field.type ===
                            "checkbox"
                        ) {

                            value =
                                field.checked;

                        } else {

                            value =
                                field.value;
                        }

                        setValue(
                            config,
                            path,
                            value
                        );
                    });


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


                    if (
                        response.status ===
                        401
                    ) {

                        window.location.assign(
                            "/"
                        );

                        return;
                    }


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


                    if (configMessage) {

                        configMessage.textContent =
                            "✅ Configuración guardada correctamente.";
                    }

                } catch (error) {

                    console.error(
                        "Error guardando:",
                        error
                    );

                    if (configMessage) {

                        configMessage.textContent =
                            "❌ " +
                            error.message;
                    }

                } finally {

                    saveButton.disabled =
                        false;

                    saveButton.textContent =
                        "Guardar cambios 🌸";
                }

            }
        );
    }


    // ==============================
    // CARGAR PANEL
    // ==============================

    if (
        window.location.pathname ===
        "/panel.html"
    ) {

        loadConfig();
    }

});
