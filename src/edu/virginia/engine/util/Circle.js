"use strict";

/**
 * A basic polygon class. Good for hitboxes and collisions
 * 
 */

class Circle extends Hitbox {
    
    // points: array of points, where each point is connected to points before and after it
    // last point connects to first point
    // points should be in counter-clockwise order
    constructor(center, radius) {
        super();
        this.center = center;
        this.radius = radius;
        this.shape = "Circle";
    }

    /*
     * Projects shape onto axis and returns the minimum/maximum point
     * Necessary for collision detection using Separating Axis Theorem
     * returns [minProj, maxProj]
     */
    getMinMaxProjectionsOntoAxis(axis) {
        // min/max values of each shape projected onto axis
        var minProj,
            maxProj;

        var centerProj = projection(this.center, axis);
        var centerProjMag = magnitude(centerProj);
        var centerProjSign = (dotProduct(centerProj, axis) < 0) ? -1 : 1;
        centerProjMag *= centerProjSign;

        minProj = centerProjMag - this.radius;
        maxProj = centerProjMag + this.radius;


        return [minProj, maxProj];
    }


    /**
     * Returns a deep copy of this circle
     */
    getCopy() {
        var copyCenter = copyPoints([this.center])[0];
        return new Circle(copyCenter, this.radius);
    }

    /**
     * Get axes returns empty array for circle
     */
    getAxes() {
        return [];
    }

}