
let dashboard = document.getElementById('dashboard');
let ordersForm = document.getElementById('orders');
let itemsForm = document.getElementById('items');
let customerManageForm = document.getElementById('customers');
let customersAddingForm = document.getElementById('add-customers-form')

$('#btn-home').on('click', function (e) {
   showDashboard();
});

$('#btn-orders').on('click', function (e) {
   showOrdersForm();
});



$('#btn-items').on('click', function (){
   showItemsForm();
});

$('#btn-customer-manage').on('click', function (){
    showCustomerManageForm();
});

$('#btn-add-customer-1, #btn-add-customer-2').on('click', function () {
    showCustomerAddingForm();
});


const showDashboard = () => {
    dashboard.style.display = 'block';
    ordersForm.style.display = 'none';
    itemsForm.style.display = 'none';
    customerManageForm.style.display = 'none';
    customersAddingForm.style.display = 'none';
}

const showOrdersForm = () => {
    dashboard.style.display = 'none';
    ordersForm.style.display = 'block';
    itemsForm.style.display = 'none';
    customerManageForm.style.display = 'none';
    customersAddingForm.style.display = 'none';
}

const showItemsForm = () => {
    dashboard.style.display = 'none';
    ordersForm.style.display = 'none';
    itemsForm.style.display = 'block';
    customerManageForm.style.display = 'none';
    customersAddingForm.style.display = 'none';
}

const showCustomerManageForm = () => {
    dashboard.style.display = 'none';
    ordersForm.style.display = 'none';
    itemsForm.style.display = 'none';
    customerManageForm.style.display = 'block';
    customersAddingForm.style.display = 'none';
}


const showCustomerAddingForm = () => {
    dashboard.style.display = 'none';
    ordersForm.style.display = 'none';
    itemsForm.style.display = 'none';
    customerManageForm.style.display = 'none';
    customersAddingForm.style.display = 'block';
}
