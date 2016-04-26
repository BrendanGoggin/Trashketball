"use strict";

// A basic set of physics fields/behavior for objects in the game

var GRAVITY = 0.000025;

/**
 * Physics object to be attached to DisplayObjectNodes that have physics behavior.
 */
class Physics {

    /**
     * obj is the object to which this Physics object applies
     */
    constructor(obj) {
        this.obj = obj;
        // this.mass = (mass) ? mass : 0;
        this.velocity = {'x': 0, 'y': 0};
        // this.forces = false;
        this.gravity = {'x': 0, 'y': GRAVITY};
        this.acceleration = {'x': 0, 'y': 0};
        this.angularVelocity = 0;
        this.maxSpeed = false;
    }

    /**
     * Updates the position and this obj's fields for the time change 'dt' (milliseconds)
     */
    update(position, dt) {

        this.acceleration.x = this.gravity.x * dt;
        this.acceleration.y = this.gravity.y * dt;

        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;
        this.clampSpeed();

        this.obj.position.x += this.velocity.x * dt;
        this.obj.position.y += this.velocity.y * dt;

        this.obj.rotation += this.angularVelocity * dt;
        while (this.obj.rotation > 2 * Math.PI) this.obj.rotation -= 2 * Math.PI;
        while (this.obj.rotation < -2 * Math.PI) this.obj.rotation += 2 * Math.PI;

    }

    /**
     * Sets a maxSpeed to which velocity will always be clamped.
     */
    limitMaxSpeed(maxSpeed) {
        this.maxSpeed = maxSpeed;
        this.clampSpeed();
    }

    /**
     * Executes the clamping for the max speed
     */
    clampSpeed() {
        if (this.maxSpeed && this.maxSpeed !== 0) {
            var currentSpeed = magnitude(this.velocity);
            if (currentSpeed > this.maxSpeed) {
                var normalizedVelocity = normalize(this.velocity);
                this.velocity = multiplyVectorByScalar(normalizedVelocity, this.maxSpeed);
            }
        }
    }

}

/**
 * Additional physics functions
 */








