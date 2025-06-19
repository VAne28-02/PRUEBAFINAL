document.addEventListener('DOMContentLoaded', () => {
    const calculationsHistory = JSON.parse(localStorage.getItem('calculationsHistory')) || [];
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const editForm = document.getElementById('edit-form');

    if (id && calculationsHistory[id]) {
        document.getElementById('expression').value = calculationsHistory[id].expression;
        document.getElementById('result').value = calculationsHistory[id].result;

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const expression = document.getElementById('expression').value;
            const result = document.getElementById('result').value;

            calculationsHistory[id] = {
                expression,
                result,
                date: new Date().toLocaleString()
            };

            localStorage.setItem('calculationsHistory', JSON.stringify(calculationsHistory));
            window.location.href = 'read.html';
        });
    } else {
        window.location.href = 'read.html';
    }
});