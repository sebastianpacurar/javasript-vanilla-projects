'use strict';

const list = document.querySelector('#products-list'),
    form = document.forms['add-item'];


list.addEventListener('click', e => {

    if (e.target.className === 'remove-btn') {
        const listItem = e.target.parentNode;
        list.removeChild(listItem);
    }
});


form.addEventListener('submit', (e) => {
    e.preventDefault();

    const input = form.querySelector('#addInput'),
        product = input.value.trim();

    if (product.length > 1) {

        const listItem = document.createElement('LI');
        listItem.textContent = product;

        const removeBtn = document.createElement('SPAN');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');

        const addBtn = document.createElement('SPAN');
        addBtn.textContent = 'Add';
        addBtn.classList.add('add-btn');

        listItem.appendChild(addBtn);
        listItem.appendChild(removeBtn);

        list.appendChild(listItem);

        input.value = '';
    }
});