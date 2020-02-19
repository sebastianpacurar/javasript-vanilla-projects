'use strict';

const addButton = document.getElementById("addBtn");
const clearButton = document.getElementById("clearBtn");
const totalPriceButton = document.getElementById("calcSum");
const totalPriceParagraph = document.querySelector("p");
const buyList = document.getElementById("buyList");
const inputElement = document.getElementById("input");
const clearList = document.getElementById("completedList");
const table = document.getElementById("historyTable");

let products = {};


// if item already in list, only add random number to the already existing one
// arguments should be in this order: element, listItem, button
function overRideExistingItem() {
    let verified = false;
    for (let i = 0; i < arguments[0].children.length; i++) {
        if (arguments[0].children[i].firstChild.textContent.split(" ")[0] === inputElement.value) {
            let initialNum = parseInt(arguments[0].children[i].textContent.split(" ")[1]);
            const finalNum = String(initialNum += Math.floor(Math.random() * 100));
            arguments[0].children[i].firstChild.textContent = inputElement.value + ' ' + finalNum;

            if (arguments[0].id === 'buyList') {
                arguments[1].appendChild(arguments[2]);
            }
            inputElement.value = "";
            verified = true;
        }
    }
    return verified;
}

addButton.addEventListener("click", function () {
    const listItem = document.createElement("li");
    const itemName = document.createElement("div");

    const itemPrice = document.createElement("span");
    itemPrice.classList.add("itemPrice");

    const itemString = inputElement.value;
    const itemPriceValue = Math.trunc(Math.random() * 100);


    // if inserted value is empty, alert and exit function
    if (itemString === "") {
        alert("Please add proper item");
        return;
    }

    // add remove button
    const removeBtn = document.createElement("button");
    removeBtn.textContent = " Clear";

    if (overRideExistingItem(buyList, listItem, removeBtn)) {
        return;
    }

    // append itemName div to listItem li
    listItem.appendChild(itemName);
    itemName.textContent = itemString;

    // append itemPrice span to itemName div
    itemName.appendChild(itemPrice);
    itemPrice.textContent = ' ' + String(itemPriceValue);    // in order to be able to split we added an empty string

    // append remove button to list item
    listItem.appendChild(removeBtn);
    buyList.appendChild(listItem);

    // remove button deletes an element from Items needed to buy and appends it to Completed list
    removeBtn.addEventListener("click", function (e) {
        e = e.target;
        const clearItem = document.createElement("li");
        const itemName = document.createElement("div");

        const itemPrice = document.createElement("span");
        itemPrice.classList.add("itemPrice");   // add class for span

        clearList.appendChild(clearItem);   // append the li to ul

        // the entire item details
        const itemTitleAndPrice = e.parentElement.children[0].textContent.split(" ");

        // retrieve only price value which is the last element of the array
        const itemPriceValue = itemTitleAndPrice.slice(itemTitleAndPrice.length - 1);

        // retrieve item name
        const itemNameValue = function getNameValue() {
            itemTitleAndPrice.pop();
            return itemTitleAndPrice.join(" ");
        };

        // need to add textContent for div right after creation, otherwise it will override the span
        clearItem.appendChild(itemName);
        itemName.textContent = itemNameValue();

        // append span and add textContent
        itemName.appendChild(itemPrice);
        itemPrice.textContent = ' ' + String(itemPriceValue);   // in order to retrieve only price after split

        // remove the item from the "to buy" list which was triggered
        e.parentElement.remove();
    });

    inputElement.value = "";
});

clearButton.addEventListener("click", function () {
    if (clearList.hasChildNodes()) {
        while (clearList.children.length !== 0) {
            const row = table.insertRow(1);
            const nameRow = row.insertCell(0);
            const priceRow = row.insertCell(1);

            let data = clearList.children[0].textContent.split(" ");
            priceRow.textContent = data[data.length - 1];       // add only the price
            data.pop();                                         // remove the price from the array
            nameRow.textContent = data.join(" ");               // add only the name of the item
            clearList.children[0].remove();

            // add product name and price in the products object literal
            if (products[nameRow.textContent] !== undefined) {
                for (let prop in products) {
                    if (prop === nameRow.textContent) {
                        products[prop] += parseInt(priceRow.textContent);
                    }
                }
            } else {
                products[nameRow.textContent] = parseInt(priceRow.textContent);
            }
        }
    } else {
        alert("List is empty");
    }
});

totalPriceButton.addEventListener("click", function () {
    const prices = [];
    for (let prop in products) {
        prices.push(products[prop]);
    }

    // if no items in history throw alert;
    if (prices.length < 1) {
        alert("No items in history");
        return;
    }

    const getPrice = prices.reduce((a, b) => a + b);

    // if the price button is pressed twice without adding any items
    if (parseInt(totalPriceParagraph.children[0].textContent) === getPrice) {
        alert("No new items added to history");
    }

    // calculate total sum
    totalPriceParagraph.style.display = "block";
    totalPriceParagraph.children[0].textContent = getPrice;
});