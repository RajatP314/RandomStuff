let normalize = (n, min, max) => {
	if(n < min){
		return min;
	} else if (n > max){
		return max;
	} else {
		return n;
	}
}

class Pixel{

	constructor(x, y, c){
		this.x = x;
		this.y = y;
		this.color = c
		this.cluster = null;
	}
	
	samePointAs(p){
		return (this.x === p.x && this.y === p.y);
	}
	
}

class Color{
	
	constructor(r, g, b){
		this.red = normalize(r, 0, 255);
		this.green = normalize(g, 0, 255);
		this.blue = normalize(b, 0, 255);		
	}
	
	dSquaredFrom(color){
		return (color.red-this.red)**2 + (color.green-this.green)**2 + (color.blue-this.blue)**2;
	}
	
	distanceFrom(color){
		return Math.sqrt(this.dSquaredFrom(color));
	}
	
	sameColorAs(color){
		return (this.dSquaredFrom(color) === 0);
	}
	
	toString(){
		return "rgb(" + this.red + "," + this.green + "," + this.blue + ")";
	}
	
}

class Cluster{
	
	constructor(color, id){
		this.id = id;
		this.baseColor = color;
		this.averageColor = null;
		this.pixels = [];
		this.size = 0;
	}
	
	addPixel(p){
		p.cluster = this.id;
		this.pixels.push(p);
		this.size++;
	}
	
	getAverageColor(){
		let rAvg = 0, gAvg = 0, bAvg = 0;
		for(let p of this.pixels){
			rAvg += p.color.red;
			gAvg += p.color.green;
			bAvg += p.color.blue;
		}
		rAvg /= this.size;
		gAvg /= this.size;
		bAvg /= this.size;
		let avg = new Color(Math.round(rAvg), Math.round(gAvg), Math.round(bAvg));
		return avg;
	}
	
}
