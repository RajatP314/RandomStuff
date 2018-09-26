function loadImage(img, src){

	return new Promise( (resolve, reject) => {
	
		img.onload = ()=>{
			img.src = src;
			resolve(img);
		}
		img.onerror = (e)=>{
			reject(e);
		}
		img.src = src;
	});

}