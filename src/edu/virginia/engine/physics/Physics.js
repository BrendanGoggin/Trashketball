"use strict";

// A basic set of physics fields/behavior for objects in the game

class Physics {

    constructor(mass) {
        this.mass = mass;
        this.velocity = {'x': 0, 'y': 0};
        // this.forces = false;
        this.gravity = {'x': 0, 'y': .0001};
        this.acceleration = {'x': 0, 'y': 0};
    }

    /**
     * Updates the position and this obj's fields for the time change 'dt' (milliseconds)
     *
     */
    update(position, dt) {
        // debugger;
        this.acceleration.x = this.gravity.x;
        this.acceleration.y = this.gravity.y;
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;
        position.x += this.velocity.x * dt;
        position.y += this.velocity.y * dt;
    }

}