import { customer_db } from "../db/db.js";
import { CustomerModel } from "../model/CustomerModel.js";

function loadCustomers() {
    $('#customer-view-tbody').empty();

    customer_db.map((customer, index) => {
        $('#customer-view-tbody').append(`
            <tr>
                <td>${customer.custId}</td>
                <td>${customer.firstName}</td>
                <td>${customer.address}</td>
                <td>${customer.salary}</td>
            </tr>
        `);
    });
}

function generateCustomerId() {
    return `CUST-${String(customer_db.length + 1).padStart(3, '0')}`;
}

// Form submit event
$('#add-customers-form').on('submit', function (e) {
    e.preventDefault();

    let custId = generateCustomerId();
    let name = $('#name').val().trim();
    let email = $('#email').val().trim();
    let phone = $('#phone').val().trim();
    let nic = $('#nic').val().trim();
    let salary = $('#salary').val().trim();
    let address = $('#address').val().trim();

    if (!name || !email || !phone || !nic || !salary || !address) {
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
    console.log("Saved Customers:", customer_db);

    loadCustomers();
    clearForm();

    Swal.fire({
        title: "Customer Added!",
        icon: "success",
        confirmButtonText: "OK"
    });
});

function clearForm() {

}
