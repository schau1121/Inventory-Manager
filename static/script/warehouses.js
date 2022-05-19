const warehouses_table = document.querySelector(".warehouses-table");
const get_warehouses_url = `${window.location.href.replace("warehouses", "api/warehouses")}`;
const new_warehouse_btn = document.querySelector("button#new-warehouse");
const new_warehouse_overlay = document.querySelector(".new-overlay");
const new_warehouse_submit_btn = document.querySelector("button#submit");

new_warehouse_btn.addEventListener("click", e => {
    new_warehouse_overlay.style.display = "flex";
});

new_warehouse_submit_btn.addEventListener("click", e => {
    handleNewWarehouseSubmit();
    new_warehouse_overlay.style.display = "none";
})

getAllWarehouses();

function createWarehouseTable() {
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    let row_1 = document.createElement("tr");
    let heading_1 = document.createElement("th");
    heading_1.innerHTML = "Warehouse ID.";
    let heading_2 = document.createElement("th");
    heading_2.innerHTML = "Warehouse Name";
    let heading_3 = document.createElement("th");
    heading_3.innerHTML = "Location";
    let heading_4 = document.createElement("th");
    heading_4.innerHTML = "No. of Items";
    let heading_5 = document.createElement("th");
    heading_5.innerHTML = "Total Stock";
    let heading_6 = document.createElement("th");
    heading_6.innerHTML = "Delete";

    row_1.appendChild(heading_1);
    row_1.appendChild(heading_2);
    row_1.appendChild(heading_3);
    row_1.appendChild(heading_4);
    row_1.appendChild(heading_5);
    row_1.appendChild(heading_6);
    thead.appendChild(row_1);

    table.appendChild(thead);
    table.appendChild(tbody);

    warehouses_table.appendChild(table);
}

function getAllWarehouses() {
    fetch(get_warehouses_url)
        .then(response => response.json())
        .then(data => {
            populateWarehouseTable(data.warehouses);
        })
}

function populateWarehouseTable(warehouses) {
    createWarehouseTable();
    let tbody = document.querySelector("tbody");
    warehouses.forEach(warehouse => {
        let curr_row = document.createElement("tr");
        let curr_row_id = document.createElement("td");
        let curr_row_name = document.createElement("td");
        let curr_row_location= document.createElement("td");
        let curr_row_items = document.createElement("td");
        let curr_row_stock = document.createElement("td");
        let curr_row_del = document.createElement("td");
        let curr_row_del_btn = document.createElement("button");

        curr_row_id.innerHTML = warehouse.id;
        curr_row_name.innerHTML = warehouse.name;
        curr_row_location.innerHTML = warehouse.location;
        curr_row_items.innerHTML = warehouse.items.length;
        curr_row_stock.innerHTML = warehouse.items.reduce((total, item) => {
            return total + item.inventory;
        }, 0);

        curr_row_del_btn.innerHTML = "×";
        curr_row_del_btn.id = warehouse.name;
        curr_row_del_btn.addEventListener("click", async function(e) {
            await deleteWarehouse(e.target.id);
            refreshWarehouseTable();
        })
        curr_row_del.appendChild(curr_row_del_btn);

        curr_row.appendChild(curr_row_id);
        curr_row.appendChild(curr_row_name);
        curr_row.appendChild(curr_row_location);
        curr_row.appendChild(curr_row_items);
        curr_row.appendChild(curr_row_stock);
        curr_row.appendChild(curr_row_del);

        tbody.appendChild(curr_row);
    })
}

async function deleteWarehouse(name) {
    let warehouse_url = `${window.location.href.replace("warehouses", `api/warehouse/${name}`)}`;
    let del_response = fetch(warehouse_url, {
        method: "DELETE"
    });

    return del_response;
}

async function postWarehouse(warehouse, name) {
    let warehouse_url = `${window.location.href.replace("warehouses", `api/warehouse/${name}`)}`;
    let post_response = fetch(warehouse_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(warehouse)
    });

    return post_response;
}

function refreshWarehouseTable() {
    warehouses_table.innerHTML = "";
    getAllWarehouses();
}

/*
    Since the name is used as an identifier for the internal API, we want to remove
    all spaces and replace them with dashes so that it can be used in the URL
*/
async function handleNewWarehouseSubmit() {
    let name = document.querySelector("input#warehouse-name").value;
    name = name.replace(/\s+/g, '-');
    const location = document.querySelector("input#warehouse-location").value;

    let new_warehouse = {
        "location": location
    }
    await postWarehouse(new_warehouse, name);
    refreshWarehouseTable();
}