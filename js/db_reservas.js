
let vertodason = false;


function toggleverreservas() {
    if (!vertodason) {
        vertodas();
        vertodason = true;
    }
    else if (vertodason) {
        vernenhuma();
        vertodason = false;
    }
}
function vertodas() {
    const dia = document.getElementById('dia').value;
    const horario = document.getElementById('horario').value;

    console.log(dia);
    console.log(horario);
    fetch('../php/reservas/read.php')
        .then(response => response.json())
        .then(items => {
            const list = document.getElementById('todas_reservas');
            list.innerHTML = `
            <div class="rounded-3 border overflow-hidden mt-2">
            <table class="table table-hover table-bordered text-center align-middle mb-0">
            <thead>
            <th>id</th>
            <th>nome</th>
            <th>telemovel</th>
            <th>mesa</th>
            <th>dia</th>
            <th>horario</th>
            <th>apagar</th>
            </thead>
            <tbody id="table-body2"></tbody>
            </table>
            </div>     
        `;

            // Get the tbody element for appending rows
            const tableBody = document.getElementById('table-body2');

            items.forEach(item => {

                if (item.dia == dia && item.horario == horario) {

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.nome}</td>
                    <td>${item.telemovel}</td>
                    <td>${item.mesa}</td>
                    <td>${item.dia}</td>
                    <td>${item.horario}</td>
                    <td>
                    <a class="btn btn-danger" onclick="deleteReserv(${item.id})">apagar</a>
                    </td>
                    `;

                    tableBody.appendChild(tr);

                }
            });
        })
        .catch(error => console.error('Error fetching items:', error));
}
function vernenhuma() {
    const list = document.getElementById('todas_reservas');
    list.innerHTML = ``;
}
function updatetodas(){
    if(vertodas){
        vertodas();
    }
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


