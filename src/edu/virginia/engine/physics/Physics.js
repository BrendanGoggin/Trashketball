"use strict";

// A basic set of physics fields/behavior for objects in the game

var GRAVITY = 0.0002;


// defualt values for angular velocity behavior
var ANGULAR_COEFF = 0.015;
var MAX_ANGULAR_SPEED = 0.005;

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

        this.angularProportionalToTranslational = false;
        this.angularCoefficient = ANGULAR_COEFF;
        this.maxAngularSpeed = false;
    }

    /**
     * Updates the position and this obj's fields for the time change 'dt' (milliseconds)
     */
    update(position, dt) {

        this.velocity.x += (this.acceleration.x + this.gravity.x) * dt;
        this.velocity.y += (this.acceleration.y + this.gravity.y) * dt;
        this.clampSpeed();

        this.obj.position.x += this.velocity.x * dt;
        this.obj.position.y += this.velocity.y * dt;

        // update angular vel to be proportional to translational vel
        if (this.angularProportionalToTranslational) {
            this.angularVelocity = this.angularCoefficient * -this.velocity.x;
        }
        this.clampAngularSpeed();

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
     * Sets a maxAngularSpeed to which angular velocity will always be clamped.
     */
    limitMaxAngularSpeed(maxAngularSpeed) {
        if (!maxAngularSpeed) maxAngularSpeed = MAX_ANGULAR_SPEED;
        this.maxAngularSpeed = maxAngularSpeed;
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

    /**
     * Executes the clamping for the max angular speed
     */
    clampAngularSpeed() {
        if (this.maxAngularSpeed && this.maxAngularSpeed !== 0) {
            var currentAngularSpeed = this.angularVelocity;
            if (Math.abs(currentAngularSpeed) > this.maxAngularSpeed) {
                this.angularVelocity = this.maxAngularSpeed;
                this.angularVelocity *= (currentAngularSpeed < 0) ? -1 : 1;
            }
        }
    }

    /** 
     * Makes angular velocity proportional to velocity
     */
    makeAngularProportionalToTranslational(coefficient) {
        if (!coefficient) coefficient = ANGULAR_COEFF;
        this.angularCoefficient = coefficient;
        this.angularProportionalToTranslational = true;
    }

}

/**
 * Additional physics functions
 */








