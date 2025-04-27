
    let dashboard = document.getElementById('dashboard');
    let ordersPage = document.getElementById('orders');

    $('#btn-home').on('click', function (e) {
    dashboard.style.display = 'block';
    ordersPage.style.display = 'none';
});

    $('#btn-orders').on('click', function (e) {
    dashboard.style.display = 'none';
    ordersPage.style.display = 'block';
});

