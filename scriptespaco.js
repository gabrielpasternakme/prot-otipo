// === CONFIG JSONBIN ===
const JSONBIN_ID = "6929c402ae596e708f76b5c3";
const JSONBIN_KEY = "$2a$10$0VucZInx6G1KMn11z1JyBuvQCCHMKEGPwuGpWChE9rjno5A/mm13C";

if (!localStorage.getItem("session_user")) {

    window.location.href = "login.html";
}
let currentUser = localStorage.getItem("session_user");

if (currentUser) {
    document.getElementById("nomeUser").innerText = currentUser;
}

function login(){

    window.location.href = "login.html"; 
}
function register(){

    window.location.href = "register.html"; 
}
function espaco(){
    window.location.href = "index.html"; 
}








// usuário que vai salvar as frases
const USER_ID = localStorage.getItem("session_user");
if (!USER_ID) window.location.href = "login.html"; 



async function getDB(){
    const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
        headers: { "X-Master-Key": JSONBIN_KEY }
    });
    const data = await res.json();
    return data.record;
}


async function saveDB(db) {
    await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": JSONBIN_KEY,
            "X-Bin-Versioning": "false"   // <---- ESSA PORRA RESOLVE 90% DO BUG
        },
        body: JSON.stringify(db)
    });
}


async function saveFrase(texto, x, y, cor, rot){
    
    let db = await getDB();
    if (!texto || texto.trim().length === 0) return;
    if (!db.usuarios) db.usuarios = {};
    if (!db.usuarios[USER_ID]) db.usuarios[USER_ID] = { frases: [] };

    const id = crypto.randomUUID();

    db.usuarios[USER_ID].frases.push({
    id,
    texto,
    x,
    y,
    color: cor,
    rotacao: rot
});


    await saveDB(db);
}
async function loadFrases(){
    let db = await getDB();

    if (!db.usuarios || !db.usuarios[USER_ID]) return;

    db.usuarios[USER_ID].frases.forEach(f => {
        addBlocoFromJSON(f);
    });
}
function addBlocoFromJSON(f){
    let bloco = document.createElement("div");
    bloco.dataset.id = f.id;
    bloco.className = "bloco";
    bloco.style.left = f.x+"px";
    bloco.style.top  = f.y+"px";
    bloco.style.color = f.color || "#fff";
    bloco.style.transform = "rotate(" + (f.rotacao || 0) + "deg)";
    bloco.innerText = f.texto;

    bloco.addEventListener("input", ()=>{
        if(bloco.innerText.length > 80000){
            bloco.innerText = bloco.innerText.substring(0, 80000);
            let sel = window.getSelection();
            sel.collapse(bloco.childNodes[0], bloco.innerText.length);
        }
    });

    enableDrag(bloco);
    document.getElementById("mundo").appendChild(bloco);
}

async function updateTexto(id, textoNovo){
    let db = await getDB();

    if (!db.usuarios || !db.usuarios[USER_ID]) return;
    let frases = db.usuarios[USER_ID].frases;
    

    let alvo = frases.find(f => f.id === id);
    if (!alvo) return;

    alvo.texto = textoNovo;
    await saveDB(db);
}

async function updatePos(id, x, y, color, rotacao){
    let db = await getDB();

    if (!db.usuarios || !db.usuarios[USER_ID]) return;
    let frases = db.usuarios[USER_ID].frases;

    let alvo = frases.find(f => f.id === id);
    if (!alvo) return;

    alvo.x = x;
    alvo.y = y;
    alvo.color = color;
    alvo.rotacao = rotacao;

    await saveDB(db);
}
















const toggle = document.getElementById("menu-toggle");
const panel = document.getElementById("menu-panel");

toggle.addEventListener("click", () => {
    panel.classList.toggle("open");
});









const ambient = document.getElementById("ambient-sound");
ambient.volume = 0.05;
ambient.play().catch(()=>{});

// === chaos mode ===
const chaosBtn = document.getElementById("chaos-btn");
let chaosOn = false;

chaosBtn.addEventListener("click", () => {
    chaosOn = !chaosOn;
    document.body.classList.toggle("rave-active", chaosOn);

    const allBlocks = document.querySelectorAll(".bloco");
    const allSprites = document.querySelectorAll(".sprite");

    allBlocks.forEach(b => {
        b.style.animationDuration = chaosOn ? "1s, 1s" : "3s, 3s";
    });

    allSprites.forEach(s => {
        s.style.animationDuration = chaosOn ? "5s" : "20s";
    });
});



// === lanterna ===
const light = document.getElementById("light-overlay");

document.addEventListener("mousemove", e => {
    

    light.style.background =
        `radial-gradient(circle 150px at ${e.clientX}px ${e.clientY}px,
        rgba(255,255,255,0.0) 0%,
        rgba(0,0,0,0.8) 250px)`;
});



