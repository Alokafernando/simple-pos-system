import { refreshCustomerIdDropdown } from './CustomerController.js';
import { customer_db } from "../db/db.js";

$(document).ready(function () {
    refreshCustomerIdDropdown();

    $('#customer-id-selection').on('change', function () {
        const selectedId = $(this).val();
        const customer = customer_db.find(c => c.custId === selectedId);

        if (customer) {
            $('#customer-address').val(customer.address);
            $('#customer-tel').val(customer.phone);
        } else {
            $('#customer-address').val('not found..');
            $('#customer-tel').val('not found..');
        }
    });
});
