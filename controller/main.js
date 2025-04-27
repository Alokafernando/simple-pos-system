
    let dashboard = document.getElementById('dashboard');
    let ordersForm = document.getElementById('orders');
    let itemsForm = document.getElementById('items');

    $('#btn-home').on('click', function (e) {
    dashboard.style.display = 'block';
    ordersForm.style.display = 'none';
    itemsForm.style.display = 'none';
});

    $('#btn-orders').on('click', function (e) {
    dashboard.style.display = 'none';
    ordersForm.style.display = 'block';
    itemsForm.style.display = 'none';
    });

    $('#btn-items').on('click', function (){
        dashboard.style.display = 'none';
        ordersForm.style.display = 'none';
        itemsForm.style.display = 'block';
    });
