class Point{
	constructor(v){
		this.x = v[0];
		this.y = v[1];
	}
	
	draw(ctx, size, color = "blue", circle = false){
		f.fillStyle=color;
		if(circle == true){
			ctx.beginPath();
			ctx.arc(this.x, this.y, size/2, 0, 2*Math.PI);
			ctx.fill();
			ctx.closePath();
		} else {
			ctx.fillRect(this.x-size/2, this.y-size/2, size, size);
		}
	}
	
}

class Bezier{
	constructor(points){
		this.points = points;
		this.degree = points.length-1;
	}
	
	valueX(t){
		if(this.degree == 0){
			return this.points[0].x;
		} else {
			var b1 = new Bezier(this.points.slice(0, this.points.length-1));
			var b2 = new Bezier(this.points.slice(1, this.points.length));
			return (1-t)*b1.valueX(t) + t*b2.valueX(t);
		}
	}
	
	valueY(t){
		if(this.degree == 0){
			return this.points[0].y;
		} else {
			var b1 = new Bezier(this.points.slice(0, this.points.length-1));
			var b2 = new Bezier(this.points.slice(1, this.points.length));
			return (1-t)*b1.valueY(t) + t*b2.valueY(t);
		}
	}
	
	valueAt(t){
		return new Point([this.valueX(t), this.valueY(t)]);
	}
	
	draw(ctx, steps = 100, thickness = 1, color = "red", linesOn = true){
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.lineWidth = thickness;
		if(linesOn == true){
			ctx.beginPath();
			ctx.moveTo(this.valueAt(0).x, this.valueAt(0).y);
			for(var i=1;i<=steps;i++){
				let v = this.valueAt(i/steps);
				ctx.lineTo(v.x, v.y);
			}
			ctx.stroke();
			ctx.closePath();
		} else {
			for(var i=0;i<=steps;i++){
				let v = bezier.valueAt(i/steps);
				v.draw(ctx, thickness, true);
			}
		}
	}
	
	drawControls(ctx, pointSize = 8, lineSize = 1, pointColor = "blue", lineColor = "blue"){
		ctx.strokeStyle = lineColor;
		ctx.fillStyle = pointColor;
		for(var i=0;i<this.points.length;i++){
			this.points[i].draw(ctx,pointSize,false)
		}
		ctx.beginPath();
		ctx.moveTo(this.points[0].x, this.points[0].y);
		for(var i=1;i<this.points.length;i++){
			ctx.lineTo(this.points[i].x, this.points[i].y);
		}
		ctx.stroke();
		ctx.closePath();
	}
	
}