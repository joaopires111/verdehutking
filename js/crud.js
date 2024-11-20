
function fetchItems() {
    fetch('../php/read.php')
        .then(response => response.json())
        .then(items => {
            const list = document.getElementById('items-list');
            list.innerHTML = '';
            items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${item.name}</strong>: ${item.description}
                    <button onclick="deleteItem(${item.id})">Delete</button>
                    <button onclick="prepareUpdate(${item.id}, '${item.name}', '${item.description}')">Edit</button>
                `;
                list.appendChild(li);
            });
        });
}

function createItem() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    fetch('../php/create.php', {
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
    fetch('../php/delete.php', {
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

    fetch('../php/update.php', {
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