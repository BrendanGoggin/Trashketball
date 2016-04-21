"use strict";

/**
 * A basic polygon class. Good for hitboxes and collisions
 * 
 */

class Polygon {
    
    // points: array of points, where each point is connected to points before and after it
    // last point connects to first point
    // points should be in counter-clockwise order
    constructor(points, shape) {
        this.points = copyPoints(points);
        if (!shape) this.shape = Rectangle;
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

}

/**
 * Return deep copy of point array
 */
function copyPoints(points) {
    var copy = [];
    for (var i = 0; i < points.length; i++) {
        var p = {x: points[i].x, y: points[i].y};
        copy.push(p);
    }
    return copy;
}

/**
 * Dectect collision between the two bodies using the Separating Axis Theorem
 * Takes in two bodies in global coordinates (probably hitboxes in global coords)
 */
function detectCollision(bodyA, bodyB) {
    if (bodyA.shape == "Rectangle" && bodyB.shape == "Rectangle") {

        // axes are unit-length normals of the rectangle's sides (2 unique axes)
        // debugger;
        var axes = [];
        axes = axes.concat(getAxes(bodyA));
        axes = axes.concat(getAxes(bodyB));
        // var axes = [axesA[0], axesA[1], axesB[0], axesB[1]];

        // the magnitide and direction (axis) of smallest overlap
        var overlapMagnitude = 99999999;
        var overlapAxis;
        var overlapSign;

        for (var i = 0; i < axes.length; i++) {

            // min/max values of each shape projected onto axes[i]
            var aMaxProj,
                aMinProj,
                bMaxProj,
                bMinProj;

            // projection values for bodyA
            for (var j = 0; j < bodyA.points.length; j++) {
                //debugger;
                var proj = projection(bodyA.points[j], axes[i]);
                var mag = magnitude(proj);
                var sign = (dotProduct(proj, axes[i]) < 0) ? -1 : 1;
                mag *= sign;

                if (j == 0) {
                    aMaxProj = mag;
                    aMinProj = mag;
                } else {
                    aMaxProj = Math.max(mag, aMaxProj);
                    aMinProj = Math.min(mag, aMinProj);
                }

            }

            // projection values for bodyB
            for (var j = 0; j < bodyB.points.length; j++) {

                var proj = projection(bodyB.points[j], axes[i]);
                var mag = magnitude(proj);
                var sign = (dotProduct(proj, axes[i]) < 0) ? -1 : 1;
                mag *= sign;

                if (j == 0) {
                    bMaxProj = mag;
                    bMinProj = mag;
                } else {
                    bMaxProj = Math.max(mag, bMaxProj);
                    bMinProj = Math.min(mag, bMinProj);
                }

            }

            // check for no collision
            if (aMaxProj < bMinProj || bMaxProj < aMinProj) {
                return false;
            }
            else {
                // console.log("axes[" + i + "]: (" + axes[i].x + ", " + axes[i].y + ")");
                // if (i == 3) debugger; 
                var currentOverlapMagnitude;
                var currentOverlapSign;

                if (aMaxProj >= bMinProj && bMaxProj >= aMinProj) {
                    var aMaxBMin = Math.abs(bMinProj - aMaxProj);
                    var bMaxAMin = Math.abs(aMinProj - bMaxProj);
                    if (aMaxBMin < bMaxAMin) {
                        currentOverlapMagnitude = aMaxBMin;
                        currentOverlapSign = (bMinProj - aMaxProj < 0) ? -1 : 1;
                    }
                    else {
                        currentOverlapMagnitude = bMaxAMin;
                        currentOverlapSign = (aMinProj - bMaxProj < 0) ? -1 : 1;
                    }
                }
                else if (aMaxProj >= bMinProj) {
                    currentOverlapMagnitude = Math.abs(bMinProj - aMaxProj);
                    currentOverlapSign = (bMinProj - aMaxProj < 0) ? -1 : 1;
                }
                else {
                    currentOverlapMagnitude = Math.abs(aMinProj - bMaxProj);
                    currentOverlapSign = (aMinProj - bMaxProj < 0) ? -1 : 1;
                }

                // debugger;
                if (currentOverlapMagnitude < overlapMagnitude) {
                    overlapAxis = i;
                    overlapMagnitude = currentOverlapMagnitude;
                    // overlapSign = currentOverlapSign;
                }
                // console.log("Current overlap Magnitude: " + currentOverlapMagnitude);
            }

        }
        // debugger;
        // console.log("Overlap Axis: " + overlapAxis);
        // console.log("Overlap Magnitude: " + overlapMagnitude);
        var overlapVector = multiplyVectorByScalar(axes[overlapAxis], overlapMagnitude);
        overlapSign = (dotProduct(overlapVector, axes[overlapAxis]) < 0) ? -1 : 1;

        // overlapSign = (overlapAxis < 2) ? 1 : -1;
        // overlapSign = -1;

        // var resolution =  multiplyVectorByScalar(overlapVector, overlapSign);
        // var centerA = {
        //     x: bodyA.points[3].x - bodyA.points[0].x,
        //     y: bodyA.points[1].y - bodyA.points[1].y
        // };
        // var centerB = {
        //     x: bodyB.points[3].x - bodyB.points[0].x,
        //     y: bodyB.points[1].y - bodyB.points[1].y
        // };
        // var centerBminusA = vectorSubtract(centerB, centerA);

        // overlapSign = 1;
        // if (dotProduct(overlapVector, centerBminusA) < 0) overlapSign = -1;
        // if (overlapAxis >= 4) overlapSign *= -1;

        var resolution = multiplyVectorByScalar(overlapVector, overlapSign);
        // var bodyATranslated = {};
        // bodyATranslated.points = copyPoints(bodyA.points);
        // bodyATranslated.shape = "Rectangle";
        // bodyATranslated.stop = true;
        // for (var i = 0; i < bodyATranslated.points.length; i++) {
        //     bodyATranslated.points[i] = vectorSubtract(bodyATranslated.points[i], resolution);
        // }

        // if (!bodyA.stop) {
        //     if (detectCollision(bodyATranslated, bodyB)) resolution = multiplyVectorByScalar(resolution, -1);
        // } 

        return resolution;

        // return overlapVector;

    }
}


/**
 * Given a body of type Polygon, return array of its axes
 *
 */
function getAxes(body) {

    if (body.shape == "Rectangle") {

        var axes = [];

        // approach: return normals for edges point0 to point1, point1 to point2,
        //       point2 to point3, and point3 to point0
        var point0 = {x: body.points[0].x, y: body.points[0].y};
        var point1 = {x: body.points[1].x, y: body.points[1].y};
        var point2 = {x: body.points[2].x, y: body.points[2].y};
        var point3 = {x: body.points[3].x, y: body.points[3].y};

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

/**
 * Return the unit-length normal (right-hand coord system) of the line
 * the line goes from point p0 to point p1
 */
function getNormal(p0, p1) {
    var dx = p1.x - p0.x;
    var dy = p1.y - p0.y;
    return normalize({x: -dy, y: dx});
}