// === centralizar mundo ===
window.addEventListener("load", () => {
    document.documentElement.scrollLeft = (30000 - innerWidth) / 2;
    document.documentElement.scrollTop  = (30000 - innerHeight) / 2;
});

const wrapper = document.scrollingElement || document.documentElement;
wrapper.scrollLeft = (30000 - innerWidth)/2;
wrapper.scrollTop  = (30000 - innerHeight)/2;



// === carregar blocos do servidor ===
loadFrases();




// === clique pra criar bloco ===
document.addEventListener("click", function(e){

    // --- evitar criar bloco ao clicar no menu
    if (e.target.closest("#user-menu")) return;

    // --- se clicar no chaos button, não cria bloco
    if (e.target.id === "chaos-btn") return;

    // --- permitir links funcionarem normalmente
    if (e.target.closest("a")) return;

    // --- evitar criar bloco em inputs
    if (e.target.tagName === "INPUT") return;

    // --- evitar criar bloco em blocos existentes
    if (e.target.classList.contains("bloco")) return;

    // --- sprites: deixar link abrir normal (já coberto pelo closest("a"))
    // mas evitar criação de bloco caso clique num sprite sem link:
    if (e.target.classList.contains("sprite")) return;

    // --- finalmente cria bloco
    criarBloco(e.pageX, e.pageY);
});




// === decorativos automáticos ===
window.addEventListener("load", ()=> gerarDecorativos());



// === criar bloco ===


// === criar bloco vindo do servidor ===
function addBlocoFromServer(data){
    let bloco = document.createElement("div");
    bloco.className = "bloco";
    bloco.style.left = data.x+"px";
    bloco.style.top  = data.y+"px";
    bloco.style.color= data.color;
    bloco.style.transform="rotate(" + data.rotacao + "deg)";
    bloco.innerText = data.texto;

    bloco.addEventListener("dblclick", ()=>{
        bloco.contentEditable = "true";
        bloco.focus();
    });

    bloco.addEventListener("input", ()=>{
        if(bloco.innerText.length > 80000){
            bloco.innerText = bloco.innerText.substring(0, 80000);
            let sel = window.getSelection();
            sel.collapse(bloco.childNodes[0], bloco.innerText.length);
        }
    });

    enableDrag(bloco);
    document.body.appendChild(bloco);
}



// === DRAG (versão final, única) ===
function enableDrag(el){
    let offsetX, offsetY;
    let dragging = false;

    el.addEventListener("mousedown", e => {
        if (e.detail === 2) return;
        

        dragging = true;
        offsetX = e.clientX - el.offsetLeft;
        offsetY = e.clientY - el.offsetTop;

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", stop);
    });

    function move(ev){
        if (!dragging) return;
        el.style.left = (ev.clientX - offsetX) + "px";
        el.style.top = (ev.clientY - offsetY) + "px";
    }

    async function stop(){
    if (!dragging) return;
    dragging = false;

    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", stop);

    const novoTexto = el.innerText.trim();
    if(novoTexto.length === 0) return;

    // atualiza texto se mudou
    if(novoTexto !== el.dataset.textoOriginal){
        await updateTexto(el.dataset.id, novoTexto);
        el.dataset.textoOriginal = novoTexto;
    }

    // atualiza posição e estilo sempre
    await updatePos(
        el.dataset.id,
        parseInt(el.style.left),
        parseInt(el.style.top),
        el.style.color,
        parseInt(el.style.transform.replace(/[^0-9\-]/g,""))
    );
}












async function stop(){
    if (!dragging) return;
    dragging = false;

    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", stop);

    const novoTexto = el.innerText.trim();

    // se o texto estiver vazio, apaga o bloco e sai
    if(novoTexto.length === 0){
        // opcional: poderia remover do servidor tbm
        el.remove();
        return;
    }

    // atualiza texto se mudou
    if(novoTexto !== el.dataset.textoOriginal){
        await updateTexto(el.dataset.id, novoTexto);
        el.dataset.textoOriginal = novoTexto;
    }

    // atualiza posição e estilo sempre
    await updatePos(
        el.dataset.id,
        parseInt(el.style.left),
        parseInt(el.style.top),
        el.style.color,
        parseInt(el.style.transform.replace(/[^0-9\-]/g,""))
    );
}


















    el.addEventListener("dblclick", ()=>{
        el.contentEditable = "true";
        el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        el.contentEditable = "false"
        e.preventDefault(); // impede criar nova linha
        el.blur(); // força salvar a edição se tu quiser
    }
});
        el.focus();
    });
}




