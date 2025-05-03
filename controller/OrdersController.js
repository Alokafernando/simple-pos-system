import { customer_db, item_db } from "../db/db.js";
import { refreshCustomerIdDropdown } from './CustomerController.js';
import { refreshItemIdDropdown } from "./ItemController.js";

$(document).ready(function () {
    refreshCustomerIdDropdown();
    refreshItemIdDropdown();

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
});
