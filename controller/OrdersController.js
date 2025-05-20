import { customer_db, item_db, orders_db } from "../db/db.js";
import { refreshCustomerIdDropdown } from './CustomerController.js';
import { refreshItemIdDropdown } from "./ItemController.js";

let pendingOrders = [];
let currentOrderId = null;



$(document).ready(function () {
    refreshCustomerIdDropdown();
    refreshItemIdDropdown();
    generateOrderId();
    updateOrderCount();
    setOrderDate();

    // Load customer details
    $('#customer-id-selection').on('change', function () {
        const selectedId = $(this).val();
        const customer = customer_db.find(c => c.custId === selectedId);

        if (customer) {
            $('#customer-address').val(customer.address);
            $('#customer-tel').val(customer.phone);
        } else {
            $('#customer-address').val('');
            $('#customer-tel').val('');
        }
    });

    // Load item details
    $('#item-id-dropdown').on('change', function () {
        const selectedItem = $(this).val();
        const item = item_db.find(i => i.itemName === selectedItem);

        if (item) {
            $('#item-price').val(item.price);
            $('#item-quantity').val(item.quantity);
        } else {
            $('#item-price').val('');
            $('#item-quantity').val('');
        }
    });

    // // Place item to pending orders
    $('#place-order').on('click', function () {
        let customer = $('#customer-id-selection').val();
        let itemName = $('#item-id-dropdown').val();
        let price = parseFloat($('#item-price').val());
        let orderQuantity = parseInt($('#order-quantity').val());
        let availableQuantity = parseInt($('#item-quantity').val());
        let orderDate = $('#order-date').val();
        let orderId = currentOrderId;

        const defaultCustomerText = '-- Select Customer ID --';
        const defaultItemText = '-- Select Item Name --';

        if (customer === defaultCustomerText || customer === '') {
            Swal.fire("Selection Error", "Please select a valid Customer ID.", "error");
            return;
        }

        if (itemName === defaultItemText || itemName === '') {
            Swal.fire("Selection Error", "Please select a valid Item ID.", "error");
            return;
        }

        if (orderQuantity <= 0) {
            Swal.fire("Quantity Error", "Please enter a valid order quantity.", "error");
            return;
        }

        if (orderQuantity > availableQuantity) {
            Swal.fire("Insufficient Stock", "The quantity you requested exceeds available stock.", "warning");
            return;
        }

        const item = item_db.find(i => i.itemName === itemName);
        item.quantity -= orderQuantity;

        let existingOrder = pendingOrders.find(o => o.itemName === itemName && o.customerId === customer);

        if (existingOrder) {
            existingOrder.orderQuantity += orderQuantity;
        } else {
            pendingOrders.push({
                orderId,
                customerId: customer,
                itemName,
                price,
                orderQuantity,
                orderDate
            });
        }

        refreshItemIdDropdown();
        loadOrders();
        $('#order-quantity').val('');
        $('#item-price').val('');
        $('#item-quantity').val('');
    });


    //submit order
    $('#submit-order').on('click', function () {
        if (pendingOrders.length === 0) {
            Swal.fire("No Orders", "Please place at least one order before submitting.", "warning");
            return;
        }

        pendingOrders.forEach(order => orders_db.push(order));
        Swal.fire("Success", "Order placed successfully!", "success");

        pendingOrders = [];
        generateOrderId();
        updateOrderCount();
        loadOrders();
        $('#final-total').text('');
        $('#balance').text('');
    });


    // Clear cash info
    $('#order-clear').on('click', function () {
        $('#cash').val('');
        $('#discount').val('');
        $('#balance').val('');
    });

    // Remove order preview table
    $('#remove-order').on('click', function () {
        pendingOrders.forEach(order => {
            let item = item_db.find(i => i.itemName === order.itemName);
            if (item) {
                item.quantity += order.orderQuantity;
            }
        });

        pendingOrders = [];
        loadOrders();
        refreshItemIdDropdown();
    });

});

function updateBalanceAndTotal() {
    let cash = parseFloat($('#cash').val()) || 0;
    let total = parseFloat($('#total').text()) || 0;
    let discount = parseFloat($('#discount').val()) || 0;

    if (total === 0) {
        $('#balance').val('');
        $('#sub-total').text('');
        return;
    }

    if (discount < 0 || discount > 100) {
        Swal.fire("Discount Error", "Invalid Discount. Must be between 0 and 100.", "error");
        $('#balance').val('');
        $('#sub-total').text('');
        return;
    }

    let discountedTotal = total - (total * (discount / 100));
    $('#sub-total').text(discountedTotal.toFixed(2));

    if (cash < discountedTotal) {
        Swal.fire("Error", "Insufficient Credit. Check Cash.....", "error");
        $('#balance').val('');
        return;
    }

    let balance = cash - discountedTotal;
    $('#balance').val(balance.toFixed(2));
}

// $('#cash, #discount').on('input', updateBalanceAndTotal);           ///////////don't
$('#cash, #discount').on('blur', updateBalanceAndTotal);


//generate order id
function generateOrderId() {
    let maxId = 0;

    for (let order of orders_db) {
        let numId = parseInt(order.orderId);
        if (!isNaN(numId) && numId > maxId) {
            maxId = numId;
        }
    }

    currentOrderId = String(maxId + 1).padStart(3, '0');
    $('#order-id-input').val(currentOrderId);
}

//update order count in dashboard
function updateOrderCount() {
    let uniqueOrderIds = new Set(orders_db.map(order => order.orderId));
    $('#order-count').text(String(uniqueOrderIds.size).padStart(3, '0'));
}

//set local date to order
function setOrderDate() {
    let orderDate = new Date().toISOString().split('T')[0];
    $('#order-date').val(orderDate);
}

//load order details
function loadOrders() {
    $('#orders-tbody').empty();
    let grandTotal = 0;

    pendingOrders.forEach((order, index) => {
        let total = parseFloat(order.price) * parseInt(order.orderQuantity);
        grandTotal += total;

        $('#orders-tbody').append(`
            <tr data-index="${index}">
                <td>${order.itemName}</td>
                <td>${order.price}</td>
                <td>${order.orderQuantity}</td>
                <td>${total.toFixed(2)}</td>
                <td><button class="remove-order-btn btn btn-sm" id="remove" style="background-color: #CD5656; color: #fff;">Remove</button></td>
            </tr>
        `);
    });

    $('#total').text(grandTotal.toFixed(2));
}


// replace order quantity to item quantity
$('#orders-tbody').on('click', '#remove', function () {
    const $row = $(this).closest('tr');
    const rowIndex = $row.data('index');

    const removedOrder = pendingOrders[rowIndex];
    const item = item_db.find(i => i.itemName === removedOrder.itemName);
    if (item) {
        item.quantity += removedOrder.orderQuantity;
    }

    pendingOrders.splice(rowIndex, 1);

    loadOrders();
    refreshItemIdDropdown();
});


