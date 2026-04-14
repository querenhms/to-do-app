const campoTarefa = document.getElementById("tarefa");
const seletorPrioridade = document.getElementById("prioridade");
const botaoAdicionar = document.getElementById("adicionar");
const listaTarefas = document.getElementById("lista-tarefas");
const contador = document.getElementById("contador");

// Carregar tarefas salvas
document.addEventListener("DOMContentLoaded", carregarTarefas);

botaoAdicionar.addEventListener("click", () => {
    const texto = campoTarefa.value.trim();
    const prioridade = seletorPrioridade.value;

    if (texto === "") {
        alert("Digite uma tarefa válida!");
        return;
    }

    if (tarefaDuplicada(texto)) {
        alert("Essa tarefa já existe!");
        return;
    }

    adicionarTarefa(texto, prioridade);
    salvarTarefas();
    campoTarefa.value = "";
});

function adicionarTarefa(texto, prioridade, concluida = false) {
    const li = document.createElement("li");
    li.textContent = texto + " - " + prioridade.charAt(0).toUpperCase() + prioridade.slice(1) + " prioridade";
    li.classList.add(prioridade);
    if (concluida) li.classList.add("concluida");

    // Botão concluir
    const botaoConcluir = document.createElement("button");
    botaoConcluir.textContent = concluida ? "Reabrir" : "Concluir";
    botaoConcluir.addEventListener("click", () => {
        li.classList.toggle("concluida");
        botaoConcluir.textContent = li.classList.contains("concluida") ? "Reabrir" : "Concluir";
        salvarTarefas();
        atualizarContador();
    });

    // Botão remover com confirmação
    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";
    botaoRemover.classList.add("remover");
    botaoRemover.addEventListener("click", () => {
        if (confirm("Deseja realmente remover esta tarefa?")) {
            li.remove();
            salvarTarefas();
            atualizarContador();
        }
    });

    li.appendChild(botaoConcluir);
    li.appendChild(botaoRemover);
    listaTarefas.appendChild(li);

    ordenarTarefas();
    atualizarContador();
}

function tarefaDuplicada(texto) {
    return Array.from(listaTarefas.querySelectorAll("li"))
        .some(li => li.textContent.includes(texto));
}

function salvarTarefas() {
    const tarefas = [];
    listaTarefas.querySelectorAll("li").forEach(li => {
        tarefas.push({
            texto: li.textContent.replace(/Concluir|Reabrir|Remover/g, "").trim(),
            prioridade: li.classList.contains("alta") ? "alta" :
                        li.classList.contains("media") ? "media" : "baixa",
            concluida: li.classList.contains("concluida")
        });
    });
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefas.forEach(t => adicionarTarefa(t.texto, t.prioridade, t.concluida));
}

function atualizarContador() {
    const total = listaTarefas.querySelectorAll("li").length;
    const concluidas = listaTarefas.querySelectorAll(".concluida").length;
    contador.textContent = `Total: ${total} | Concluídas: ${concluidas}`;
}

function ordenarTarefas() {
    const itens = Array.from(listaTarefas.querySelectorAll("li"));
    itens.sort((a, b) => {
        const prioridades = { alta: 1, media: 2, baixa: 3 };
        const pa = prioridades[a.classList.contains("alta") ? "alta" : a.classList.contains("media") ? "media" : "baixa"];
        const pb = prioridades[b.classList.contains("alta") ? "alta" : b.classList.contains("media") ? "media" : "baixa"];
        return pa - pb;
    });
    listaTarefas.innerHTML = "";
    itens.forEach(item => listaTarefas.appendChild(item));
}
