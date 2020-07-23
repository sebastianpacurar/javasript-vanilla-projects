'use strict';

const list = document.getElementById('products-list'),
    listItems = document.getElementsByTagName('li'),
    emptyListNotification = document.getElementById('is-list-empty'),
    form = document.forms['add-item'],
    table = document.querySelector('table'),
    tbody = document.querySelector('tbody'),
    tfoot = document.querySelector('tfoot'),
    tableProductCells = document.getElementsByClassName('product-cell'),
    tableQuantityCells = document.getElementsByClassName('quantity-cell'),
    tablePriceCells = document.getElementsByClassName('price-cell');


const isListEmpty = () => {
    if (listItems.length === 0) {
        emptyListNotification.style.display = 'block';
        list.style.visibility = 'hidden';
    } else {
        emptyListNotification.style.display = 'none';
        list.style.visibility = 'visible';
    }
};


/*
   hide the list check if there are no items, and add footer row and cells only once,
     right when the program runs using an IIFE
*/
(() => {
    if (listItems.length === 0) {
        emptyListNotification.style.visibility = 'visible';
        list.style.visibility = 'hidden';
    }

    // add table row and cells for footer
    const footerRow = tfoot.insertRow(0),
        totalCell = footerRow.insertCell(0),
        totalQuantityCell = footerRow.insertCell(1),
        totalPriceCell = footerRow.insertCell(2);

    totalCell.id = 'total-footer';
    totalQuantityCell.id = 'quantity-footer';
    totalPriceCell.id = 'price-footer';
})();


const formatPrice = (price) => {
    if (price.length > 0) {
        return `$${parseFloat(price).toFixed(2)}`;
    } else {
        return `$${((Math.random() * 20) + 1).toFixed(2)}`;
    }
};


const calculateTotal = () => {
    /*
    map the quantity and totalPrices into arrays,
      and then use reduce over their values to get overall quantity and price
 */
    const totalQuantity = Array.from(tableQuantityCells).map(item => parseInt(item.textContent)),
        totalPrice = Array.from(tablePriceCells).map(item => parseFloat(item.textContent.split('$')[1]));

    document.getElementById('total-footer').textContent = 'TOTAL';
    document.getElementById('quantity-footer').textContent =
        (totalQuantity.reduce((acc, val) => acc + val, 0)).toString();

    document.getElementById('price-footer').textContent =
        `$${totalPrice.reduce((acc, val) => acc + val, 0).toFixed(2)}`;
}


/*
   in case the event target className is remove-btn-list, remove entire list item.
   if className is buy-btn, then add a new row in table with product name and its price,
     if item already exists in table, simply add the price to the existing price
*/
list.addEventListener('click', e => {

        const listItem = e.target.parentNode;

        if (e.target.className === 'remove-btn-list') {
            list.removeChild(listItem);

        } else if (e.target.className === 'buy-btn') {
            list.removeChild(listItem);
            document.querySelector('table').style.visibility = 'visible';

            const boughtProductName = e.target.parentNode.querySelector('.product-name').textContent;
            const boughtProductPrice = e.target.parentNode.querySelector('.product-price').textContent;

            // add all the textContent of the product table cells into an array
            const existentProducts = Array.from(tableProductCells).map(item => (item.textContent.slice(0, item.textContent.length - 1)))

            /*
               the following conditions evaluates if every item is different from the bought item, or existent
                 it returns false if at least one is false, and proceeds with creating a new table row,
                 otherwise it will update the existing table cell by adding the price and quantity to existent ones
             */
            if (existentProducts.every(item => item !== boughtProductName) || existentProducts.length === 0) {
                const row = tbody.insertRow(0),
                    nameCell = row.insertCell(0),
                    quantityCell = row.insertCell(1),
                    priceCell = row.insertCell(2);

                nameCell.classList.add('product-cell');
                quantityCell.classList.add('quantity-cell');
                priceCell.classList.add('price-cell');


                // the first cell will contain the product name and a span meant to remove the row from table
                nameCell.innerHTML = `${boughtProductName}<span class="remove-btn-table">x</span>`;
                quantityCell.textContent = '1';
                priceCell.textContent = boughtProductPrice;

            } else {

                // if item is already present in table, make sum between the initial price and new price, and increase quantity by one
                for (let prod of tableProductCells) {
                    const parsedProd = prod.textContent.slice(0, prod.textContent.length - 1)

                    if (parsedProd === boughtProductName) {
                        const row = prod.parentNode;

                        for (let cell of row.children) {
                            if (cell.className === 'price-cell') {
                                const initialPrice = parseFloat(cell.textContent.split('$')[1]);
                                const newPrice = parseFloat(e.target.parentNode.querySelector('.product-price').textContent.split('$')[1]);
                                cell.textContent = `$${(initialPrice + newPrice).toFixed(2)}`;
                            }

                            if (cell.className === 'quantity-cell') {
                                cell.textContent = (parseInt(cell.textContent) + 1).toString();
                            }
                        }
                    }
                }
            }
            calculateTotal();
        }
        isListEmpty();
    }
);


// simply put, an entire list item is created along with all its inner elements
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const productInput = form.querySelector('#addInput').value.trim(),
        priceInput = form.querySelector('#addPrice').value.trim();

    if (productInput.length > 0) {

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
        productName.textContent = productInput.toLowerCase();

        listItem.appendChild(productName);
        listItem.appendChild(price);
        listItem.appendChild(removeBtn);
        listItem.appendChild(addBtn);

        list.appendChild(listItem);

        form.querySelector('#addInput').value = '';
        form.querySelector('#addPrice').value = '';
    }
    isListEmpty();
});


// whenever the x span is clicked on any of the row, remove that row from the table along with its entry in the boughtItems object literal
tbody.addEventListener('click', e => {
    if (e.target.className === 'remove-btn-table') {
        const tableRow = e.target.parentNode.parentNode;
        tbody.removeChild(tableRow);

        calculateTotal();

        // if there are no products in table, hide the table
        if (tableProductCells.length === 0) {
            table.style.visibility = 'hidden';
        }
    }
});
