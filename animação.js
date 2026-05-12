const chatbotBtn = document.querySelector(".chatbot-btn");
const optionsPanel = document.getElementById("optionsPanel");
const chatbox = document.getElementById("chatbox");
const loadingScreen = document.getElementById("loadingScreen");
const chatboxBody = document.getElementById("chatboxBody");

// ===== UTILITÁRIOS =====
function addMessage(text, type) {
  const p = document.createElement("p");
  p.textContent = text;
  p.classList.add(type);
  chatboxBody.appendChild(p);
  chatboxBody.scrollTo({ top: chatboxBody.scrollHeight, behavior: "smooth" });
  return p;
}

function showTypingIndicator() {
  const indicator = document.createElement("p");
  indicator.className = "typing-indicator";
  indicator.innerHTML = "<span></span><span></span><span></span>";
  chatboxBody.appendChild(indicator);
  chatboxBody.scrollTo({ top: chatboxBody.scrollHeight, behavior: "smooth" });
  return indicator;
}

function removeTypingIndicator() {
  const indicator = chatboxBody.querySelector(".typing-indicator");
  if (indicator) indicator.remove();
}

function closeAllPanels() {
  optionsPanel.classList.remove("active");
  chatbox.classList.remove("active");
}

// ===== CLIQUE NO BOTÃO PRINCIPAL =====
chatbotBtn.addEventListener("click", () => {
  if (optionsPanel.classList.contains("active") || chatbox.classList.contains("active")) {
    closeAllPanels();
    return;
  }

  loadingScreen.classList.add("active");

  setTimeout(() => {
    loadingScreen.classList.remove("active");
    optionsPanel.classList.add("active");
  }, 1000);
});

// ===== FECHAR AO CLICAR FORA =====
document.addEventListener("click", (e) => {
  const isClickInside =
    chatbotBtn.contains(e.target) ||
    optionsPanel.contains(e.target) ||
    chatbox.contains(e.target);

  if (!isClickInside) {
    closeAllPanels();
  }
});

// ===== FECHAR COM ESC =====
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAllPanels();
  }
});

// ===== FUNÇÃO PARA ENVIAR PARA API =====
async function enviarParaAPI(opcao) {
  const typing = showTypingIndicator();

  try {
    const resposta = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: opcao })
    });

    removeTypingIndicator();

    if (!resposta.ok) {
      addMessage("IA (erro): Servidor retornou " + resposta.status, "error");
      return;
    }

    const data = await resposta.json();
    addMessage("IA: " + (data.reply || "Sem resposta."), "ia");

  } catch (error) {
    removeTypingIndicator();
    addMessage("IA (erro): Não foi possível conectar à API.", "error");
    console.error("Erro ao conectar API:", error);
  }
}

// ===== CLIQUE NAS OPÇÕES =====
document.querySelectorAll("#optionsPanel button").forEach(btn => {
  btn.addEventListener("click", () => {
    const opcao = btn.textContent.trim();
    if (!opcao) return;

    addMessage("Você: " + opcao, "user");

    optionsPanel.classList.remove("active");
    chatbox.classList.add("active");

    enviarParaAPI(opcao);
  });
});

// ===== FECHAR CHAT =====
document.getElementById("closeChat").addEventListener("click", () => {
  chatbox.classList.remove("active");
  optionsPanel.classList.add("active");
});

// ===== ENVIAR MENSAGEM DIGITADA =====
function enviarMensagem() {
  const input = document.getElementById("chatInput");
  const mensagem = input.value.trim();
  if (!mensagem) return;

  addMessage("Você: " + mensagem, "user");
  enviarParaAPI(mensagem);
  input.value = "";
}

document.getElementById("sendBtn").addEventListener("click", enviarMensagem);

// ===== ENVIAR COM ENTER =====
document.getElementById("chatInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    enviarMensagem();
  }
});

// ===== FOCAR INPUT AO ABRIR CHAT =====
const chatObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.target.classList.contains("active")) {
      setTimeout(() => document.getElementById("chatInput")?.focus(), 300);
    }
  });
});

chatObserver.observe(chatbox, { attributes: true, attributeFilter: ["class"] });

