
let dashboard = document.getElementById('dashboard');
let ordersForm = document.getElementById('orders');
let itemsForm = document.getElementById('items');
let customerManageForm = document.getElementById('customers');
let customersAddingForm = document.getElementById('add-customer');
let itemAddingForm = document.getElementById("add-item");
let itemViewPanel = document.getElementById('item-view');
let customerViewPanel = document.getElementById('view-customer');

$('#btn-home, #btn-return-dashboard').on('click', function (e) {
   showDashboard();
});

$('#btn-orders').on('click', function (e) {
   showOrdersForm();
});

$('#btn-items, #cancelButton').on('click', function (){
   showItemsForm();
});

$('#btn-customer-manage').on('click', function (){
    showCustomerManageForm();
});

$('#btn-add-customer-1, #btn-add-customer-2').on('click', function () {
    showCustomerAddingForm();
});

$('#btn-add-item').on('click', function (){
    showAddItemForm();
});

$('#btn-view-items').on('click', function (){
    showItemViewPanel();
});

$('#btn-view-customers').on('click', function (){
    showCustomerViewPanel();
});

const showDashboard = () => {
    dashboard.style.display = 'block';
    ordersForm.style.display = 'none';
    itemsForm.style.display = 'none';
    customerManageForm.style.display = 'none';
    customersAddingForm.style.display = 'none';
    itemAddingForm.style.display = 'none';
    itemViewPanel.style.display = 'none';
    customerViewPanel.style.display = 'none';
}

const showOrdersForm = () => {
    dashboard.style.display = 'none';
    ordersForm.style.display = 'block';
    itemsForm.style.display = 'none';
    customerManageForm.style.display = 'none';
    customersAddingForm.style.display = 'none';
    itemAddingForm.style.display = 'none';
    itemViewPanel.style.display = 'none';
    customerViewPanel.style.display = 'none';
}

const showItemsForm = () => {
    dashboard.style.display = 'none';
    ordersForm.style.display = 'none';
    itemsForm.style.display = 'block';
    customerManageForm.style.display = 'none';
    customersAddingForm.style.display = 'none';
    itemAddingForm.style.display = 'none';
    itemViewPanel.style.display = 'none';
    customerViewPanel.style.display = 'none';
}

const showCustomerManageForm = () => {
    dashboard.style.display = 'none';
    ordersForm.style.display = 'none';
    itemsForm.style.display = 'none';
    customerManageForm.style.display = 'block';
    customersAddingForm.style.display = 'none';
    itemAddingForm.style.display = 'none';
    itemViewPanel.style.display = 'none';
    customerViewPanel.style.display = 'none';
}


const showCustomerAddingForm = () => {
    dashboard.style.display = 'none';
    ordersForm.style.display = 'none';
    itemsForm.style.display = 'none';
    customerManageForm.style.display = 'none';
    customersAddingForm.style.display = 'block';
    itemAddingForm.style.display = 'none';
    itemViewPanel.style.display = 'none';
    customerViewPanel.style.display = 'none';
}

const showAddItemForm = () => {
    dashboard.style.display = 'none';
    ordersForm.style.display = 'none';
    itemsForm.style.display = 'none';
    customerManageForm.style.display = 'none';
    customersAddingForm.style.display = 'none';
    itemAddingForm.style.display = 'block';
    itemViewPanel.style.display = 'none';
    customerViewPanel.style.display = 'none';
}

const showItemViewPanel = () => {
    dashboard.style.display = 'none';
    ordersForm.style.display = 'none';
    itemsForm.style.display = 'none';
    customerManageForm.style.display = 'none';
    customersAddingForm.style.display = 'none';
    itemAddingForm.style.display = 'none';
    itemViewPanel.style.display = 'block';
    customerViewPanel.style.display = 'none';
}

const showCustomerViewPanel = () => {
    dashboard.style.display = 'none';
    ordersForm.style.display = 'none';
    itemsForm.style.display = 'none';
    customerManageForm.style.display = 'none';
    customersAddingForm.style.display = 'none';
    itemAddingForm.style.display = 'none';
    itemViewPanel.style.display = 'none';
    customerViewPanel.style.display = 'block';
}

