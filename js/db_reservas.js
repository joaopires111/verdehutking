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
function vertodas() {

    fetch('../php/reservas/read.php')
        .then(response => response.json())
        .then(items => {
            itemstotal = items;
            const list = document.getElementById('todas_reservas');
            list.innerHTML = `

            <div class="rounded-3 border overflow-hidden mb-5">
            <table class="table table-hover table-bordered text-center align-middle">
            <thead>
            <th>id</th>
            <th>nome</th>
            <th>telemovel</th>
            <th>mesa</th>
            <th>dia</th>
            <th>horario</th>
            <th>apagar</th>
            </thead>
            <tbody id="table-body3"></tbody>
            </table>
            </div>
        `;

            // Get the tbody element for appending rows
            const tableBody = document.getElementById('table-body3');

            items.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.telemovel}</td>
                    <td>${item.mesa}</td>
                    <td>${item.dia}</td>
                    <td>${item.horario}</td>
                    <td>
                    <a class="btn btn-danger btn-block" onclick="openDeleteModal(${item.id})">apagar</a>
                    </td>
                    `;

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
            vertodas();
        });
}

function filtrardiahorario(dia, horario) {
    const list = document.getElementById('todas_reservas');
    list.innerHTML = `

    <div class="rounded-3 border overflow-hidden mb-5">
    <table class="table table-hover table-bordered text-center align-middle">
    <thead>
    <th>id</th>
    <th>nome</th>
    <th>telemovel</th>
    <th>mesa</th>
    <th>dia</th>
    <th>horario</th>
    <th>apagar</th>
    </thead>
    <tbody id="table-body3"></tbody>
    </table>
    </div>
`;
            // Get the tbody element for appending rows
            const tableBody = document.getElementById('table-body3');
    itemstotal.forEach(item => {

        if(item.dia == dia && item.horario == horario){
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.nome}</td>
        <td>${item.telemovel}</td>
        <td>${item.mesa}</td>
        <td>${item.dia}</td>
        <td>${item.horario}</td>
        <td>
        <a class="btn btn-danger btn-block" onclick="deleteReserv(${item.id})">apagar</a>
        </td>
        `;

        tableBody.appendChild(tr);
    }
    });
}

vertodas();