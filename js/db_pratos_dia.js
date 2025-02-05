function modalload() {
    let deletedia = null; // Store the item ID to delete

    // Function to open the modal and store the ID
    function openDeleteModal(id) {
        deletedia = id; // Store the ID of the item to delete
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    // Function to delete the item when "Delete" is clicked in the modal
    function deleteModal() {
        if (deletedia !== null) {
            deleteItem2(deletedia); // Call the delete function
            deletedia = null; // Reset ID
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

//tabela admin crud
function fetchItems1() {
    fetch('../php/pratos_dia/read.php')
        .then(response => response.json())
        .then(items => {
            const list = document.getElementById('items-list2');

            // Build the table structure
            list.innerHTML = `
            <div class="rounded-3 border overflow-hidden">
            <table class="table table-hover table-bordered text-center align-middle mb-0">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>nome quente</th>
                        <th>imagem</th>
                        <th>nome salada</th>
                        <th>imagem</th>
                        <th>nome entrada</th>
                        <th>imagem</th>
                        <th>dia</th>
                        <th>horario</th>
                        <th>apagar</th>
                    </tr>
                </thead>
                <tbody id="table-body2"></tbody>
            </table>
            </div>`;

            // Get the tbody element for appending rows
            const tableBody = document.getElementById('table-body2');

            // Loop through items and add rows
            items.forEach(item => {

                console.log(item.quente_image); // Debugging

                const tr = document.createElement('tr');
                tr.innerHTML = `

                    <td>${item.id}</td>
                    <td>${item.quente_nome}</td>
                    <td><img src="${item.quente_image}" width="100" height="100"></td>
                    <td>${item.salada_nome}</td>
                    <td><img src="${item.salada_image}" width="100" height="100"></td>
                    <td>${item.entrada_nome}</td>
                    <td><img src="${item.entrada_image}" width="100" height="100"></td>
                    <td>${item.dia}</td>
                    <td>${item.horario}</td>                    
                    <td>
                    <a class="btn btn-danger" onclick="openDeleteModal(${item.id})">apagar</a>
                    </td>`;
                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}


//tabela crud criar prato dia
function fetchItems2(){
    fetch('../php/pratos/read.php')
    .then(response => response.json())
    .then(items2 => {
        const quente_select = document.getElementById('quente2');
        const salada_select = document.getElementById('salada2');
        const entrada_select = document.getElementById('entrada2');
        items2.forEach(item2 => {
            let option = document.createElement('option');
        if (item2.tipo == "quente") {
            option.value = item2.id;
            option.innerHTML = `${item2.nome}`;
            quente_select.appendChild(option);
        }
        if (item2.tipo == "salada") {   
            option.value = item2.id;
            option.innerHTML = `${item2.nome}`;
            salada_select.appendChild(option);
        }
        if (item2.tipo == "entrada") {
            option.value = item2.id;
            option.innerHTML = `${item2.nome}`;
            entrada_select.appendChild(option);
        }
        });
    })
    .catch(error => console.error('Error fetching items2:', error));
}


function createItem2() {
    const quente = document.getElementById('quente2').value;
    const salada = document.getElementById('salada2').value;
    const entrada = document.getElementById('entrada2').value;
    const dia = document.getElementById('dia2').value;
    const horario = document.getElementById('horario2').value;

    fetch('../php/pratos_dia/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quente, salada, entrada, dia, horario })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchItems1();
        })
        .catch(error => console.error('Error creating ?:', error));
}

function deleteItem2(id) {
    fetch('../php/pratos_dia/delete.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            fetchItems1();
        });
}


//pagina inicial
function vertodoscard() {
    const dia = document.getElementById('dia').value;
    const horario = document.getElementById('horario').value;


    fetch('../php/pratos_dia/read.php')
        .then(response => response.json())
        .then(items => {
            const pratosDiaDiv = document.getElementById('pratos_dia');
            pratosDiaDiv.innerHTML = ''; // Clear previous cards if any

            items.forEach(item => {
                console.log(item.quente_nome);

                if (item.dia == dia && item.horario == horario) {
                    // Create 3 separate cards for each attribute (quente, salada, entrada)

                    // Card for quente_nome
                    const quenteCard = document.createElement('div');
                    quenteCard.classList.add('card', 'mb-3', 'col-md-4', 'p-2');
                    quenteCard.innerHTML = `
                        <div class="card-body text-center m-2">
                            <h5 class="card-title">${item.quente_nome}</h5>
                            <img src="${item.quente_image}" class="mt-3" alt="Quente Image" width="80%" height="80%">
                        </div>
                    `;

                    // Card for salada_nome
                    const saladaCard = document.createElement('div');
                    saladaCard.classList.add('card', 'mb-3', 'col-md-4', 'p-2');
                    saladaCard.innerHTML = `
                        <div class="card-body text-center">
                            <h5 class="card-title">${item.salada_nome}</h5>
                            <img src="${item.salada_image}" class="mt-3" alt="Salada Image" width="80%" height="80%">
                        </div>
                    `;

                    // Card for entrada_nome
                    const entradaCard = document.createElement('div');
                    entradaCard.classList.add('card', 'mb-3', 'col-md-4', 'p-2');
                    entradaCard.innerHTML = `
                        <div class="card-body text-center">
                            <h5 class="card-title">${item.entrada_nome}</h5>
                            <img src="${item.entrada_image}" class="mt-3" alt="Entrada Image" width="80%" height="80%">
                        </div>
                    `;

                    // Append the 3 cards to the pratos_dia div
                    pratosDiaDiv.appendChild(quenteCard);
                    pratosDiaDiv.appendChild(saladaCard);
                    pratosDiaDiv.appendChild(entradaCard);
                }
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}