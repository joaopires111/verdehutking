
function fetchItems() {
    fetch('../php/pratos/read.php')
        .then(response => response.json())
        .then(items => {
            const list = document.getElementById('items-list');
            list.innerHTML = `        
            <thead>
            <tr>
            <th>id</th>
            <th>nome</th>
            <th>descrição</th>
            <th>data criação</th>
            <th>apagar</th>
            <th>editar</th>
            </thead>
        </tr>`;
            items.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <th>${item.id}</th><th>${item.name}</th><th>${item.description}</th><th>${item.created_at}</th>
                    <th><a class="btn btn-success btn-xl mt-5" onclick="deleteItem(${item.id})">apagar</a></th>
                    <th><a class="btn btn-success btn-xl mt-5" onclick="prepareUpdate(${item.id}, '${item.name}', '${item.description}')">editar</a></th>
                `;
                
                list.appendChild(tr);
            });
        });
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

// Fetch items on page load
fetchItems();