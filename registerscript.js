const BIN_ID = "6932268243b1c97be9d88867";
const API_KEY = "$2a$10$0VucZInx6G1KMn11z1JyBuvQCCHMKEGPwuGpWChE9rjno5A/mm13C";

async function getUsers() {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { "X-Master-Key": API_KEY }
    });
    const data = await res.json();
    return data.record;  // teu array
}

async function saveUsers(arr) {
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": API_KEY,
            "X-Bin-Versioning": "false"
        },
        body: JSON.stringify(arr)
    });
}

async function registrar() {
    let u = alias.value.trim();
    let s = senha.value.trim();
    let a = avatar.value.trim() || "🙂";

    if (!u || !s) {
        alert("preenche");
        return;
    }

    let users = await getUsers(); // pega o array do jsonbin

    // verifica duplicado
    if (users.some(x => x.user === u)) {
        alert("usuário já existe");
        return;
    }

    // adiciona um novo user no array
    users.push({
        user: u,
        pass: s,
        avatar: a,
        preferencias: {
            cor: "#ffffff",
            som: true,
            caos: false
        }
    });

    // salva no bin
    await saveUsers(users);

    alert("registrado! agora vai logar");

    window.location.href = "login.html";
}
