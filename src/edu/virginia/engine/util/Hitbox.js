"use strict";

/**
 * Hitbox interface/base class to be implemented/extended by hitbox shapes
 * 
 */

class Hitbox {
    
    // default constructor, to be replaced in subclasses
    constructor() {}

    /*
     * Projects shape onto axis and returns the minimum/maximum point
     * Necessary for collision detection using Separating Axis Theorem
     * returns [minProj, maxProj]
     */
    getMinMaxProjectionsOntoAxis(axis) {}

    /**
     * Returns array of axes to use for Separating Axis Theorem
     */
    getAxes() {}
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

    // if (bodyA.shape == "Circle") {
    //     debugger;
    // }

    // note: KEEP CIRCLES PROPORTIONALLY SCALED, ovals don't work for collisions
    if (bodyA.shape == "Circle" && bodyB.shape == "Circle") {
        debugger;
        var circleA = bodyA,
            circleB = bodyB;
        var direction = vectorSubtract(circleB.center, circleA.center);

        // if no overlap, return false
        if (magnitude(direction) > circleA.radius + circleB.radius) {
            return false;
        }

        var axis = normalize(direction);
        var overlap = circleA.radius + circleB.radius - magnitude(direction);

        return multiplyVectorByScalar(axis, overlap);

    }

    else {

        // axes are unit-length normals of the rectangle's sides (2 unique axes)
        // debugger;
        var axes = [];
        axes = axes.concat(bodyA.getAxes());
        axes = axes.concat(bodyB.getAxes());
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

            var aProjections = bodyA.getMinMaxProjectionsOntoAxis(axes[i]);
            aMinProj = aProjections[0];
            aMaxProj = aProjections[1];

            var bProjections = bodyB.getMinMaxProjectionsOntoAxis(axes[i]);
            bMinProj = bProjections[0];
            bMaxProj = bProjections[1];

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
        var overlapVector = multiplyVectorByScalar(axes[overlapAxis], overlapMagnitude);
        overlapSign = (dotProduct(overlapVector, axes[overlapAxis]) < 0) ? -1 : 1;

        var resolution = multiplyVectorByScalar(overlapVector, overlapSign);
        return resolution;
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


