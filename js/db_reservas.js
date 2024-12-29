
let vertodason = false;


function toggleverreservas(){
    if (!vertodason){
        vertodas();
        vertodason = true;
    }
    else if (vertodason){
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
            <thead>
            <th>id</th>
            <th>nome</th>
            <th>telemovel</th>
            <th>mesa</th>
            <th>dia</th>
            <th>horario</th>
            </thead>     
        `;
            items.forEach(item => {

                if(item.dia == dia && item.horario == horario){

                const tr = document.createElement('tr');
                tr.innerHTML = `
                <tbody>
                    <th>${item.id}</th><th>${item.nome}</th><th>${item.telemovel}</th><th>${item.mesa}</th><th>${item.dia}</th><th>${item.horario}</th>
                    <th><a class="btn btn-success btn-xl mt-5" onclick="deleteReserv(${item.id})">apagar</a></th>
                </tbody>
                    `;

                list.appendChild(tr);
            
                }
            });
        });
}
function vernenhuma() {
    const list = document.getElementById('todas_reservas');
    list.innerHTML = ``;
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


