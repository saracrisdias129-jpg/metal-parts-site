/* =========================================================
   METAL PARTS AUTO PEÇAS
   SCRIPT.JS
========================================================= */


/* =========================================================
   PEDIDO
========================================================= */

let pedido = JSON.parse(localStorage.getItem("metalPartsPedido")) || [];


/* =========================================================
   ATUALIZAR CONTADOR
========================================================= */

function atualizarContador() {

    const contador = document.getElementById("cart-count");

    if (!contador) return;

    contador.textContent = pedido.length;

}


/* =========================================================
   ADICIONAR PRODUTO
========================================================= */

function adicionarProduto(nome) {

    pedido.push({
        nome: nome,
        quantidade: 1
    });

    localStorage.setItem(
        "metalPartsPedido",
        JSON.stringify(pedido)
    );

    atualizarContador();

    mostrarNotificacao(
        `${nome} foi adicionado ao pedido.`
    );

}


/* =========================================================
   BOTÕES DE PRODUTO
========================================================= */

document.querySelectorAll(".add-product").forEach(botao => {

    botao.addEventListener("click", () => {

        const nome = botao.dataset.product;

        adicionarProduto(nome);

    });

});


/* =========================================================
   NOTIFICAÇÃO
========================================================= */

function mostrarNotificacao(mensagem) {

    const antiga = document.querySelector(".notification");

    if (antiga) {
        antiga.remove();
    }

    const notificacao = document.createElement("div");

    notificacao.className = "notification";

    notificacao.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>${mensagem}</span>
    `;

    document.body.appendChild(notificacao);

    setTimeout(() => {

        notificacao.classList.add("show");

    }, 10);

    setTimeout(() => {

        notificacao.classList.remove("show");

        setTimeout(() => {
            notificacao.remove();
        }, 300);

    }, 3000);

}


/* =========================================================
   ESTILO DA NOTIFICAÇÃO
========================================================= */

const notificationStyle = document.createElement("style");

notificationStyle.textContent = `

.notification {

    position: fixed;

    top: 100px;
    right: 25px;

    z-index: 999;

    display: flex;

    align-items: center;

    gap: 12px;

    background: #05080b;

    color: white;

    border-left: 4px solid #ff6a00;

    padding: 15px 20px;

    font-size: 12px;

    font-weight: 700;

    box-shadow: 0 15px 40px rgba(0,0,0,.25);

    transform: translateX(120%);

    transition: .3s;

}

.notification.show {

    transform: translateX(0);

}

.notification i {

    color: #ff6a00;

    font-size: 18px;

}

`;

document.head.appendChild(notificationStyle);


/* =========================================================
   BUSCA DA HOME
========================================================= */

const campoBusca = document.getElementById("home-search");

const botaoBusca = document.getElementById("search-button");

if (botaoBusca) {

    botaoBusca.addEventListener("click", () => {

        const termo = campoBusca.value.trim();

        if (!termo) {

            window.location.href = "pages/catalogo.html";

            return;

        }

        localStorage.setItem(
            "metalPartsBusca",
            termo
        );

        window.location.href =
            `pages/catalogo.html?busca=${encodeURIComponent(termo)}`;

    });

}


/* =========================================================
   ENTER NA BUSCA
========================================================= */

if (campoBusca) {

    campoBusca.addEventListener("keydown", event => {

        if (event.key === "Enter") {

            botaoBusca.click();

        }

    });

}


/* =========================================================
   CATEGORIAS
========================================================= */

document.querySelectorAll(".category").forEach(botao => {

    botao.addEventListener("click", () => {

        document.querySelectorAll(".category")
            .forEach(item => item.classList.remove("active"));

        botao.classList.add("active");

    });

});


/* =========================================================
   WHATSAPP
========================================================= */

const whatsappButton =
    document.getElementById("whatsapp-button");

if (whatsappButton) {

    whatsappButton.addEventListener("click", event => {

        event.preventDefault();

        /*
            TROCAR PELO NÚMERO REAL DA METAL PARTS.

            Exemplo:

            const numero = "5527999999999";
        */

        const numero = "";

        if (!numero) {

            mostrarNotificacao(
                "O WhatsApp da loja ainda precisa ser configurado."
            );

            return;

        }

        const mensagem =
            "Olá! Gostaria de falar com a Metal Parts Auto Peças.";

        const url =
            `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

        window.open(url, "_blank");

    });

}


/* =========================================================
   MENU MOBILE
========================================================= */

const menuButton =
    document.getElementById("menu-button");

if (menuButton) {

    menuButton.addEventListener("click", () => {

        document.body.classList.toggle("mobile-menu-open");

    });

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

atualizarContador();