import { customer_db } from "../db/db.js";
import { CustomerModel } from "../model/CustomerModel.js";

let count = 0;
let selectedRow = null;

$('#add-customers-form').on('submit', function (e) {
    e.preventDefault();

    let custId = generateCustomerId();
    let name = $('#name').val();
    let email = $('#email').val();
    let phone = $('#phone').val();
    let nic = $('#nic').val();
    let salary = $('#salary').val();
    let address = $('#address').val();

    if (name === '' || email === '' || phone === '' || nic === '' || salary === '' || address === '') {
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
    refreshCustomerIdDropdown();
    count++;
    console.log(customer_db)

    loadCustomers();
    clearForm();
    updateCustomerCount();

    Swal.fire({
        title: "Customer Added!",
        icon: "success",
        confirmButtonText: "OK"
    });
});

// === Load All Customers into View Table ===
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

// === Generate Customer ID like CUST-001 ===
function generateCustomerId() {
    return `CUST-${String(customer_db.length + 1).padStart(3, '0')}`;
}

// === Clear Add Form Inputs ===
function clearForm() {
    $('#name').val('');
    $('#email').val('');
    $('#phone').val('');
    $('#nic').val('');
    $('#salary').val('');
    $('#address').val('');
}

// === Update Customer Count Display ===
function updateCustomerCount() {
    $('#customers-count').text(String(customer_db.length).padStart(3, '0'));
}

// === Search Customers ===
$('#customer-search').on('click', function () {
    const searchTerm = $('#customer-input').val().trim().toLowerCase();
    const searchType = $('#customer-selection').val().toLowerCase();
    const $tbody = $('#find-customer-tbody');

    $tbody.empty();

    if (searchTerm === '') {
        Swal.fire("Please enter a search term");
        return;
    }

    const results = customer_db.filter(customer => {
        if (searchType === "name") return customer.name.toLowerCase().includes(searchTerm);
        if (searchType === "nic") return customer.nic.toLowerCase().includes(searchTerm);
        if (searchType === "phone") return customer.phone.toLowerCase().includes(searchTerm);
        return false;
    });

    if (results.length === 0) {
        $tbody.append(`<tr><td colspan="4" class="text-center text-danger">No matching customer found</td></tr>`);
    } else {
        results.forEach(customer => {
            $tbody.append(`
                <tr data-id="${customer.custId}">
                    <td>${customer.custId}</td>
                    <td>${customer.name}</td>
                    <td>${customer.address}</td>
                    <td>${customer.salary}</td>
                </tr>
            `);
        });
    }
});

// === Select Row + Enable Inline Editing ===
$(document).on('click', '#find-customer-tbody td', function () {
    const $cell = $(this);
    const $row = $cell.closest('tr');
    selectedRow = $row;

    const columnIndex = $cell.index();
    if (columnIndex === 0) {
        Swal.fire({
            title: 'Error!',
            text: 'Cust ID cannot be updated.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    $('#find-customer-tbody tr').removeClass('table-primary');
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


// === Update Selected Customer & show details in View Table ===
$('#update').on('click', function () {
    if (selectedRow === '') {
        Swal.fire("Please select a row to update.");
        return;
    }

    selectedRow.find('input').blur();

    const custId = selectedRow.data('id');
    const customer = customer_db.find(c => c.custId === custId);
    if (!customer) return;

    const cells = selectedRow.find('td');

    let nameRegex = /^[A-Za-z ]{5,20}$/;
    let addressRegex = /^.{7,}$/;
    let salaryRegex = /^(?:\d{2,6}(?:\.\d{2})?|1000000(?:\.00)?)$/;

    let name = cells.eq(1).text().trim();
    let address = cells.eq(2).text().trim();
    let salary = cells.eq(3).text().trim();

    // Validate all fields
    let isValid =
        nameRegex.test(name) &&
        addressRegex.test(address) &&
        salaryRegex.test(salary);

    if (!isValid) {
        Swal.fire({
            title: 'Error!',
            text: 'One or more fields are invalid. Please correct them before updating.',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        $('#find-customer-tbody').empty();
        return;
    }

    // Update customer
    customer.name = name;
    customer.address = address;
    customer.salary = salary;

    loadCustomers();
    $('#customer-input').val('');
    $('#find-customer-tbody').empty();

    Swal.fire({
        icon: 'success',
        title: 'Customer Updated',
        text: `Changes saved for ${customer.name}`
    });
});

//=========== clear customer searching form ===========
$('#clear').on('click', function (){
    $('#customer-input').val('');
    $('#find-customer-tbody').empty();
});

//=========== delete customer using selected row ===========
$('#delete').on('click', function () {
    if (selectedRow === '') {
        Swal.fire("Please select a row to delete.");
        return;
    }

    const custId = selectedRow.data('id');

    Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete customer ${custId}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            const index = customer_db.findIndex(c => c.custId === custId);
            if (index !== -1) {
                customer_db.splice(index, 1);
            }

            selectedRow.remove();
            selectedRow = null;

            loadCustomers();
            updateCustomerCount();
            $('#customer-input').val('');
            $('#find-customer-tbody').empty();

            Swal.fire(
                'Deleted!',
                'Customer has been removed.',
                'success'
            );
        }
    });
});

//=========== set all customer ids set to drop down===========
export function refreshCustomerIdDropdown() {
    const $select = $('#customer-id-selection');
    $select.empty();
    $select.append('<option value="">-- Select Customer ID --</option>');

    customer_db.forEach(customer => {
        $select.append(`<option >${customer.custId}</option>`);
    });

}

// === apply validations ===
function validateAll() {
    let nameRegex = /^[A-Za-z ]{5,20}$/;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let phoneRegex = /^(?:\+94|0)?7\d{8}$/;
    let nicRegex = /^(\d{9}[Vv]|\d{12})$/;
    let salaryRegex = /^(?:\d{2,6}(?:\.\d{2})?|1000000(?:\.00)?)$/;
    let addressRegex = /^.{7,}$/;

    let customerName = $('#name').val();
    let customerEmail = $('#email').val();
    let customerPhone = $('#phone').val();
    let customerNIC = $('#nic').val();
    let customerSalary = $('#salary').val();
    let customerAddress = $('#address').val();

    return (
        nameRegex.test(customerName) &&
        emailRegex.test(customerEmail) &&
        phoneRegex.test(customerPhone) &&
        nicRegex.test(customerNIC) &&
        salaryRegex.test(customerSalary) &&
        addressRegex.test(customerAddress)
    );
}

// clear error message
function clearAllErrors() {
    $('#firstNameError, #emailError, #phoneError, #nicError, #salaryError, #addressError').text("");
}

// Disable save button
$('#customer-save-btn').prop('disabled', true);

$('#name').on('input', function () {
    clearAllErrors();

    let nameRegex = /^[A-Za-z ]{5,20}$/;
    let customerName = $('#name').val();

    if (!nameRegex.test(customerName)) {
        $('#firstNameError').text("Invalid Name: 5-20 characters, letters and spaces only.").css("color", "red");
    }

    $('#customer-save-btn').prop('disabled', !validateAll());
});

$('#email').on('input', function () {
    clearAllErrors();

    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let customerEmail = $('#email').val();

    if (!emailRegex.test(customerEmail)) {
        $('#emailError').text("Invalid Email: please use the format email@example.com.").css("color", "red");
    }

    $('#customer-save-btn').prop('disabled', !validateAll());
});

$('#phone').on('input', function () {
    clearAllErrors();

    let phoneRegex = /^(?:\+94|0)?7\d{8}$/;
    let customerPhone = $('#phone').val();

    if (!phoneRegex.test(customerPhone)) {
        $('#phoneError').text("Invalid Phone Number: use 07XXXXXXXX or +947XXXXXXXX format.").css("color", "red");
    }

    $('#customer-save-btn').prop('disabled', !validateAll());
});

$('#nic').on('input', function () {
    clearAllErrors();

    let nicRegex = /^(\d{9}[Vv]|\d{12})$/;
    let customerNIC = $('#nic').val();

    if (!nicRegex.test(customerNIC)) {
        $('#nicError').text("Invalid NIC Number: use 9 digits followed by 'V' (e.g., 123456789V) or 12 digits (e.g., 200012345678).").css("color", "red");
    }

    $('#customer-save-btn').prop('disabled', !validateAll());
});

$('#salary').on('input', function () {
    clearAllErrors();

    let salaryRegex = /^(?:\d{2,6}(?:\.\d{2})?|1000000(?:\.00)?)$/;
    let customerSalary = $('#salary').val();

    if (!salaryRegex.test(customerSalary)) {
        $('#salaryError').text("Invalid Salary: enter a valid amount like 100 or 100.00.").css("color", "red");
    }

    $('#customer-save-btn').prop('disabled', !validateAll());
});

$('#address').on('input', function () {
    clearAllErrors();

    let addressRegex = /^.{7,}$/;
    let customerAddress = $('#address').val();

    if (!addressRegex.test(customerAddress)) {
        $('#addressError').text("Invalid Address: must be at least 7 characters long.").css("color", "red");
    }

    $('#customer-save-btn').prop('disabled', !validateAll());
});