// === salvar no servidor ===
function salvarServidor(bloco){
    let data = {
        texto: bloco.innerText,
        x: parseInt(bloco.style.left),
        y: parseInt(bloco.style.top),
        color: bloco.style.color,
        rotacao: parseInt(bloco.style.transform.replace(/[^0-9\-]/g,""))
    };

    fetch("http://localhost:3000/save", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(data)
    });
}



// === decor ===
function gerarDecorativos(qtd = 900){
    const container = document.getElementById("decor-container");

    for(let i = 0; i < qtd; i++){
        let d = document.createElement("div");
        d.className = "decor";

        d.innerText = ["⊞","▀","█","░","▣","▩","◙","▙"][Math.floor(Math.random()*8)];

        d.style.left = (Math.random() * 10000) + "px";
        d.style.top  = (Math.random() * 10000) + "px";

        d.style.fontSize = (40 + Math.random()*80) + "px";
        d.style.animationDuration = (40 + Math.random()*60) + "s";

        container.appendChild(d);
    }
}



// === partículas ===
function spawnParticleAnywhere(){
    const p = document.createElement("div");
    p.className = "particle";

    const x = window.scrollX + Math.random() * window.innerWidth;
    const y = window.scrollY + Math.random() * window.innerHeight;

    p.style.left = x + "px";
    p.style.top  = y + "px";

    const size = 1 + Math.random()*2;
    p.style.width  = size + "px";
    p.style.height = size + "px";

    p.style.background = "rgba(255,255,255,0.95)";

    document.body.appendChild(p);

    setTimeout(()=> p.remove(), 6000);
}

setInterval(spawnParticleAnywhere, 120);



// === color picker ===
// === color picker (robusto, aceita várias instâncias) ===
let currentColor = "#ffffff"; // cor usada ao criar blocos

// pega todos os pickers (se tiver só 1, ok)
const pickers = document.querySelectorAll(".color-picker");

// se não achar nenhum, loga e guarda fallback
if (!pickers || pickers.length === 0) {
    console.warn("nenhum .color-picker encontrado no DOM. checa o HTML.");
} else {
    pickers.forEach(picker => {
        // tenta achar um preview relacionado (dentro do mesmo wrapper) ou usa o primeiro .color-preview
        const wrapper = picker.closest(".color-picker-wrapper");
        const preview = (wrapper && wrapper.querySelector(".color-preview")) || document.querySelector(".color-preview");

        // inicializa preview e currentColor
        if (preview) preview.style.background = picker.value || currentColor;
        if (picker.value) currentColor = picker.value;

        // evento de input
        picker.addEventListener("input", () => {
            if (preview) preview.style.background = picker.value;
            currentColor = picker.value;
        });
    });
}

// função criarBloco: usa currentColor em vez de ler do DOM toda vez
function criarBloco(x,y){
    let cor = currentColor || "#ffffff";
    let rot = (Math.random() * 20) - 10; 
    const id = crypto.randomUUID();
    let bloco = document.createElement("div");
    bloco.dataset.id = id;
    bloco.className = "bloco";
    bloco.contentEditable = "true";
    bloco.style.left = x+"px";
    bloco.style.top  = y+"px";
    bloco.style.color = cor;
    bloco.style.transform = "rotate(" + ((Math.random()*10)-5) + "deg)";
    bloco.innerText = "";

    bloco.dataset.textoOriginal = ""; // inicial

    bloco.addEventListener("input", ()=>{
        if(bloco.innerText.length > 80000){
            bloco.innerText = bloco.innerText.substring(0, 80000);
            let sel = window.getSelection();
            if (bloco.childNodes[0])
                sel.collapse(bloco.childNodes[0], bloco.innerText.length);
        }
    });

    enableDrag(bloco);
    document.getElementById("mundo").appendChild(bloco);
    bloco.focus();

    // === quando terminar de editar ===
    bloco.addEventListener("blur", async ()=>{
        bloco.contentEditable = "false";
        let novo = bloco.innerText.trim();

        // delete se estiver vazio
        if (novo === "") {
            bloco.remove();
            return;
        }

        // se é novo, salva
        if (bloco.dataset.textoOriginal === "") {
            await saveFrase(
                novo,
                parseInt(bloco.style.left),
                parseInt(bloco.style.top),
                bloco.style.color,
                parseInt(bloco.style.transform.replace(/[^0-9\-]/g,""))
            );

            bloco.dataset.textoOriginal = novo; 
            return;
        }

        // se já existia, atualiza texto
        await updateTexto(bloco.dataset.id, novo);
        bloco.dataset.textoOriginal = novo;
    });

    bloco.addEventListener("keydown", ev=>{
        if(ev.key === "Enter"){
            ev.preventDefault();
            bloco.blur();
        }
    });
}
