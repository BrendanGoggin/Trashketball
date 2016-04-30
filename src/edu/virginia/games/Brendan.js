"use strict";

// coefficient of restitution for ball-wall bounces. 0 = no bounce, 1 = completely elastic, >1 = gains speed
var C_REST_WALL = .4;

var score = 0;
var multiplier = 1;

/**
 */
class Trashketball extends Game {
    
    constructor(canvas) {

        super("Trashketball", GAME_WIDTH, GAME_HEIGHT, canvas);

        this.song = new Audio();
        this.song.src = 'resources/sounds/ChibiNinja.mp3';
        this.song.loop = true;
        this.song.volume = 0.3;
        this.song.play();

        this.score = 0;
        var attempts = 3;

        // make the player
        this.player = makePlayer();

        // make the ball
        this.ball = makeBall();

        // trash can
        this.trash = makeTrash();
        
        // the trashcan walls in an array
        this.trashWalls = this.trash.children;

        // make the walls of the level
        var wallLayer = BasicLevel.makeWallLayer();
        this.walls = wallLayer.children;

        this.root.addChild(wallLayer);
        this.root.addChild(this.player);
        this.root.addChild(this.ball);
        this.root.addChild(this.trash);

    }

    update(pressedKeys, dt){
        if (dt > 100) dt = 100;
        this.tweenJuggler.update();
        super.update(pressedKeys, dt);
        
        var ballNewPosition = this.ball.getPosition();
        var ballOldPosition = {x:ballNewPosition.x, y:ballNewPosition.y};

        this.root.update(pressedKeys, dt);

        this.player.hitbox.color = "black";
        this.ball.hitbox.color = "black";



        // Kicking
        if (this.player.kicker.hitbox) {
            if (this.ball.detectCollisionWith(this.player.kicker) && !this.kicking && !this.heading) {
                // this.ball.bounceOffOf(this.player.kicker);
                if (!this.kicking) {
                    var direction = normalize({x: 1, y: -2});
                    var directionFlip = (this.player.scale.x > 0) ? 1 : -1;
                    // var speed = 1;
                    direction.x *= directionFlip;
                    this.kicking = true;
                    this.player.kickBall(this.ball, direction);
                }
            }
            // else {
            //     this.kicking = false;
            // }
        }
        else {
            this.kicking = false;
        }


        // Heading
        if (this.player.header.hitbox) {
            if (this.ball.detectCollisionWith(this.player.header) && !this.heading) {
                var direction = normalize({x: 1, y: -3});
                var directionFlip = (this.player.scale.x > 0) ? 1 : -1;
                // var speed = .5;
                direction.x *= directionFlip;
                this.player.headBall(this.ball, direction);
                this.heading = true;
            }
        }
        else {
            this.heading = false;
        }



        for (var i = 0; i < this.trashWalls.length; i++) {
            // debugger;
            var ballTrashWallResolution = this.ball.detectAndResolveCollisionWith(this.trashWalls[i]);
            if (ballTrashWallResolution) {

                var bounce = true;
                
                // if ball hits top side of can side-wall, ignore the bounce because there are
                // circles on top of the side-walls for it to hit
                if (this.trashWalls[i].hitbox.shape == "Rectangle") {
                    var resCopy = copyPoints([ballTrashWallResolution])[0];
                    resCopy = normalize(resCopy);
                    this.trashWalls[i].parent.rotateToLocal(resCopy);
                    if (Math.abs(resCopy.x) < 0.01 && Math.abs(resCopy.y - 1) < 0.01) {
                        bounce = false;
                        this.ball.position = vectorAdd(this.ball.position, ballTrashWallResolution);
                    }
                }

                if (bounce) {
                    var cRest = 0.5;
                    var cFriction = 0;
                    this.ball.bounceOffOf(this.trashWalls[i], ballTrashWallResolution, cRest, cFriction);
                    this.ball.hitbox.color = "red";
                    this.trashWalls[i].hitbox.color = "red";
                }
            }
            else {
                this.trashWalls[i].hitbox.color = "black";
            }
        }

        for (var i = 0; i < this.walls.length; i++) {

            // player-wall collision handling
            var resolution = this.player.detectAndResolveCollisionWith(this.walls[i]);
            if (resolution) {
                this.player.hitbox.color = "red";
                this.walls[i].hitbox.color = "red";

                var normal = resolution;
                var cRest = 0;
                var cFriction = 0;

                if (this.walls[i].id == "Ground") {
                    cFriction = 0.2;
                    this.player.bounceOffOf(this.walls[i], normal, cRest, cFriction);
                    this.player.physics.velocity.y = 0;
                    this.player.hitGround();
                }
                else {
                    this.player.bounceOffOf(this.walls[i], normal, cRest, cFriction);
                }

            }
            else {
                this.walls[i].hitbox.color = "black";
            }


            // ball-wall collision handling
            var ballPlatformResolution = this.ball.detectAndResolveCollisionWith(this.walls[i]);
            if (ballPlatformResolution) {
                cFriction = 0.008;
                this.ball.bounceOffOf(this.walls[i], ballPlatformResolution, C_REST_WALL, cFriction);
            }
        }  

        if (this.ball.detectCollisionWith(this.trash)) {
            this.trash.hitbox.color = "green";
        } 
        else {
            this.trash.hitbox.color = "black";
        }

    }

    draw(g){
        g.clearRect(0, 0, this.width, this.height);
        super.draw(g);
        this.root.draw(g);

        var ctx = this.canvas.getContext("2d");
        ctx.font = "36px Georgia";
        ctx.fillText("Score: "+this.score, 750, 100);
    }

}


/**
 * THIS IS THE BEGINNING OF THE PROGRAM
 * YOU NEED TO COPY THIS VERBATIM ANYTIME YOU CREATE A GAME
 */
function tick(){
    game.nextFrame();
}


/* Get the drawing canvas off of the document */
var drawingCanvas = document.getElementById('game');
if(drawingCanvas.getContext) {
    var game = new Trashketball(drawingCanvas);
    game.start();
}
