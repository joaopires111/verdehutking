
function validateInputs() {
  const nome = document.getElementById('r_nome').value;
  const telemovel = document.getElementById('r_telemovel').value;
  const dia = document.getElementById('dia').value;
  const horario = document.getElementById('horario').value;

  const warningMessage = document.getElementById('warning-message');
  let mesaselected = false;

  mesaselecionada.forEach(m => {
    if (m) {
      mesaselected = true;
    }
  });



  console.log(" nome: " + nome + " telemovel: " + telemovel + " dia: " + dia + " horario: " + horario + " mesa: " + mesaselected);
  if (!nome || !telemovel || !dia || !horario || !mesaselected || telemovel < 200000000 || telemovel > 999999999) {
    // Show warning message
    warningMessage.style.display = 'block';
  } else {
    // Hide warning message
    warningMessage.style.display = 'none';

    console.log(nome,
      telemovel,
      dia,
      horario);
    // Proceed with the "validar" logic
    fazerreserva(
      nome,
      telemovel,
      dia,
      horario
    );

    // Close modal manually if needed
    $('#exampleModalCenter').modal('hide');
    $('#exampleModalCenter2').modal('show');
  }

}
