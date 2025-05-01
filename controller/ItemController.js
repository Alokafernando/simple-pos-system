import {customer_db, item_db} from "../db/db.js";
import { ItemModel } from "../model/ItemModel.js";

let count = 0;

$('#add-item-form').on('submit', function (e) {
    e.preventDefault();

    let name = $('#itemName').val().trim();
    let price = $('#price').val().trim();
    let quantity = $('#quantity').val().trim();

    if (name === '' || price === '' || quantity === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });

        return;
    }

    let itemCode = generateCustomerId();
    let newItem = new ItemModel(itemCode, name, price, quantity);
    item_db.push(newItem);
    count++;

    loadItem();
    clearForm();
    updateItemCount();

    Swal.fire({
        title: "Added Successfully!",
        icon: "success",
        draggable: true
    });
});

// Load items into table
function loadItem() {
    $('#view-item-tbody').empty();

    item_db.map((item, index) => {
        $('#view-item-tbody').append(`
            <tr>
                <td>${item.itemName}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
            </tr>
        `);
    });
}

// Generate Customer ID like CUST-001
function generateCustomerId() {
    return `ITEM-${String(customer_db.length + 1).padStart(3, '0')}`;
}

// Clear form inputs
function clearForm() {
    $('#add-item-form')[0].reset();
}

// Set items count display
function updateItemCount() {
    $('#items-count').text(String(customer_db.length).padStart(3, '0'));
}

