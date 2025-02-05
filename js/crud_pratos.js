let dropArea = document.getElementById("drop-area");
let fileInput = document.getElementById("fileInput");
let preview = document.getElementById("preview");
let selectedFile;

// Click to open file dialog
dropArea.addEventListener("click", () => fileInput.click());

// File input change event
fileInput.addEventListener("change", (event) => {
    handleFile(event.target.files[0]);
});

// Drag & Drop events
["dragover", "dragenter"].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropArea.classList.add("highlight");
    });
});

["dragleave", "drop"].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropArea.classList.remove("highlight");
    });
});

dropArea.addEventListener("drop", (event) => {
    let file = event.dataTransfer.files[0];
    handleFile(file);
});

// Handle file selection
function handleFile(file) {
    if (file && file.type.startsWith("image/")) {
        selectedFile = file;

        let reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}


//-----------------------------CRUD----------------------------
function fetchItems() {
    fetch('../php/pratos/read.php')
        .then(response => response.json())
        .then(items => {
            const list = document.getElementById('items-list');
            
            // Build the table structure
            list.innerHTML = `
            <div class="rounded-3 border overflow-hidden">
            <table class="table table-hover table-bordered text-center align-middle mb-0">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>nome</th>
                        <th>tipo</th>
                        <th>ingredientes</th>
                        <th>imagem</th>
                        <th>apagar</th>
                        <th>editar</th>
                    </tr>
                </thead>
                <tbody id="table-body"></tbody>
            </table>
            </div>`;
            
            // Get the tbody element for appending rows
            const tableBody = document.getElementById('table-body');
            
            // Loop through items and add rows
            items.forEach(item => {
        
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.tipo}</td>
                    <td>${item.ingredientes}</td>
                    <td><img src="${item.image}" width="100" height="100"></td>
                    <td>
                        <a class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">apagar</a>
                    </td>
                    <td>
                        <a class="btn btn-success btn-sm" onclick="prepareUpdate(${item.id}, '${item.nome}', '${item.tipo}', '${item.ingredientes}', '${item.image}')">editar</a>
                    </td>`;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}


function createItem() {
    if (!selectedFile) {
        alert("Por favor selecione uma imagem !");
        return;
    }
    else{
    const nome = document.getElementById('nome').value;
    const tipo = document.getElementById('tipo').value;
    const ingredientes = document.getElementById('ingredientes').value;
    const fileInput = document.getElementById('fileInput'); // Get file input

    let formData = new FormData();
    formData.append("nome", nome);
    formData.append("tipo", tipo);
    formData.append("ingredientes", ingredientes);
    formData.append("image", fileInput.files[0]);

    fetch("../php/pratos/create.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        fetchItems(); // Refresh items after creating one
    })
    .catch(error => console.error("Error:", error));
}
}


function deleteItem(id) {
    fetch('../php/pratos/delete.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchItems();
        });
}

function prepareUpdate(id, nome, tipo, ingredientes, image) {
    document.getElementById('update_id').value = id;
    document.getElementById('update_nome').value = nome;
    document.getElementById('update_tipo').value = tipo;
    document.getElementById('update_ingredientes').value = ingredientes;
}

function updateItem() {
    if (!selectedFile) {
        alert("Por favor selecione uma imagem !");
        return;
    }
    const id = document.getElementById('update_id').value;
    const nome = document.getElementById('update_nome').value;
    const tipo = document.getElementById('update_tipo').value;
    const ingredientes = document.getElementById('update_ingredientes').value;
    const fileInput = document.getElementById('fileInput'); // Get file input element

    let formData = new FormData();
    formData.append("id", id);
    formData.append("nome", nome);
    formData.append("tipo", tipo);
    formData.append("ingredientes", ingredientes);

    // Check if an image was selected
    if (fileInput.files.length > 0) {
        formData.append("image", fileInput.files[0]);
    }

    fetch("../php/pratos/update.php", {
        method: "POST", // Use POST instead of PUT for FormData
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        fetchItems(); // Refresh data after update
    })
    .catch(error => console.error("Error:", error));
}




fetchItems();