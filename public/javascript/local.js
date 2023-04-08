const burgerBtn = document.querySelector('.burger')
const mobileNav = document.querySelector('.mobile-nav')

burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('d-lg-none')
    mobileNav.classList.toggle('visible')
})

window.addEventListener('scroll', () => {
    const header = document.querySelector('header')
    header.classList.toggle('sticky', window.scrollY > 460);
    mobileNav.classList.toggle('sticky', window.scrollY > 460);
})

