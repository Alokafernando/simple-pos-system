import { customer_db } from "../db/db.js";
import { CustomerModel } from "../model/CustomerModel.js";

let count = 0;

$('#add-customers-form').on('submit', function (e) {
    e.preventDefault();

    let custId = generateCustomerId();
    let name = $('#name').val().trim();
    let email = $('#email').val().trim();
    let phone = $('#phone').val().trim();
    let nic = $('#nic').val().trim();
    let salary = $('#salary').val().trim();
    let address = $('#address').val().trim();

    if (name === ''|| email === '' || phone === '' || nic === '' || salary === '' || address=== '') {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all required fields.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    let newCustomer = new CustomerModel(custId, name, email, phone, nic, salary, address);
    customer_db.push(newCustomer);
    count++;

    loadCustomers();
    clearForm();
    updateCustomerCount();

    Swal.fire({
        title: "Customer Added!",
        icon: "success",
        confirmButtonText: "OK"
    });
});


// Load customers into table
function loadCustomers() {
    $('#customer-view-tbody').empty();

    customer_db.forEach((customer) => {
        $('#customer-view-tbody').append(`
            <tr>
                <td>${customer.custId}</td>
                <td>${customer.name}</td>
                <td>${customer.address}</td>
                <td>${customer.salary}</td>
            </tr>
        `);
    });
}

// Generate Customer ID like CUST-001
function generateCustomerId() {
    return `CUST-${String(customer_db.length + 1).padStart(3, '0')}`;
}

// Clear form inputs
function clearForm() {
    $('#add-customers-form')[0].reset();
}

// Set customer count display
function updateCustomerCount() {
    $('#items-count').text(String(customer_db.length).padStart(3, '0'));
}
