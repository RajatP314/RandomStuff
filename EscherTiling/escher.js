class Path{

	constructor(dx, dy){
		this.dx = dx;
		this.dy = dy;
		this.ix = [];
		this.iy = [];
	}
	
	generateLinearPath(n){
		for(let i=0;i<=n;i++){
			this.ix.push(i*this.dx/n);
			this.iy.push(i*this.dy/n);
		}
	}
	
	generateRandomPath(n, s){
		if(s === 0){
			return;
		}
		let controlPoints = [new Point([0,0])];
		for(let i=0;i<s-1;i++){
			let px = 3*Math.random()*this.dx;
			let py = 3*Math.random()*this.dy;
			controlPoints.push(new Point([px,py]))
		}
		controlPoints.push(new Point([this.dx, this.dy]));
		let b = new Bezier(controlPoints);
		for(let i=0;i<=n;i++){
			this.ix[i] = b.valueX(i/n);
			this.iy[i] = b.valueY(i/n);
		}
		//b.drawControls(f);
	}
	
	moveThroughPath(ctx, x, y){
		for(let i=1;i<this.ix.length;i++){
			ctx.lineTo(x+this.ix[i], y+this.iy[i]);
		}
	}
	
	draw(ctx, x, y){
		ctx.beginPath();
		ctx.moveTo(x, y);
		this.moveThroughPath(ctx, x, y);
		//ctx.strokeStyle="black";
		ctx.stroke();
		ctx.closePath();
	}
	
}

class QuadTile{

	constructor(x1, x2, x3, x4, y1, y2, y3, y4){
		this.x = [x1, x2, x3, x4];
		this.y = [y1, y2, y3, y4];
		
		let minX = this.x.slice(0).sort( (a,b)=>a-b )[0];
		let minY = this.y.slice(0).sort( (a,b)=>a-b )[0];
		
		while(this.x[0] != minX){
			this.x = this.x.slice(1).concat([this.x[0]])
			this.y = this.y.slice(1).concat([this.y[0]])
		}
		
		this.hdx = this.x[2]-this.x[0];
		this.hdy = this.y[2]-this.y[0];
		this.vdx = this.x[3]-this.x[1];
		this.vdy = this.y[3]-this.y[1];
	}
	
	draw(ctx){
		ctx.strokeStyle="black";
		ctx.lineWidth=2
		ctx.beginPath();
		ctx.moveTo(this.x[0], this.y[0]);
		ctx.lineTo(this.x[1], this.y[1]);
		ctx.lineTo(this.x[2], this.y[2]);
		ctx.lineTo(this.x[3], this.y[3]);
		ctx.lineTo(this.x[0], this.y[0]);
		ctx.stroke();
		ctx.closePath();
	}
	
	newTileAt(x, y){
		let x1 = x;
		let x2 = x1 + this.x[1] - this.x[0];
		let x3 = x2 + this.x[2] - this.x[1];
		let x4 = x3 + this.x[3] - this.x[2];
		let y1 = y;
		let y2 = y1 + this.y[1] - this.y[0];
		let y3 = y2 + this.y[2] - this.y[1];
		let y4 = y3 + this.y[3] - this.y[2];
		return new QuadTile(x1, x2, x3, x4, y1, y2, y3, y4);
	}
	
	tesselate(c, ctx){
		let sx = 0;
		for(let sy=0;sy+(c.width/this.hdx)*this.hdy<=c.height;sy+=Math.abs(this.vdy)){
			let ty = sy;
			for(let tx=sx;tx<=c.width;tx+=this.hdx){
				//ctx.fillRect(tx, ty, 10, 10);
				this.newTileAt(tx, ty).draw(ctx);
				ty+=this.hdy;
			}
			sx -= Math.abs(this.vdx);
			sy += Math.abs(this.hdy);
		}
	}

}

class EscherTile extends QuadTile{
	
	constructor(x1, x2, x3, x4, y1, y2, y3, y4){
		super(x1, x2, x3, x4, y1, y2, y3, y4);
		this.paths = [new Path(this.x[1]-this.x[0], this.y[1]-this.y[0]), 
						new Path(this.x[2]-this.x[1], this.y[2]-this.y[1]),
						new Path(this.x[3]-this.x[2], this.y[3]-this.y[2]),
						new Path(this.x[0]-this.x[3], this.y[0]-this.y[3])];
		for(let i=0;i<this.paths.length;i++){
			//this.paths[i].generateLinearPath(100);
			let p = new Path(this.paths[i].dx/2, this.paths[i].dy/2);
			p.generateRandomPath(100, 4);
			this.paths[i].ix = p.ix.slice(0);
			this.paths[i].iy = p.iy.slice(0);
			for(let j=p.ix.length-2;j>=0;j--){
				this.paths[i].ix.push( this.paths[i].dx - p.ix[j] );
				this.paths[i].iy.push( this.paths[i].dy - p.iy[j] );
			}
		}
	}
	
	draw(ctx){
		ctx.strokeStyle="black";
		ctx.lineWidth=2
		ctx.beginPath();
		for(let i=0;i<this.paths.length;i++){
			this.paths[i].moveThroughPath(ctx, this.x[i], this.y[i]);
		}
		ctx.fillStyle="hsl("+200+","+(50+Math.round(Math.random()*50))+"%,"+(25+Math.round(Math.random()*25))+"%)";
		ctx.fill();
		ctx.closePath();
	}
	
	newTileAt(x, y){
		let x1 = x;
		let x2 = x1 + this.x[1] - this.x[0];
		let x3 = x2 + this.x[2] - this.x[1];
		let x4 = x3 + this.x[3] - this.x[2];
		let y1 = y;
		let y2 = y1 + this.y[1] - this.y[0];
		let y3 = y2 + this.y[2] - this.y[1];
		let y4 = y3 + this.y[3] - this.y[2];
		let et = new EscherTile(x1, x2, x3, x4, y1, y2, y3, y4);
		et.paths = this.paths;
		return et;
	}
	
}