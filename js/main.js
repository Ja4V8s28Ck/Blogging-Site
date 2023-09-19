// Dark mode

document.documentElement.setAttribute('data-bs-theme',localStorage.getItem('theme'))

let toggleIcon = document.getElementById("togglemode");

toggleIcon.addEventListener('click',()=>{
	if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
		localStorage.setItem('theme', 'light');
		toggleIcon.innerHTML = '<i class="bi bi-brightness-high-fill fs-6"></i>';
	}
	else {
		localStorage.setItem('theme', 'dark');
		toggleIcon.innerHTML = '<i class="bi bi-moon-stars-fill fs-6"></i>';
	}
	document.documentElement.setAttribute('data-bs-theme',localStorage.getItem('theme'));
})

function daraIC(falsecondition,iconClassList,tColor,fColor,tIcon,fIcon,initialIcon=""){
	if(falsecondition){
		if(iconClassList.contains(tColor)){
			iconClassList.replace(tColor,fColor)
			iconClassList.replace(tIcon,fIcon)
		}
		iconClassList.add(fColor)
		iconClassList.replace(initialIcon,fIcon)
	}
	else{
		if(iconClassList.contains(fColor)){
			iconClassList.replace(fColor,tColor)
			iconClassList.replace(fIcon,tIcon)
		}
		iconClassList.add(tColor);
		iconClassList.replace(initialIcon,tIcon);
	}
}