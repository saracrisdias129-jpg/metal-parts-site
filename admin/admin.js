document.addEventListener("DOMContentLoaded", async function () {

    const formularioLogin = document.getElementById("formLogin");
    const campoEmail = document.getElementById("email");
    const campoSenha = document.getElementById("senha");
    const mostrarSenha = document.getElementById("mostrarSenha");
    const botaoLogin = document.getElementById("botaoLogin");
    const botaoEsqueciSenha = document.getElementById("botaoEsqueciSenha");
    const mensagemLogin = document.getElementById("mensagemLogin");


    /* =====================================================
       MENSAGEM
    ===================================================== */

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


    /* =====================================================
       VERIFICAR SUPABASE
    ===================================================== */

    if (
        typeof window.supabase === "undefined" ||
        typeof window.supabaseClient === "undefined"
    ) {

        mostrarMensagem(
            "Erro ao carregar o sistema de autenticação."
        );

        console.error(
            "Supabase ou supabaseClient não encontrado."
        );

        return;
    }


    /* =====================================================
       MOSTRAR SENHA
    ===================================================== */

    if (mostrarSenha && campoSenha) {

        mostrarSenha.addEventListener("change", function () {

            campoSenha.type =
                this.checked
                    ? "text"
                    : "password";

        });

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    if (formularioLogin) {

        formularioLogin.addEventListener(
            "submit",
            async function (evento) {

                evento.preventDefault();


                const email =
                    campoEmail
                        ? campoEmail.value.trim()
                        : "";

                const senha =
                    campoSenha
                        ? campoSenha.value
                        : "";


                if (!email || !senha) {

                    mostrarMensagem(
                        "Digite seu e-mail e sua senha."
                    );

                    return;
                }


                if (botaoLogin) {

                    botaoLogin.disabled = true;
                    botaoLogin.textContent = "Entrando...";

                }


                mostrarMensagem("");


                try {

                    const resultado =
                        await supabaseClient.auth.signInWithPassword({
                            email: email,
                            password: senha
                        });


                    const data = resultado.data;
                    const error = resultado.error;


                    console.log(
                        "Resultado do login:",
                        data
                    );


                    if (error) {

                        console.error(
                            "Erro Supabase:",
                            error
                        );


                        const erro =
                            String(
                                error.message || ""
                            ).toLowerCase();


                        if (
                            erro.includes(
                                "invalid login credentials"
                            )
                        ) {

                            mostrarMensagem(
                                "E-mail ou senha incorretos."
                            );

                        } else if (
                            erro.includes(
                                "email not confirmed"
                            )
                        ) {

                            mostrarMensagem(
                                "O e-mail ainda não foi confirmado no Supabase."
                            );

                        } else {

                            mostrarMensagem(
                                "Erro ao entrar: " +
                                error.message
                            );

                        }

                        return;
                    }


                    if (!data || !data.session) {

                        mostrarMensagem(
                            "O login foi realizado, mas a sessão não foi criada."
                        );

                        console.error(
                            "Sessão inexistente:",
                            data
                        );

                        return;
                    }


                    mostrarMensagem(
                        "Login realizado! Entrando...",
                        true
                    );


                    /*
                     * Confirma que a sessão foi salva.
                     */

                    const sessao =
                        await supabaseClient.auth.getSession();


                    if (
                        !sessao.data ||
                        !sessao.data.session
                    ) {

                        mostrarMensagem(
                            "Não foi possível confirmar a sessão."
                        );

                        return;
                    }


                    setTimeout(function () {

                        window.location.href =
                            "../pages/painel.html";

                    }, 300);


                } catch (erro) {

                    console.error(
                        "Erro inesperado no login:",
                        erro
                    );


                    mostrarMensagem(
                        "Não foi possível realizar o login."
                    );


                } finally {

                    if (botaoLogin) {

                        botaoLogin.disabled = false;
                        botaoLogin.textContent = "Entrar";

                    }

                }

            }
        );

    }


    /* =====================================================
       ESQUECI MINHA SENHA
    ===================================================== */

    if (botaoEsqueciSenha) {

        botaoEsqueciSenha.addEventListener(
            "click",
            async function () {

                const email =
                    campoEmail
                        ? campoEmail.value.trim()
                        : "";


                if (!email) {

                    mostrarMensagem(
                        "Digite seu e-mail primeiro."
                    );

                    if (campoEmail) {
                        campoEmail.focus();
                    }

                    return;
                }


                try {

                    mostrarMensagem(
                        "Enviando instruções..."
                    );


                    const resultado =
                        await supabaseClient.auth
                            .resetPasswordForEmail(
                                email,
                                {
                                    redirectTo:
                                        window.location.origin +
                                        "/admin/login.html"
                                }
                            );


                    if (resultado.error) {

                        console.error(
                            "Erro recuperação:",
                            resultado.error
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

                    console.error(
                        "Erro recuperação:",
                        erro
                    );


                    mostrarMensagem(
                        "Ocorreu um erro. Tente novamente."
                    );

                }

            }
        );

    }

});
