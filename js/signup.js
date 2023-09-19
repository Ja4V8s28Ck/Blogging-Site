// Password Eye icon (Sign Up)

const paswd1 = document.querySelector('#pass1')
const paswd2 = document.querySelector('#pass2')
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
  paswd2.setAttribute("type",taip);

});


// Password Checker

const ci1 = document.getElementById('ci1').classList
const ci2 = document.getElementById('ci2').classList
const p1 = document.getElementById('pass1')
const p2 = document.getElementById('pass2')
const sbtn = document.getElementById('sbtn').classList

document.addEventListener("keyup",()=>{
	if ((p1.value.length) != 0){
		daraIC(
			(p1.value.length <= 7),
			ci1,
			"text-success",
			"text-danger",
			"bi-shield-fill-check",
			"bi-shield-fill-exclamation",
			"bi-shield-lock-fill",
			)
	}
	if ((p2.value.length) != 0){
		daraIC(
			((p1.value != p2.value)),
			ci2,
			"text-success",
			"text-danger",
			"bi-shield-fill-check",
			"bi-shield-fill-exclamation",
			"bi-shield-lock-fill",
			)
	}
	if(ci1.contains('text-danger') | ci2.contains('text-danger')){
		sbtn.replace('enabled','disabled');
	}
	else{
		sbtn.replace('disabled','enabled')
	}
})