import { item_db } from "../db/db.js";
import { ItemModel } from "../model/ItemModel.js";

function loadItem() {
    $('#view-item-tbody').empty();

    item_db.forEach((item) => {
        $('#view-item-tbody').append(`
            <tr>
                <td>${item.itemName}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
            </tr>
        `);
    });
}

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

    // const newCode = `ITM${String(item_db.length + 1).padStart(3, '0')}`;
    const newItem = new ItemModel(null, name, parseFloat(price), parseInt(quantity));

    item_db.push(newItem);
    console.log("Saved Items:", item_db);

    loadItem();
    clear();

    Swal.fire({
        title: "Added Successfully!",
        icon: "success",
        draggable: true
    });
});

function clear(){
    $('#itemName').val('');
    $('#quantity').val('');
    $('#price').val('');
}

