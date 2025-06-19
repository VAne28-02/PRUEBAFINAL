document.addEventListener('DOMContentLoaded', () => {
    const calculationsHistory = JSON.parse(localStorage.getItem('calculationsHistory')) || [];
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const calculationDetails = document.getElementById('calculation-details');
    const confirmDelete = document.getElementById('confirm-delete');

    if (id && calculationsHistory[id]) {
        calculationDetails.innerHTML = `
            <p><strong>${calculationsHistory[id].expression} = ${calculationsHistory[id].result}</strong></p>
            <small>${calculationsHistory[id].date}</small>
        `;

        confirmDelete.addEventListener('click', () => {
            calculationsHistory.splice(id, 1);
            localStorage.setItem('calculationsHistory', JSON.stringify(calculationsHistory));
            window.location.href = 'read.html';
        });
    } else {
        window.location.href = 'read.html';
    }
});