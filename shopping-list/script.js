'use strict';

const list = document.querySelector('#products-list'),
    form = document.forms['add-item'],
    table = document.querySelector('table'),
    boughtItems = {};


const formatPrice = (price) => {
    if (price.length > 0) {
        return `$${parseFloat(price).toFixed(2)}`;
    } else {
        return `$${(Math.random() * 20).toFixed(2)}`;
    }
}

/*
   in case the event target className is remove-btn-list, remove entire list item.
   if className is buy-btn, then add a new row in table with product name and its price,
     if item already exists in table, simply add the price to the existing price
*/
list.addEventListener('click', e => {

    if (e.target.className === 'remove-btn-list') {
        const listItem = e.target.parentNode;
        list.removeChild(listItem);
    }

    if (e.target.className === 'buy-btn') {
        table.style.visibility = 'visible';

        // set insertRow index to 1, otherwise it places the row above the table header
        const row = table.insertRow(1),
            nameCell = row.insertCell(0),
            priceCell = row.insertCell(1);


        // the first cell will contain the product name and a span meant to remove the row from table
        nameCell.innerHTML =
            `${e.target.parentNode.querySelector('.product-name').textContent} 
                <span class="remove-btn-table">x</span>`;

        priceCell.textContent = e.target.parentNode.querySelector('.product-price').textContent;


        // add the item to boughtItems object. if it exists, add only the price to existent price
        boughtItems[nameCell.textContent] = priceCell.textContent;
    }
});


// simply put, an entire list item is created along with all its inner elements
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const productInput = form.querySelector('#addInput').value.trim(),
        priceInput = form.querySelector('#addPrice').value.trim();

    if (productInput.length > 1) {

        const listItem = document.createElement('LI');

        const removeBtn = document.createElement('SPAN');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn-list');

        const addBtn = document.createElement('SPAN');
        addBtn.textContent = 'Buy';
        addBtn.classList.add('buy-btn');

        const price = document.createElement('SPAN');
        price.classList.add('product-price');
        price.textContent = formatPrice(priceInput);

        const productName = document.createElement('SPAN');
        productName.classList.add('product-name');
        productName.textContent = productInput;

        listItem.appendChild(productName);
        listItem.appendChild(price);
        listItem.appendChild(removeBtn);
        listItem.appendChild(addBtn);

        list.appendChild(listItem);

        form.querySelector('#addInput').value = '';
        form.querySelector('#addPrice').value = '';
    }
});


