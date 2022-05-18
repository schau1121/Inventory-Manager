const items_table = document.querySelector(".items-table");
const all_items_url = `${window.location.href.replace("items", "api/items")}`;
const new_item_btn = document.querySelector("button#new-item");
const new_overlay = document.querySelector(".new-overlay");
const edit_overlay = document.querySelector(".edit-overlay");
const edit_submit_btn = document.querySelector("button#edit-submit");
const new_submit_btn = document.querySelector("button#submit");

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

let curr_item_url;

getAllItems();

function createTable() {
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    let row_1 = document.createElement("tr");
    let heading_1 = document.createElement("th");
    heading_1.innerHTML = "Row No.";
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

function getAllItems() {
    fetch(all_items_url)
        .then(response => response.json())
        .then(data => {
            populateTable(data.items);
        });
}

function populateTable(items) {
    createTable();
    let tbody = document.querySelector("tbody");
    let row_num = 1;
    items.forEach(item => {
        let curr_row = document.createElement("tr");
        let curr_row_id = document.createElement("td");
        let curr_row_name = document.createElement("td");
        let curr_row_model = document.createElement("td");
        let curr_row_inventory = document.createElement("td");
        let curr_row_warehouse_id = document.createElement("td");
        let curr_row_warehouse = document.createElement("td");
        let curr_row_edit = document.createElement("td");
        let curr_row_edit_btn = document.createElement("button");
        let curr_row_del = document.createElement("td");
        let curr_row_del_btn = document.createElement("button");

        curr_row_id.innerHTML = row_num;
        curr_row_name.innerHTML = item.name;
        curr_row_model.innerHTML = item.model_num;
        curr_row_inventory.innerHTML = item.inventory;
        curr_row_warehouse_id.innerHTML = item.warehouse_id;
        curr_row_warehouse.innerHTML = item.warehouse;

        curr_row_edit_btn.innerHTML = "⁝";
        curr_row_edit_btn.id = `${item.name}&${item.warehouse_id}`;
        curr_row_edit_btn.addEventListener("click", e => {
            curr_item_url = e.target.id;
            openEditOverlay();
        })

        curr_row_del_btn.innerHTML = "×";
        curr_row_del_btn.id = `${item.name}&${item.warehouse_id}`;
        curr_row_del_btn.addEventListener("click", async function(e) {
            await deleteItem(e.target.id);
            refreshTable();
        })

        curr_row_edit.appendChild(curr_row_edit_btn);
        curr_row_del.appendChild(curr_row_del_btn);

        curr_row.appendChild(curr_row_id);
        curr_row.appendChild(curr_row_name);
        curr_row.appendChild(curr_row_model);
        curr_row.appendChild(curr_row_inventory);
        curr_row.appendChild(curr_row_warehouse_id);
        curr_row.appendChild(curr_row_warehouse);
        curr_row.appendChild(curr_row_edit);
        curr_row.appendChild(curr_row_del);

        tbody.appendChild(curr_row);
    })
}

async function deleteItem(url) {
    let item_url = `${window.location.href.replace("items?", `api/item/${url}`)}`;
    let del_response = fetch(item_url, {
        method: "DELETE"
    })

    return del_response;
}

async function putItem(item, url) {
    let item_url = `${window.location.href.replace("items", `api/item/${url}`)}`;
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

async function postItem(item) {
    let item_url = `${window.location.href.replace("item", `${item.name}&${item.warehouse_id}`)}`;
    let post_response = fetch(item_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(item)
    });

    return post_response;
}

function openEditOverlay() {
    edit_overlay.style.display = "flex";
}

function refreshTable() {
    items_table.innerHTML = "";
    getAllItems();
}

async function handleEditSubmit() {
    const new_model_num = document.querySelector("input#edit-item-model").value;
    const new_inventory = document.querySelector("input#edit-item-inventory").value;
    let edited_item = {
        "model_num": new_model_num,
        "inventory": new_inventory
    }
    await putItem(edited_item, curr_item_url);
    refreshTable();
}

async function handleNewSubmit() {
    let name = document.querySelector("input#item-name").value;
    let model = document.querySelector("input#item-model").value;
    let inventory = document.querySelector("input#item-inventory").value;
    let warehouse_id = document.querySelector("input#warehouse-num").value;
    let item = {
        "model_num": model,
        "inventory": inventory,
    }
    curr_item_url = `${name}&${warehouse_id}`;
    await postItem(item, curr_item_url);
    refreshTable();
}