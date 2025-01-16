
function validateInputs() {
  const nome = document.getElementById('r_nome').value.trim();
  const telemovel = document.getElementById('r_telemovel').value.trim();
  const dia = document.getElementById('dia').value.trim();
  const horario = document.getElementById('horario').value.trim();

  const warningMessage = document.getElementById('warning-message');
  let mesaselected = false;

  mesaselecionada.forEach(m => {
    if (m) {
      mesaselected = true;
    }
  });

  console.log(mesaselecionada);

  console.log(" nome: " + nome + " telemovel: " + telemovel + " dia: " + dia + " horario: " + horario + " mesa: " + mesaselected);
  if (!nome || !telemovel || !dia || !horario || !mesaselected || telemovel < "200000000" || telemovel > "999999999") {
    // Show warning message
    warningMessage.style.display = 'block';
  } else {
    // Hide warning message
    warningMessage.style.display = 'none';

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

/* const sections = document.querySelectorAll('.section');
const upButton = document.querySelector('.nav-button.up');
const downButton = document.querySelector('.nav-button.down');
const indicators = document.querySelectorAll('.indicator span');

let currentSection = 0;

function updateView() {
  // Scroll to the current section
  sections[currentSection].scrollIntoView({ behavior: 'smooth' });

  // Update indicator
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === currentSection);
  });
}

upButton.addEventListener('click', () => {
  if (currentSection > 0) {
    currentSection--;
    updateView();
  }
});

downButton.addEventListener('click', () => {
  if (currentSection < sections.length - 1) {
    currentSection++;
    updateView();
  }
});

// Initialize view
updateView(); */