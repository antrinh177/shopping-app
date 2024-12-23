function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

let hamburger_icon = document.querySelector('.hamburger-icon img');
let close_btn = document.querySelector('#close-btn');

hamburger_icon.addEventListener('click', toggleSidebar);
close_btn.addEventListener('click', toggleSidebar);