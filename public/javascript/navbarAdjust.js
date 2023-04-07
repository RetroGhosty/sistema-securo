const burgerBtn = document.querySelector('.burger')
const mobileNav = document.querySelector('.mobile-nav')

burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('d-md-none')
    mobileNav.classList.toggle('visible')
})