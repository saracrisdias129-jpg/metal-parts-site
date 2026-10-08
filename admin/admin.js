document.addEventListener("DOMContentLoaded", function () {

    const formularioLogin = document.getElementById("formLogin");
    const campoEmail = document.getElementById("email");
    const campoSenha = document.getElementById("senha");
    const mostrarSenha = document.getElementById("mostrarSenha");
    const botaoLogin = document.getElementById("botaoLogin");
    const botaoEsqueciSenha = document.getElementById("botaoEsqueciSenha");
    const mensagemLogin = document.getElementById("mensagemLogin");

    function mostrarMensagem(texto, sucesso = false) {

        if (!mensagemLogin) {
            return;
        }

        mensagemLogin.textContent = texto;
        mensagemLogin.className = "mensagem-login";

        if (sucesso) {
            mensagemLogin.classList.add("sucesso");
        }
    }

    /* ==============================
       VERIFICAR SUPABASE
       ============================== */

    if (typeof supabaseClient === "undefined") {

        mostrarMensagem(
            "Erro: o sistema de autenticação não foi carregado."
        );

        console.error("supabaseClient não encontrado.");

        return;
    }

    /* ==============================
       MOSTRAR SENHA
       ============================== */

    if (mostrarSenha) {

        mostrarSenha.addEventListener("change", function () {

            campoSenha.type = this.checked
                ? "text"
                : "password";

        });

    }

    /* ==============================
       LOGIN
       ============================== */

    if (formularioLogin) {

        formularioLogin.addEventListener("submit", async function (evento) {

            evento.preventDefault();

            const email = campoEmail.value.trim();
            const senha = campoSenha.value;

            if (!email || !senha) {

                mostrarMensagem(
                    "Digite seu e-mail e sua senha."
                );

                return;
            }

            botaoLogin.disabled = true;
            botaoLogin.textContent = "Entrando...";

            mostrarMensagem("");

            try {

                const { data, error } =
                    await supabaseClient.auth.signInWithPassword({
                        email: email,
                        password: senha
                    });

                console.log("Resultado do login:", data);
                console.log("Erro do login:", error);

                if (error) {

                    console.error(
                        "Erro Supabase:",
                        error.message
                    );

                    if (
                        error.message &&
                        error.message.toLowerCase().includes(
                            "email not confirmed"
                        )
                    ) {

                        mostrarMensagem(
                            "Este e-mail ainda não foi confirmado no Supabase."
                        );

                    } else if (
                        error.message &&
                        error.message.toLowerCase().includes(
                            "invalid login credentials"
                        )
                    ) {

                        mostrarMensagem(
                            "E-mail ou senha incorretos."
                        );

                    } else {

                        mostrarMensagem(
                            "Erro ao entrar: " + error.message
                        );

                    }

                    return;
                }

                if (!data || !data.session) {

                    mostrarMensagem(
                        "Login realizado, mas nenhuma sessão foi criada."
                    );

                    console.error(
                        "Usuário retornado sem sessão:",
                        data
                    );

                    return;
                }

                mostrarMensagem(
                    "Login realizado. Entrando...",
                    true
                );

                console.log(
                    "Usuário autenticado:",
                    data.user
                );

                /*
                 * Pequeno intervalo para garantir que
                 * a sessão seja salva antes do redirecionamento.
                 */

                setTimeout(function () {

                    window.location.href = "../pages/painel.html";

                }, 500);

            } catch (erro) {

                console.error(
                    "Erro inesperado:",
                    erro
                );

                mostrarMensagem(
                    "Não foi possível realizar o login."
                );

            } finally {

                botaoLogin.disabled = false;
                botaoLogin.textContent = "Entrar";

            }

        });

    }

    /* ==============================
       RECUPERAÇÃO DE SENHA
       ============================== */

    if (botaoEsqueciSenha) {

        botaoEsqueciSenha.addEventListener(
            "click",
            async function () {

                const email = campoEmail.value.trim();

                if (!email) {

                    mostrarMensagem(
                        "Digite seu e-mail primeiro."
                    );

                    campoEmail.focus();

                    return;
                }

                try {

                    const { error } =
                        await supabaseClient.auth
                            .resetPasswordForEmail(
                                email,
                                {
                                    redirectTo:
                                        window.location.origin +
                                        "/admin/login.html"
                                }
                            );

                    if (error) {

                        console.error(
                            "Erro recuperação:",
                            error
                        );

                        mostrarMensagem(
                            "Não foi possível enviar o e-mail de recuperação."
                        );

                        return;
                    }

                    mostrarMensagem(
                        "Se o e-mail estiver cadastrado, você receberá as instruções.",
                        true
                    );

                } catch (erro) {

                    console.error(erro);

                    mostrarMensagem(
                        "Ocorreu um erro. Tente novamente."
                    );

                }

            }
        );

    }

});