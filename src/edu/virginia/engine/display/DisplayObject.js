"use strict";

/**
 * An object for a javascript based gaming engine
 * 
 * */
class DisplayObject {
	
	constructor(id, filename) {
		this.id = id;
		this.loaded = false;
		if (filename) {
			this.loadImage(filename);
			this.filename = filename;
		}
		this.visible = true;
		this.position = { x : 0.0, y : 0.0 };
		this.pivotPoint = { x : 0.0, y : 0.0 }; // the object's origin, defaults to top-left
		this.scale = { x : 1.0, y : 1.0};
		this.rotation = 0.0; // rotation in radians, counterclockwise
		this.alpha = 1.0; // transparency: opaque = 1, clear = 0;
		this.parent; // the parent node of this DO
		this.imageWidth; // the width of the loaded image
		this.imageHeight; // the height of the loaded image
	}

	/**
	 * Loads the image, sets a flag called 'loaded' when the image is ready to be drawn
	 */
	loadImage(filename){
		var t = this;
		this.displayImage = new Image();
  		this.displayImage.onload = function(){
  			t.loaded = true;
  			t.imageWidth = this.width;
  			t.imageHeight = this.height;
  			console.log("Image dimensions: {width: " + this.width + ", height: " + this.height + "}");
  		};
  		this.displayImage.src = 'resources/' + filename;
	}

	/**
	 * Invoked every frame, manually for now, but later automatically if this DO is in DisplayTree
	 * dt: time since last call (ms)
	 */
	update(dt){
		
	}

	/**
	 * Draws this image to the screen and applies transformations
	 */
	draw(g) {
		if(this.visible){
			this.applyTransformations(g);
			if(this.displayImage && this.loaded) {
				this.drawSelfImage(g);
			}
			this.reverseTransformations(g);
		}
	}

	/**
	 *  Draws just this obj's image to the screen,
	 *  Doesn't apply transformations or anything else.
	 *  Is called in the draw(g) method.
	 */
	 drawSelfImage(g) {
	 	g.drawImage(this.displayImage,-this.pivotPoint.x,-this.pivotPoint.y);
	 }

	/**
	 * Applies transformations for this display object to the given graphics
	 * object
	 * */
	applyTransformations(g) {

		g.translate(this.position.x, this.position.y);


		// g.translate(this.pivotPoint.x, this.pivotPoint.y)
		g.rotate(-1.0*this.rotation);
		g.scale(this.scale.x, this.scale.y);
		// g.translate(-1.0 * this.pivotPoint.x, -1.0 * this.pivotPoint.y)

		g.globalAlpha = this.alpha;
	}

	/**
	 * Reverses transformations for this display object to the given graphics
	 * object
	 *
     */
	reverseTransformations(g) {
		g.globalAlpha = 1.0;

		// g.translate(this.pivotPoint.x, this.pivotPoint.y)
		// g.translate(-1.0 * this.pivotPoint.x, -1.0 * this.pivotPoint.y)

		g.scale(1.0 / this.scale.x, 1.0 / this.scale.y);
		g.rotate(this.rotation);

		g.translate(-1.0 * this.position.x, -1.0 * this.position.y);

	}

	///////////////////////////////////////////////
	// Getters and Setters ////////////////////////
	///////////////////////////////////////////////

	setId(id){this.id = id;}
	getId(){return this.id;}

	setDisplayImage(image){this.displayImage = image;} //image needs to already be loaded!
	getDisplayImage(){return this.displayImage;}

	getUnscaledHeight(){return this.displayImage.height;}
	getUnscaledWidth(){return this.displayImage.width;}

	setVisible(visible){this.visible = visible;}
	getVisible(){return this.visible;}

	setPosition(position){this.position = position;}
	getPosition(){return this.position;}

	setPositionX(xVal){this.position.x = xVal;}
	getPositionX(){return this.position.x;}

	setPositionY(yVal){this.position.y = yVal;}
	getPositionY(){return this.position.y;}

	setPivotPoint(pivotPoint){this.pivotPoint = pivotPoint;}
	getPivotPoint(){return this.pivotPoint;}

	setScale(scale){this.scale = scale;}
	getScale(){return this.scale;}

	setScaleX(scaleX){this.scale.x = scaleX;}
	setScaleY(scaleY){this.scale.y = scaleY;}

	// rotation is in radians
	setRotation(rotation){this.rotation = rotation;}
	getRotation(){return this.rotation;}

	// sets alpha between 0 and 1, clamps if outside range
	setAlpha(alpha){

		// clamp alpha to 0 or 1 if outside range
		if (alpha < 0) {
			alpha = 0;
		} else if (alpha > 1) {
			alpha = 1;
		}

		this.alpha = alpha;
		if (this.displayImage) {
		 	this.displayImage.filter = "alpha(opacity=" + Math.round(this.alpha * 100) + ")";
		 	this.displayImage.opacity = "" + this.alpha + "";
		 }
	}

	getAlpha(){return this.alpha;}
}

