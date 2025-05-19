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

    let nameRegex = /^[A-Za-z ]{2,30}$/;
    let priceRegex = /^(?:\d{2,6}(?:\.\d{2})?|10000(?:\.00)?)$/;
    let quantityRegex = /^(?:[1-9]|[1-9]\d{1,3}|10000)$/;

    let itemName = cells.eq(0).text().trim();
    let itemPrice = cells.eq(1).text().trim();
    let itemQuantity = cells.eq(2).text().trim();

    let isValid =
        nameRegex.test(itemName) &&
        priceRegex.test(itemPrice) &&
        quantityRegex.test(itemQuantity);

    if (!isValid){
        Swal.fire({
            title: 'Error!',
            text: 'One or more fields are invalid. Please correct them before updating.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        $('#find-item-tbody').empty();
        return;
    }

    item.itemName = itemName;
    item.price = itemPrice;
    item.quantity = itemQuantity;

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
    $select.append('<option value="">-- Select Item Name --</option>');

    item_db.forEach(item => {
        $select.append(`<option >${item.itemName}</option>`);
    });
}

// === apply validations ===
function validateAll() {
    let nameRegex = /^[A-Za-z ]{2,30}$/;
    let priceRegex = /^(?:\d{2,6}(?:\.\d{2})?|10000(?:\.00)?)$/;
    let quantityRegex = /^(?:[1-9]|[1-9]\d{1,3}|10000)$/;

    let itemName = $('#itemName').val();
    let price = $('#price').val();
    let quantity = $('#quantity').val();

    return (
        nameRegex.test(itemName) &&
        priceRegex.test(price) &&
        quantityRegex.test(quantity)
    );
}

// clear error message
function clearAllErrors() {
    $('#itemNameError, #priceError, #quantityError').text("");
}

// Disable save button
$('#btn-item-save').prop('disabled', true);

$('#itemName').on('input', function () {
    clearAllErrors();

    let nameRegex = /^[A-Za-z ]{2,30}$/;
    let itemName = $('#itemName').val();

    if (!nameRegex.test(itemName)) {
        $('#itemNameError').text("Invalid Name: 2-30 characters, letters and spaces only.").css("color", "red");
    }

    $('#btn-item-save').prop('disabled', !validateAll());
});

$('#price').on('input', function () {
    clearAllErrors();

    let priceRegex = /^(?:\d{2,6}(?:\.\d{2})?|1000000(?:\.00)?)$/;
    let itemPrice = $('#price').val();

    if (!priceRegex.test(itemPrice)) {
        $('#priceError').text("Invalid Price: enter a valid amount like 100 or 100.00.").css("color", "red");
    }

    $('#btn-item-save').prop('disabled', !validateAll());
});

$('#quantity').on('input', function (){
   clearAllErrors();

   let quantityRegex =  /^(?:[1-9]|[1-9]\d{1,3}|10000)$/;
   let itemQuantity = $('#quantity').val();

   if (!quantityRegex.test(itemQuantity)){
       $('#quantityError').text("Invalid Quantity: enter a number between 1 and 10000.").css("color", "red");
   }

    $('#btn-item-save').prop('disabled', !validateAll());

});