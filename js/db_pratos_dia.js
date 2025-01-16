
    let vertodoson = false;


function togglepratosdia() {
    if (!vertodoson) {
        vertodos();
        vertodoson = true;
    }
    else if (vertodoson) {
        vernenhum();
        vertodoson = false;
    }
}
function vertodos() {
    const dia = document.getElementById('dia').value;
    const horario = document.getElementById('horario').value;

    console.log(dia);
    console.log(horario);
    fetch('../php/pratos_dia/read.php')
        .then(response => response.json())
        .then(items => {
            const list = document.getElementById('todos_pratos_dia');
            list.innerHTML = `
            <div class="rounded-3 border overflow-hidden mt-2">
            <table class="table table-hover table-bordered text-center align-middle mb-0">
            <thead>
            <th>id</th>
            <th>prato quente</th>
            <th>salada</th>
            <th>entrada</th>
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

                if (item.dia == dia && item.horario == horario) {

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.id_prato_quente}</td>
                    <td>${item.id_salada}</td>
                    <td>${item.id_entrada}</td>
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
function vernenhum() {
    const list = document.getElementById('todos_pratos_dia');
    list.innerHTML = ``;
}
function updatetodos(){
    if(vertodoson){
        vertodos();
    }
}

function deleteReserv(id) {
    fetch('../php/pratos_dia/delete.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            vertodos();
        });
}


