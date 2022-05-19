const items_table = document.querySelector(".items-table");
const all_items_url = `${window.location.href.replace("items", "api/items")}`;
const new_item_btn = document.querySelector("button#new-item");
const new_overlay = document.querySelector(".new-overlay");
const edit_overlay = document.querySelector(".edit-overlay");
const edit_submit_btn = document.querySelector("button#edit-submit");
const new_submit_btn = document.querySelector("button#submit");
let curr_item_id;


new_item_btn.addEventListener("click", e => {
    new_overlay.style.display = "flex";
})

edit_submit_btn.addEventListener("click", e => {
    handleEditSubmit();
    edit_overlay.style.display = "none";
})

new_submit_btn.addEventListener("click", e => {
    handleNewSubmit();
    new_overlay.style.display = "none";
})

getAllItems();

// this function initializes the table for items and defines the header
function createTable() {
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    let row_1 = document.createElement("tr");
    let heading_0 = document.createElement("th");
    heading_0.innerHTML = "Row No.";
    let heading_1 = document.createElement("th");
    heading_1.innerHTML = "UUID";
    let heading_2 = document.createElement("th");
    heading_2.innerHTML = "Item Name";
    let heading_3 = document.createElement("th");
    heading_3.innerHTML = "Model No.";
    let heading_4 = document.createElement("th");
    heading_4.innerHTML = "Inventory";
    let heading_5 = document.createElement("th");
    heading_5.innerHTML = "Warehouse ID.";
    let heading_6 = document.createElement("th");
    heading_6.innerHTML = "Warehouse";
    let heading_7 = document.createElement("th");
    heading_7.innerHTML = "Edit";
    let heading_8 = document.createElement("th");
    heading_8.innerHTML = "Delete";

    row_1.appendChild(heading_0);
    row_1.appendChild(heading_1);
    row_1.appendChild(heading_2);
    row_1.appendChild(heading_3);
    row_1.appendChild(heading_4);
    row_1.appendChild(heading_5);
    row_1.appendChild(heading_6);
    row_1.appendChild(heading_7);
    row_1.appendChild(heading_8);
    thead.appendChild(row_1);

    table.appendChild(thead);
    table.appendChild(tbody);

    items_table.appendChild(table);
}

// this function fetches all items and calls populateTable with the items list
function getAllItems() {
    fetch(all_items_url)
        .then(response => response.json())
        .then(data => {
            populateTable(data.items);
        });
}

// this function populates the table item by item and initializes the event handlers for the edit/delete buttons
function populateTable(items) {
    createTable();
    let tbody = document.querySelector("tbody");
    let row_num = 1;
    items.forEach(item => {
        let curr_row = document.createElement("tr");
        let curr_row_num = document.createElement("td");
        let curr_row_uuid = document.createElement("td");
        let curr_row_name = document.createElement("td");
        let curr_row_model = document.createElement("td");
        let curr_row_inventory = document.createElement("td");
        let curr_row_warehouse_id = document.createElement("td");
        let curr_row_warehouse = document.createElement("td");
        let curr_row_edit = document.createElement("td");
        let curr_row_edit_btn = document.createElement("button");
        let curr_row_del = document.createElement("td");
        let curr_row_del_btn = document.createElement("button");

        curr_row_num.innerHTML = row_num;
        curr_row_uuid.innerHTML = item.uuid;
        curr_row_name.innerHTML = item.name;
        curr_row_model.innerHTML = item.model_num;
        curr_row_inventory.innerHTML = item.inventory;
        curr_row_warehouse_id.innerHTML = item.warehouse_id;
        curr_row_warehouse.innerHTML = item.warehouse;

        curr_row_edit_btn.innerHTML = "⁝";
        curr_row_edit_btn.id = item.uuid;
        curr_row_edit_btn.addEventListener("click", e => {
            curr_item_id = e.target.id;
            openEditOverlay(item);
        })

        curr_row_del_btn.innerHTML = "×";
        curr_row_del_btn.id = item.uuid;
        curr_row_del_btn.addEventListener("click", async function(e) {
            await deleteItem(e.target.id);
            refreshTable();
        })

        curr_row_edit.appendChild(curr_row_edit_btn);
        curr_row_del.appendChild(curr_row_del_btn);

        curr_row.appendChild(curr_row_num);
        curr_row.appendChild(curr_row_uuid);
        curr_row.appendChild(curr_row_name);
        curr_row.appendChild(curr_row_model);
        curr_row.appendChild(curr_row_inventory);
        curr_row.appendChild(curr_row_warehouse_id);
        curr_row.appendChild(curr_row_warehouse);
        curr_row.appendChild(curr_row_edit);
        curr_row.appendChild(curr_row_del);

        tbody.appendChild(curr_row);
        row_num++;
    })
}

// this function deletes the specified item through the internal api
async function deleteItem(id) {
    let item_url = `${window.location.href.replace("items", `api/item/${id}`)}`;
    let del_response = fetch(item_url, {
        method: "DELETE"
    });

    return del_response;
}

// this function edits the specified item through the internal api
async function putItem(item, id) {
    let item_url = `${window.location.href.replace("items", `api/item/${id}`)}`;
    console.log(item_url);
    let put_response = fetch(item_url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    return put_response;
}

// this function creates a new item through the internal api
async function postItem(item, id) {
    let item_url = `${window.location.href.replace("items", `api/item/${id}`)}`;
    let post_response = fetch(item_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    return post_response;
}

// this function opens the edit overlay and pre-fills the inputs with the current values
function openEditOverlay(item) {
    edit_overlay.style.display = "flex";
    document.querySelector("input#edit-item-name").value = item.name;
    document.querySelector("input#edit-item-model").value = item.model_num;
    document.querySelector("input#edit-item-inventory").value = item.inventory;
    document.querySelector("input#edit-item-warehouse-num").value = item.warehouse_id;
}

// this function refreshes the table
function refreshTable() {
    items_table.innerHTML = "";
    getAllItems();
}

// this function handles an submit request when editing an item
async function handleEditSubmit() {
    const new_name = document.querySelector("input#edit-item-name").value;
    const new_model_num = document.querySelector("input#edit-item-model").value;
    const new_inventory = document.querySelector("input#edit-item-inventory").value;
    const new_warehouse_id = document.querySelector("input#edit-item-warehouse-num").value;
    let edited_item = {
        "name": new_name,
        "model_num": new_model_num,
        "inventory": new_inventory,
        "warehouse_id": new_warehouse_id
    };
    await putItem(edited_item, curr_item_id);
    refreshTable();
}

/*
    This function handles the submit request when creating a new item
*/
async function handleNewSubmit() {
    const name = document.querySelector("input#item-name").value;
    const model = document.querySelector("input#item-model").value;
    const inventory = document.querySelector("input#item-inventory").value;
    const warehouse_id = document.querySelector("input#item-warehouse-num").value;
    let new_item = {
        "name": name,
        "model_num": model,
        "inventory": inventory,
        "warehouse_id": warehouse_id
    };
    curr_item_id = createUUID();
    await postItem(new_item, curr_item_id);
    refreshTable();
}

/*
    I'm utilizing this function instead of a UUID generator due since this
    project is written in vanilla js and I don't have enough time to figure
    out how to make modules work

    Need to change to something more secure

    this function generates a UUID for each item
*/
function createUUID(){
    let dt = new Date().getTime()
    
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (dt + Math.random()*16)%16 | 0
        dt = Math.floor(dt/16)
        return (c=='x' ? r :(r&0x3|0x8)).toString(16)
    })
    
    return uuid
}