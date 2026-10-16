
const saldoInicial = 500;
let saldo = saldoInicial;
let total = 0;
let gastos = [];
let proximoId = 1;

// Formatar valores em reais
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Adicionar um novo gasto
function adicionarGasto() {
    const campoDescricao = document.getElementById("descricao");
    const campoValor = document.getElementById("valor");

    const descricao = campoDescricao.value.trim();
    const valor = Number(campoValor.value);

    // Validar os campos
    if (
        descricao === "" ||
        campoValor.value.trim() === "" ||
        !Number.isFinite(valor) ||
        valor <= 0
    ) {
        alert("Preencha a descrição e informe um valor válido!");
        return;
    }

    // Criar o gasto
    const gasto = {
        id: proximoId++,
        descricao: descricao,
        valor: Math.round(valor * 100) / 100
    };

    gastos.push(gasto);

    // Atualizar a tela
    atualizarValores();

    // Limpar os campos
    campoDescricao.value = "";
    campoValor.value = "";
    campoDescricao.focus();
}

// Excluir um gasto
function excluirGasto(id) {
    const confirmar = confirm(
        "Deseja realmente excluir este gasto?"
    );

    if (!confirmar) {
        return;
    }

    gastos = gastos.filter(function(gasto) {
        return gasto.id !== id;
    });

    atualizarValores();
}

// Atualizar o saldo, o total e a lista
function atualizarValores() {

    // Calcular o total dos gastos em centavos
    const totalCentavos = gastos.reduce(function(soma, gasto) {
        return soma + Math.round(gasto.valor * 100);
    }, 0);

    total = totalCentavos / 100;
    saldo = saldoInicial - total;

    // Atualizar os valores na página
    document.getElementById("total").textContent =
        formatarMoeda(total);

    document.getElementById("saldo").textContent =
        formatarMoeda(saldo);

    // Limpar a lista antes de recriá-la
    const lista = document.getElementById("listaGastos");
    lista.innerHTML = "";

    // Criar cada gasto e seu botão de exclusão
    gastos.forEach(function(gasto) {

        const item = document.createElement("div");
        item.className = "gasto";

        const nome = document.createElement("span");
        nome.textContent = gasto.descricao;

        const acoes = document.createElement("div");
        acoes.className = "gasto-acoes";

        const valor = document.createElement("span");
        valor.textContent = formatarMoeda(gasto.valor);

        const botao = document.createElement("button");
        botao.textContent = "Excluir";
        botao.type = "button";
        botao.className = "btn-excluir";

        botao.setAttribute(
            "aria-label",
            "Excluir gasto: " + gasto.descricao
        );

        // Executar a exclusão ao clicar no botão
        botao.addEventListener("click", function() {
            excluirGasto(gasto.id);
        });

        // Montar o item da lista
        acoes.appendChild(valor);
        acoes.appendChild(botao);

        item.appendChild(nome);
        item.appendChild(acoes);

        lista.appendChild(item);
    });
}

// Inicializar a aplicação ao abrir a página
atualizarValores();
