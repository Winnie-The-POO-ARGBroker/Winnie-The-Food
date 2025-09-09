const sideMenu = document.getElementById('sideMenu');
const navBar = document.querySelector('nav');
const navLinks = document.querySelector('nav ul');

function openMenu() {
    sideMenu.style.transform = 'translateX(-16rem)';
}
function closeMenu() {
    sideMenu.style.transform = 'translateX(16rem)';
}

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navBar.classList.add('bg-white', 'bg-white/50', 'backdrop-blur-lg', 'shadow-sm');
        navLinks.classList.remove('bg-white', 'bg-white/50', 'shadow-sm');
    } else {
        navBar.classList.remove('bg-white', 'bg-white/50', 'backdrop-blur-lg', 'shadow-sm');
        navLinks.classList.add('bg-white', 'bg-white/50', 'shadow-sm');
    }
});