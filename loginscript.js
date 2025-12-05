const BIN_ID = "6932268243b1c97be9d88867";
const API_KEY = "$2a$10$0VucZInx6G1KMn11z1JyBuvQCCHMKEGPwuGpWChE9rjno5A/mm13C";


async function getUsers() {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { "X-Master-Key": API_KEY }
    });
    const data = await res.json();
    return data.record;  // array
}

async function login() {
    let u = alias.value.trim();
    let s = senha.value.trim();

    if (!u || !s) {
        alert("preenche direito aí zé");
        return;
    }

    let users = await getUsers();

    // procura o user
    let found = users.find(x => x.user === u);

    if (!found) {
        alert("usuário n existe");
        return;
    }

    if (found.pass !== s) {
        alert("senha errada seu animal");
        return;
    }

    // salva sessão
    localStorage.setItem("session_user", found.user);
    localStorage.setItem("session_avatar", found.avatar || "🙂");
    
    localStorage.setItem("session_user", u);

    // redireciona
    window.location.href = "espaco.html";
}
