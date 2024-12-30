



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
                        <th>descrição</th>
                        <th>data criação</th>
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
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.created_at}</td>
                    <td>
                        <a class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">apagar</a>
                    </td>
                    <td>
                        <a class="btn btn-success btn-sm" onclick="prepareUpdate(${item.id}, '${item.name}', '${item.description}')">editar</a>
                    </td>`;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}


function createItem() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    fetch('../php/pratos/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchItems();
        });
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

function prepareUpdate(id, name, description) {
    document.getElementById('update-id').value = id;
    document.getElementById('update-name').value = name;
    document.getElementById('update-description').value = description;
}

function updateItem() {
    const id = document.getElementById('update-id').value;
    const name = document.getElementById('update-name').value;
    const description = document.getElementById('update-description').value;

    fetch('../php/pratos/update.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, description })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchItems();
        });
}
//document.addEventListener('DOMContentLoaded', fetchItems);
fetchItems();