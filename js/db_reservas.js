
    document.getElementById('dynamicDropdown').addEventListener('change', function () {
        const selectedValue = this.value;

        // Create an AJAX request
        fetch('process_selection.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ selected: selectedValue })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server Response:', data);
            // Handle the response
        })
        .catch(error => console.error('Error:', error));
    });