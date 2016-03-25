"use strict";

// Geometry.js
// Contains some basic math functions

/**
 * Rotates the point by the angle specified (radians, counterclockwise)
 */
function rotate(point, theta) {
    var sineTheta = Math.sin(theta);
    var cosineTheta = Math.cos(theta);
    var oldX = point.x;
    var oldY = point.y;
    point.x = (oldX * cosineTheta) - (oldY * sineTheta);
    point.y = (oldX * sineTheta) + (oldY * cosineTheta);
}

/**
 * Scales the point by the factor specified
 * Factor: {'x': x, 'y': y}
 */
function scale(point, factor) {
    point.x = point.x * factor.x;
    point.y = point.y * factor.y;
}

/**
 * Translate the point by the specified vector
 * translation: {'x': x, 'y': y}
 */
function translate(point, vector) {
    point.x = point.x + vector.x;
    point.y = point.y + vector.y;
}