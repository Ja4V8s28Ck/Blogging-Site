let toggleIcon = document.getElementById("togglemode");


toggleIcon.addEventListener('click',()=>{
	if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
		toggleIcon.innerHTML = '<i class="bi bi-brightness-high-fill fs-6"></i>';
		document.documentElement.setAttribute('data-bs-theme','light');
	}
	else {
		toggleIcon.innerHTML = '<i class="bi bi-moon-stars-fill fs-6"></i>';
		document.documentElement.setAttribute('data-bs-theme','dark');
	}
})