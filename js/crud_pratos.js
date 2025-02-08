function modalload() {
    let deletedia = null;

    function openDeleteModal(id) {
        deletedia = id;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    function deleteModal() {
        if (deletedia !== null) {
            deleteItem(deletedia);
            deletedia = null;
        }
    }

    // Check for the delete button AFTER the page loads
    setTimeout(() => {
        const deleteButton = document.getElementById('confirmDeleteBtn');
        if (deleteButton) {
            deleteButton.addEventListener('click', deleteModal);
        } else {
            console.error("Error: confirmDeleteBtn not found. Make sure the modal exists in your HTML.");
        }
    }, 1000); // Delay check to make sure modal is loaded

    // Expose function globally so you can call it in the HTML
    window.openDeleteModal = openDeleteModal;
}


//-----------------------------CRUD----------------------------
let totalitems;
function fetchItems() {
    fetch('../php/pratos/read.php')
        .then(response => response.json())
        .then(items => {
            totalitems = items;
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
                        <th>editar</th>
                        <th>apagar</th>
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
                        <a class="btn btn-success btn-sm" onclick="prepareUpdate(${item.id}, '${item.nome}', '${item.tipo}', '${item.ingredientes}', '${item.image}')" data-toggle="modal" data-target="#uploadmodal">editar</a>
                    </td>
                    <td>
                        <a class="btn btn-danger btn-sm" onclick="openDeleteModal(${item.id})">apagar</a>
                    </td>`;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}


function createItem() {

    const nome = document.getElementById('nome').value;
    const tipo = document.getElementById('tipo').value;
    const ingredientes = document.getElementById('ingredientes').value;
    const fileInput = document.getElementById('fileInput'); // Get file input

    if (!fileInput.files[0]) {
        document.getElementById('imgwarning').hidden = false;
    }
    else {
        document.getElementById('imgwarning').hidden = true;

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
    document.getElementById('fileInput2').files[0] = image; // Get file input element
    console.log(image);
    
}

function updateItem() {
    
    const id = document.getElementById('update_id').value;
    const nome = document.getElementById('update_nome').value;
    const tipo = document.getElementById('update_tipo').value;
    const ingredientes = document.getElementById('update_ingredientes').value;
    const fileInput = document.getElementById('fileInput2'); // Get file input element

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

function filtrartipo(tipo){
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
                        <th>editar</th>
                        <th>apagar</th>
                    </tr>
                </thead>
                <tbody id="table-body"></tbody>
            </table>
            </div>`;

            // Get the tbody element for appending rows
            const tableBody = document.getElementById('table-body');

            // Loop through items and add rows
            totalitems.forEach(item => {
if(item.tipo == tipo){
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.tipo}</td>
                    <td>${item.ingredientes}</td>
                    <td><img src="${item.image}" width="100" height="100"></td>
                    <td>
                        <a class="btn btn-success btn-sm" onclick="prepareUpdate(${item.id}, '${item.nome}', '${item.tipo}', '${item.ingredientes}', '${item.image}')">editar</a>
                    </td>
                    <td>
                        <a class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">apagar</a>
                    </td>`;
                tableBody.appendChild(tr);
            }
            });
            
}