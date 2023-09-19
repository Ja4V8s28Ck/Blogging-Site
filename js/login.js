// Password Eye icon (Login)

const paswd1 = document.querySelector('#pass1')
const pbtn = document.getElementById('pbtn')

pbtn.addEventListener("click" , () =>{
	const pbtncls = pbtn.classList.contains('bi-shield') === true ? 'bi-shield-slash' : 'bi-shield';
	if(pbtncls === "bi-shield-slash"){
		pbtn.classList.remove('bi-shield')
		pbtn.classList.add('bi-shield-slash')
	}
	else{
		pbtn.classList.remove('bi-shield-slash')
		pbtn.classList.add('bi-shield')
	}
	const taip = paswd1.getAttribute("type") === "password" ? "text" : "password";
  paswd1.setAttribute("type",taip);

});