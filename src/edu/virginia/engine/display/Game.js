"use strict";

/**
 * Main class. Instantiate or extend Game to create a new game of your own
 */
class Game {
	
	constructor(gameId, width, height, canvas){
		Game.instance = this;

		this.gameId = gameId;
		this.width = width;
		this.height = height;
		this.canvas = canvas;
		this.g = canvas.getContext('2d'); //the graphics object
		this.playing = false;

		this.pressedKeys = new ArrayList();
		this.lastTime = this.now(); // time in ms
		this.root = new DisplayObjectNode("Root");

		this.tweenJuggler = new TweenJuggler(); // calls update on the tweens

		/* Setup a key listener */
		window.addEventListener("keydown", onKeyDown, true);
		window.addEventListener("keyup", onKeyUp, true);
	}

	/**
	 * get current time in ms
	 */
	now() {
		return window.performance.now();
	}

	static getInstance(){ return Game.instance; }

	update(pressedKeys, dt){}
	draw(g){}

	nextFrame(){
		var currentTime = this.now();
		var dt = currentTime - this.lastTime;
		this.lastTime = currentTime;
		game.update(this.pressedKeys, dt);
		game.draw(this.g);
		if(this.playing) window.requestAnimationFrame(tick);
	}

	start(){
		this.playing = true;
		window.requestAnimationFrame(tick); //Notice that tick() MUST be defined somewhere! See LabOneGame.js for an example
	}

	pause(){
		this.playing = false;
	}


	/**
	 * For dealing with keyCodes
	 */
	addKey(keyCode){
		console.log("Key Code: " + keyCode); //for your convenience, you can see what the keyCode you care about is
		if(this.pressedKeys.indexOf(keyCode) == -1) this.pressedKeys.push(keyCode);
	}

	removeKey(keyCode){ this.pressedKeys.remove(keyCode); }
}

function onKeyDown(e){ Game.getInstance().addKey(e.keyCode); }
function onKeyUp(e){ Game.getInstance().removeKey(e.keyCode); }