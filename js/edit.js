const blogImg = document.querySelector('#blogimg');

blogImg.addEventListener('change', () =>{
	const [file] = blogImg.files;
	if(file && file.type.includes("image")){
		const formdata = new FormData();
		formdata.append('image', file);
		fetch('/upload', {
			method: 'post',
			body: formdata
		})
		.then((response) => response.json())
		location.reload();
	}
})
