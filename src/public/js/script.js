const dropDown = document.querySelectorAll('.menu-item.drop-down');

dropDown.forEach(item => {
    item.onclick = () => {
        const childrenDropDown = item.querySelector('.menu_dropdown');
        const icon = item.querySelector('.icon-down');

        childrenDropDown.classList.toggle('show')
        icon.classList.toggle('rotate')

    }
})