import { customer_db, item_db } from "../db/db.js";
import { ItemModel } from "../model/ItemModel.js";

let count = 0;
let selectedRow = null;

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

    let itemCode = generateItemId();
    let newItem = new ItemModel(itemCode, name, price, quantity);
    item_db.push(newItem);
    refreshItemIdDropdown();
    count++;

    loadItem();
    clearForm();
    updateItemCount();

    Swal.fire({
        title: "Item Added Successfully!",
        icon: "success",
        confirmButtonText: "OK"
    });
});

// === Load Items into View Table ===
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

// === Generate Item ID like ITEM-001 ===
function generateItemId() {
    return `ITEM-${String(item_db.length + 1).padStart(3, '0')}`;
}

// === Clear Add Form Inputs ===
function clearForm() {
    $('#itemName').val('');
    $('#price').val('');
    $('#quantity').val('');
}

// === Update items Count Display ===
function updateItemCount() {
    $('#items-count').text(String(item_db.length).padStart(3, '0'));
}

// === Search Items ===
$('#item-search').on('click', function () {
    const searchTerm = $('#item-input').val().trim().toLowerCase();
    const searchType = $('#item-selection').val().toLowerCase();
    const $tbody = $('#find-item-tbody');

    $tbody.empty();

    if (searchTerm === '') {
        Swal.fire("Please enter a search term");
        return;
    }

    const results = item_db.filter(item => {
        if (searchType === "name") return item.itemName.toLowerCase().includes(searchTerm);
        if (searchType === "code") return item.itemCode.toLowerCase().includes(searchTerm);
        return false;
    });

    if (results.length === 0) {
        $tbody.append(`<tr><td colspan="4" class="text-center text-danger">No matching item found</td></tr>`);
    } else {
        results.forEach(item => {
            $tbody.append(`
                <tr data-id="${item.itemCode}">
                    <td>${item.itemName}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                </tr>
            `);
        });
    }
});

// === Select Row + Inline Edit ===
$(document).on('click', '#find-item-tbody td', function () {
    const $cell = $(this);
    const $row = $cell.closest('tr');
    selectedRow = $row;

    $('#find-item-tbody tr').removeClass('table-primary');
    $row.addClass('table-primary');

    if ($cell.find('input').length > 0) return;

    const originalValue = $cell.text().trim();
    const $input = $('<input type="text" class="form-control">').val(originalValue);
    $cell.html($input).find('input').focus();

    $input.on('blur', function () {
        const newValue = $(this).val().trim();
        $cell.text(newValue);
    });

    $input.on('keypress', function (e) {
        if (e.which === 13) $(this).blur();
    });
});

// === Update Selected Item ===
$('#item-update').on('click', function () {
    if (!selectedRow) {
        Swal.fire("Please select a row to update.");
        return;
    }

    selectedRow.find('input').blur();

    const itemID = selectedRow.data('id');
    const item = item_db.find(i => i.itemCode === itemID);
    if (!item) return;

    const cells = selectedRow.find('td');
    item.itemName = cells.eq(0).text().trim();
    item.price = cells.eq(1).text().trim();
    item.quantity = cells.eq(2).text().trim();

    loadItem();
    $('#item-input').val('');
    $('#find-item-tbody').empty();

    Swal.fire({
        icon: 'success',
        title: 'Item Updated',
        text: `Changes saved for ${item.itemName}`
    });
});

//===========clear item searching form===========
$('#item-form-clear').on('click', function (){
    $('#item-input').val('');
    $('#find-item-tbody').empty();
});

//===========delete item using selected row===========
$('#item-delete').on('click', function () {
    if (selectedRow === '') {
        Swal.fire("Please select a row to delete.");
        return;
    }

    const itemId = selectedRow.data('id');

    Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete customer ${itemId}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const index = item_db.findIndex(i => i.itemCode === itemId);
            if (index !== -1) {
                item_db.splice(index, 1);
            }

            selectedRow.remove();
            selectedRow = null;

            loadItem();
            updateItemCount();
            $('#item-input').val('');
            $('#find-item-tbody').empty();

            Swal.fire(
                'Deleted!',
                'Customer has been removed.',
                'success'
            );
        }
    });
});

//===========set all item ids set to drop down===========
export function refreshItemIdDropdown() {
    const $select = $('#item-id-dropdown');
    $select.empty();

    item_db.forEach(item => {
        $select.append(`<option >${item.itemName}</option>`);
    });

}