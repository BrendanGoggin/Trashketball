"use strict";

/**
 * A basic polygon class. Good for hitboxes and collisions
 * 
 */

class Polygon extends Hitbox {
    
    // points: array of points, where each point is connected to points before and after it
    // last point connects to first point
    // points should be in counter-clockwise order
    constructor(points, shape) {
        super();
        this.points = copyPoints(points);
        if (!shape) this.shape = "Rectangle";
        else this.shape = shape;
    }

    /**
     * toString
     */
    toString() {
        var output = "";
        for (var i = 0; i < this.points.length; i++) {
            output += "(" + this.points[i].x +", " + this.points[i].y + ")";
            if (i+1 < length) output += ", ";
        }
        return output;
    }

    /*
     * Projects shape onto axis and returns the minimum/maximum point
     * Necessary for collision detection using Separating Axis Theorem
     * returns [minProj, maxProj]
     */
    getMinMaxProjectionsOntoAxis(axis) {
        // min/max values of each shape projected onto axis
        var maxProj,
            minProj;

        // projection values
        for (var i = 0; i < this.points.length; i++) {
            //debugger;
            var proj = projection(this.points[i], axis);
            var mag = magnitude(proj);
            var sign = (dotProduct(proj, axis) < 0) ? -1 : 1;
            mag *= sign;

            if (i == 0) {
                maxProj = mag;
                minProj = mag;
            } else {
                maxProj = Math.max(mag, maxProj);
                minProj = Math.min(mag, minProj);
            }

        }
        return [minProj, maxProj];
    }

    /**
     * Returns array of this body's axes (normals to its sides)
     * Used for Separating Axis Theorem collision handling
     */
    getAxes() {

        if (this.shape == "Rectangle") {

            var axes = [];

            // approach: return normals for edges point0 to point1, point1 to point2,
            //       point2 to point3, and point3 to point0
            var point0 = {x: this.points[0].x, y: this.points[0].y};
            var point1 = {x: this.points[1].x, y: this.points[1].y};
            var point2 = {x: this.points[2].x, y: this.points[2].y};
            var point3 = {x: this.points[3].x, y: this.points[3].y};

            // get the normals
            var normal01 = getNormal(point0, point1);
            var normal12 = getNormal(point1, point2);
            var normal23 = getNormal(point2, point3);
            var normal30 = getNormal(point3, point0);

            axes[0] = normal01;
            axes[1] = normal12;
            axes[2] = normal23;
            axes[3] = normal30;

            return axes;
        }
    }

}

