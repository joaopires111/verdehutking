function modalload() {
    let deletedia = null;

    function openDeleteModal(id) {
        deletedia = id;
        const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    }

    function deleteModal() {
        if (deletedia !== null) {
            deleteReserv(deletedia);
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



let itemstotal;
let filtroON = false;
let filtrodia = null;
let filtrohorario = null;

function vertodas() {
    filtroON = false;
    filtrodia = null;
    filtrohorario = null;

    fetch('../php/reservas/read.php')
        .then(response => response.json())
        .then(items => {
            itemstotal = items;
            const list = document.getElementById('todas_reservas');
            list.innerHTML = `

            <div class="rounded-4 border overflow-hidden mb-5">
            <table class="table table-hover table-bordered  table-striped text-center align-middle">
            <thead class="table-success">
            <th>ID</th>
            <th>Nome</th>
            <th>Telemovel</th>
            <th>Mesa</th>
            <th>Dia</th>
            <th>Horário</th>
            <th></th>
            </thead>
            <tbody id="table-body3"></tbody>
            </table>
            </div>
        `;

            // Get the tbody element for appending rows
            const tableBody = document.getElementById('table-body3');

            items.forEach(item => {

                const date = new Date(item.dia); // Convert string to Date
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();

                const formattedDate = `${day}-${month}-${year}`;

                let tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.telemovel}</td>
                    <td>${item.mesa}</td>
                    <td>${formattedDate}</td>
                    <td>${item.horario}</td>
                    <td>
                    <a class="btn btn-danger btn-block" onclick="openDeleteModal(${item.id})">apagar</a>
                    </td>
                    `;

                // Add hover event listeners
                tr.addEventListener('mouseover', function () {
                    linhahover(item.mesa);
                });

                tr.addEventListener('mouseout', function () {
                    linhahoverout(item.mesa);
                });

                tableBody.appendChild(tr);

            });
        })
        .catch(error => console.error('Error fetching items:', error));
}

function deleteReserv(id) {
    fetch('../php/reservas/delete.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            if (filtroON) {

                filtrardiahorario(filtrodia, filtrohorario);
            } else {
                vertodas();
            }
        });
}

function filtrardiahorario(dia, horario) {
    filtrodia = dia;
    filtrohorario = horario;
    filtroON = true;

    fetch('../php/reservas/read.php')
        .then(response => response.json())
        .then(items => {
            itemstotal = items;
            const list = document.getElementById('todas_reservas');
            list.innerHTML = `

            <div class="rounded-4 border overflow-hidden mb-5">
            <table class="table table-hover table-bordered  table-striped text-center align-middle">
            <thead class="table-success">
            <th>ID</th>
            <th>Nome</th>
            <th>Telemovel</th>
            <th>Mesa</th>
            <th>Dia</th>
            <th>Horário</th>
            <th></th>
            </thead>
            <tbody id="table-body3"></tbody>
            </table>
            </div>
        `;

            // Get the tbody element for appending rows
            const tableBody = document.getElementById('table-body3');

            items.forEach(item => {

                if (item.dia == dia && item.horario == horario) {

                    const date = new Date(item.dia); // Convert string to Date
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();

                    const formattedDate = `${day}-${month}-${year}`;
                    console.log(formattedDate);

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.telemovel}</td>
                    <td>${item.mesa}</td>
                    <td>${formattedDate}</td>
                    <td>${item.horario}</td>
                    <td>
                    <a class="btn btn-danger btn-block" onclick="openDeleteModal(${item.id})">apagar</a>
                    </td>
                    `;
                                    // Add hover event listeners
                tr.addEventListener('mouseover', function () {
                    linhahover(item.mesa);
                });

                tr.addEventListener('mouseout', function () {
                    linhahoveroutred(item.mesa);
                });

                    tableBody.appendChild(tr);
                }
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}




vertodas();