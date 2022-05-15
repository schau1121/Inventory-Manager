const cards = document.querySelector(".cards");
const all_items_url = `${window.location.href}api/items`;
let itemList;

renderCards()

function createCard(item, quantity) {
    item = item[0].toUpperCase() + item.substring(1);

    if(cards.innerText === "Nothing to see here...for now!") {
        cards.innerText = "";
    }

    new_card = document.createElement("div");
    new_card_inventory = document.createElement("div");
    new_card.innerText = `${item} has low inventory!`;
    new_card.classList.add("dashboard-card");
    new_card_inventory.innerText = `There are only ${quantity} units left`;
    new_card_inventory.classList.add("dashboard-card-inventory");
    new_card.appendChild(new_card_inventory);
    cards.appendChild(new_card);
}

function getItems() {
    fetch(all_items_url)
        .then(response => response.json())
        .then(data => itemList = data.items);
}

function renderCards() {
    getItems();
    itemList.forEach(item => {
        if(item.inventory < 1000) {
            createCard(item.name, item.inventory);
        }
    });
}