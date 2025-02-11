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
let itemstotal;

//tabela admin crud
function fetchItems1() {
    fetch('../php/pratos_dia/read.php')
        .then(response => response.json())
        .then(items => {
            itemstotal = items;
            const list = document.getElementById('items-list2');

            // Build the table structure
            list.innerHTML = `
            <div class="rounded-4 border overflow-hidden">
            <table class="table table-hover table-bordered  table-striped text-center align-middle">
                <thead class="table-success">
                    <tr>
                <th>ID</th>
                <th>Nome Quente</th>
                <th></th>
                <th>Nome Salada</th>
                <th></th>
                <th>Nome Entrada</th>
                <th></th>
                <th>Dia</th>
                <th>Horário</th>
                <th></th>
                    </tr>
                </thead>
                <tbody id="table-body2"></tbody>
            </table>
            </div>`;

            // Get the tbody element for appending rows
            const tableBody = document.getElementById('table-body2');

            // Loop through items and add rows
            items.forEach(item => {

                const date = new Date(item.dia); // Convert string to Date
                const day = date.getDate().toString().padStart(2, '0'); 
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
                const year = date.getFullYear();
                
                const formattedDate = `${day}-${month}-${year}`;
                console.log(formattedDate);

                const tr = document.createElement('tr');
                tr.innerHTML = `

                    <td>${item.id}</td>
                    <td>${item.quente_nome}</td>
                    <td><img src="${item.quente_image}" width="100" height="100"></td>
                    <td>${item.salada_nome}</td>
                    <td><img src="${item.salada_image}" width="100" height="100"></td>
                    <td>${item.entrada_nome}</td>
                    <td><img src="${item.entrada_image}" width="100" height="100"></td>
                    <td>${formattedDate}</td>
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
function fetchItems2() {
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

    let cancel = false;
    //verificar pratos repetidos
    fetch('../php/pratos_dia/read.php')
        .then(response => response.json())
        .then(items => {
            items.forEach(item => {
                if (item.dia == dia && item.horario == horario) {
                    document.getElementById('aviso-dia-horario').hidden = false;
                    document.getElementById('aviso-prato-criado').hidden = true;
                    cancel = true;
                }
            });
            if(!cancel){
                document.getElementById('aviso-dia-horario').hidden = true;
                document.getElementById('aviso-prato-criado').hidden = false;
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
        })
        .catch(error => console.error('Error:', error));


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
function vertodoscard(dia, horario) {
    fetch('../php/pratos_dia/read.php')
        .then(response => response.json())
        .then(items => {
            const pratosDiaDiv = document.getElementById('pratos_dia');
            pratosDiaDiv.innerHTML = ''; // Clear previous cards if any
            items.forEach(item => {
                if (item.dia == dia && item.horario == horario) {
                    // Create 3 separate cards for each attribute (quente, salada, entrada)

                    // Card for quente_nome
                    const quenteCard = document.createElement('div');
                    quenteCard.classList.add('col-md-4', 'm-0', 'p-0');
                    quenteCard.innerHTML = `
                        <div class="text-center m-0 p-0">
                            <h6 class="mb-2 bold">${item.quente_nome}</h6>
                            <img src="${item.quente_image}" class="img-fluid square-img clickable-image" alt="Quente Image" width="80%" height="80%">
                        </div>
                    `;

                    // Card for salada_nome
                    const saladaCard = document.createElement('div');
                    saladaCard.classList.add('col-md-4', 'm-0', 'p-0');
                    saladaCard.innerHTML = `
                        <div class="text-center m-0 p-0">
                            <h6 class="mb-2 bold">${item.salada_nome}</h6>
                            <img src="${item.salada_image}" class="img-fluid square-img clickable-image" alt="Salada Image" width="80%" height="80%">
                        </div>
                    `;

                    // Card for entrada_nome
                    const entradaCard = document.createElement('div');
                    entradaCard.classList.add('col-md-4', 'm-0', 'p-0');
                    entradaCard.innerHTML = `
                        <div class="text-center m-0 p-0">
                            <h6 class="mb-2 bold">${item.entrada_nome}</h6>
                            <img src="${item.entrada_image}" class="img-fluid square-img clickable-image" alt="Entrada Image" width="80%" height="80%">
                        </div>
                    `;

                    // Add click event listener to open modal
                    let imageElement = quenteCard.querySelector('.clickable-image');
                    imageElement.addEventListener('click', function () {
                        document.getElementById('modalImage').src = this.src;
                        document.getElementById('imageModalLabel').innerText = item.quente_nome; // Set modal title
                        document.getElementById('igredientes_h6').innerText = item.quente_ingredientes;
                        var myModal = new bootstrap.Modal(document.getElementById('imageModal'));
                        myModal.show();
                    });
                    // Add click event listener to open modal
                    imageElement = saladaCard.querySelector('.clickable-image');
                    imageElement.addEventListener('click', function () {
                        document.getElementById('modalImage').src = this.src;
                        document.getElementById('imageModalLabel').innerText = item.salada_nome; // Set modal title
                        document.getElementById('igredientes_h6').innerText = item.salada_ingredientes;
                        var myModal = new bootstrap.Modal(document.getElementById('imageModal'));
                        myModal.show();
                    });
                    // Add click event listener to open modal
                    imageElement = entradaCard.querySelector('.clickable-image');
                    imageElement.addEventListener('click', function () {
                        document.getElementById('modalImage').src = this.src;
                        document.getElementById('imageModalLabel').innerText = item.entrada_nome; // Set modal title
                        document.getElementById('igredientes_h6').innerText = item.entrada_ingredientes;
                        var myModal = new bootstrap.Modal(document.getElementById('imageModal'));
                        myModal.show();
                    });


                    // Append the 3 cards to the pratos_dia div
                    pratosDiaDiv.appendChild(quenteCard);
                    pratosDiaDiv.appendChild(saladaCard);
                    pratosDiaDiv.appendChild(entradaCard);
                }
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}

function filtrardiahorario(dia, horario){

    const list = document.getElementById('items-list2');

    // Build the table structure
    list.innerHTML = `
    <div class="rounded-3 border overflow-hidden">
    <table class="table table-hover table-bordered text-center align-middle mb-0">
        <thead class="table-success">
            <tr>
                <th>ID</th>
                <th>Nome Quente</th>
                <th></th>
                <th>Nome Salada</th>
                <th></th>
                <th>Nome Entrada</th>
                <th></th>
                <th>Dia</th>
                <th>Horário</th>
                <th></th>
            </tr>
        </thead>
        <tbody id="table-body2"></tbody>
    </table>
    </div>`;

    // Get the tbody element for appending rows
    const tableBody = document.getElementById('table-body2');

    // Loop through items and add rows
    itemstotal.forEach(item => {

        if(item.dia == dia && item.horario == horario){
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
    }
});
}