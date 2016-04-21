// DisplayObjectNode.js
// Node in the display tree

"use strict";

/**
 * A very basic display object for a javascript based gaming engine
 * 
 */
class DisplayObjectNode extends DisplayObject {
    
    constructor(id, filename){
        super(id, filename);
        this.children = []; // child nodes of this DONode
        this.parent = false; // the parent node of this node
        this.hitbox = false;
        // this.hitbox.color = "black";
        this.showHitbox = false; // set to true to draw the object's hitbox (for debugging)
        this.physics = false;
        this.normal = {x: 0, y: 1}; // normal is in the y direction unless otherwise specified
    }

    /**
     * Invoked every frame
     * dt: time since last call (ms)
     */
    update(dt) {
        // update each child node
        if (this.physics) this.physics.update(this.position, dt);
        this.updateChildren(dt);
    }

    /**
     * calls update on the node's children
     *
     */
    updateChildren(dt) {
        this.children.forEach(function(child) {
            child.update(dt);
        });
    }

    /**
     * Draws this image to the screen and calls draw on its children
     */
    draw(g) {
        if(this.visible) {
            this.applyTransformations(g);
            if(this.loaded && this.displayImage) this.drawSelfImage(g);
            if (this.showHitbox) this.drawHitbox(g);
            this.children.forEach(function(child) {
                child.draw(g);
            });
            this.reverseTransformations(g);
        }
    }

    /**
     *  Draws just this obj's hitbox to the screen,
     *  Doesn't apply transformations or anything else.
     *  Is called in the draw(g) method if this.showHitbox == true.
     */
     drawHitbox(g) {
        if (this.hitbox) {
            if (this.hitbox.color) {
                g.strokeStyle = this.hitbox.color;
            }
            else {
                g.strokeStyle = "black";
            }
            g.lineWidth = 3;
            g.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
        }
     }


    /**
     * Rotates the normal vector and returns it in global space
     */
    rotateToGlobal(vector) {
        if (this.scale.x < 0) vector.x *= -1;
        if (this.scale.y < 0) vector.y *= -1;
        rotate(vector, this.rotation);
        if (this.hasParent()) this.parent.rotateToGlobal(vector);
        return;
    }

    /**
     * Rotates the vector from global to local orientation, doesn't translate it or scale it
     */
    rotateToLocal(vector) {
        if (this.hasParent()) this.parent.rotateToGlobal(vector);
        rotate(vector, this.rotation);
        // if (this.scale.x < 0) vector.x *= -1;
        // if (this.scale.y < 0) vector.y *= -1;
        //scale(vector, {'x': 1/this.scale.x, 'y': 1/this.scale.y});
        return;
    }


    /**
     * Converts the point from local to global coordinates
     * returns the point
     * point: {'x': x, 'y': y}
     */
    convertPointFromLocalToGlobal(point) {
        // transformations for this node, then call recursively on parent
        scale(point, this.scale);
        rotate(point, -this.rotation);
        translate(point, this.position);

        if (this.hasParent()) this.parent.convertPointFromLocalToGlobal(point);
        return;
    }

    /**
     * Converts the point from local to global coordinates
     * returns the point
     * point: {'x': x, 'y': y}
     */
    convertPointFromGlobalToLocal(point) {
        // perform forward transformations for this node from global to local
        // call recursively on parent
        if (this.hasParent()) this.parent.convertPointFromGlobalToLocal(point);
        translate(point, {'x':-this.position.x, 'y':-this.position.y});
        rotate(point, this.rotation);
        scale(point, {'x': 1/this.scale.x, 'y': 1/this.scale.y});
        return;
    }

    /**
     * Checks if this is colliding with the passed in object.
     * returns point number if yes, -1 otherwise (including an object not having hitbox)
     */
    collidesWith(o) {
        if (!this.hitbox || !o.hitbox) return false;

        var p0 = {'x': o.hitbox.getMinX(), 'y': o.hitbox.getMinY()};
        var p1 = {'x': o.hitbox.getMinX(), 'y': o.hitbox.getMaxY()};
        var p2 = {'x': o.hitbox.getMaxX(), 'y': o.hitbox.getMaxY()};
        var p3 = {'x': o.hitbox.getMaxX(), 'y': o.hitbox.getMinY()};

        o.convertPointFromLocalToGlobal(p0);
        o.convertPointFromLocalToGlobal(p1);
        o.convertPointFromLocalToGlobal(p2);
        o.convertPointFromLocalToGlobal(p3);

        this.convertPointFromGlobalToLocal(p0);
        this.convertPointFromGlobalToLocal(p1);
        this.convertPointFromGlobalToLocal(p2);
        this.convertPointFromGlobalToLocal(p3);

        if (this.hitbox.containsPoint(p0)) {
            return 0;
        }
        if (this.hitbox.containsPoint(p1)) {
            return 1;
        }
        if (this.hitbox.containsPoint(p2)) {
            return 2;
        }
        if (this.hitbox.containsPoint(p3))  {
            return 3;
        }
        return -1;
    }

    /**
     * Appends child to end of children array
     */
    addChild(child) {
        this.children.push(child);
        child.parent = this;
    }

    /**
     * Appends child to end of children array
     */
    addChildAtIndex(child, index) {
        this.children.splice(index, 0, child);
        child.parent = this;
    }

    /**
     * Removes the given child (checks by id)
     */
    removeChild(child) {
        var index = this.getIndexOfChild(child);
        if (index != -1) {
            this.children.splice(index, 1);
        }
        child.parent = false;
    }

    /**
     * Removes the child at the given index, if there is one
     */
    removeChildAtIndex(index) {
        if (index < this.children.length) {
            this.children.splice(index, 1);
        }
        child.parent = false;
    }

    /**
     * Returns the index of the given child, -1 if it doesn't have it
     */
     getIndexOfChild(child) {
        if (child === undefined || child.id === undefined) return -1;
        this.children.forEach(function(entry, index, array) {
            if (child.id === entry.id) return index;
        });
        return -1;
    }


    /**
     * Method needed for lab 3. I don't like it's name. Will delete after grading.
     */
    contains(child) {
        return this.hasChild(child);
    }

    /**
     * Returns true if the node has a parent, false otherwise
     */
    hasParent() {
        return !!this.parent;
    }

    /**
     * Returns true if the param is a direct child of this node
     */
    hasChild(child) {
        if (child === undefined || child.id === undefined) return false;
        this.children.forEach(function(entry) {
            if (child.id === entry.id) return true;
        });
        return false;
    }

    /**
     * Gets a child by the given id, returns false if not found
     */
    getChildById(childId) {
        if (childId === undefined) return false;
        this.children.forEach(function(entry) {
            if (childId === entry.id) return entry;
        });
        return false;
    }

    /**
     * Gets the child at the given index
     */
    getChildAtIndex(index) {
        if (index === undefined || index >= this.children.length) return false;
        return this.children[index];
    }


    /**
     * Bounces this node off of the node passed in as a param
     * Assumes the param node is immovable, this node gets bounced
     * cRest is the coefficient of restitution (optional)
     */
    bounceOffOf(otherNode, cRest) {
        // debugger;
        // velocity of this, normal of that
        var v = this.physics.velocity;
        var n = normalize({x:otherNode.normal.x, y:otherNode.normal.y});
        otherNode.rotateToGlobal(n);

        // coefficient of restitution (bounciness)

        var bounce = cRest;
        if (bounce == undefined) bounce = 1.0;
        bounce = 1 + bounce;

        // component of v parallel to n
        var vPar = multiplyVectorByScalar(n, dotProduct(v, n));

        // change v for the "bounce": v - vPerp * cRest
        v = vectorSubtract(v, multiplyVectorByScalar(vPar, bounce));

        // set the new v
        this.physics.velocity = v;
    }

    /**
     * collision detection and resolution between this and other object
     * this object is moved if collision resolution is needed, other object stays in place
     * returns true iff collision occurs
     */
    detectCollisionWith(other) {

        var thisHitboxPolygon = this.hitbox.toPolygon();
        var otherHitboxPolygon = other.hitbox.toPolygon();

        //console.log("Player starting position: (" + this.player.position.x + ", " + this.player.position.y + ")");

        for (var j = 0; j < 4; j++) {
            this.convertPointFromLocalToGlobal(thisHitboxPolygon.points[j]);
            other.convertPointFromLocalToGlobal(otherHitboxPolygon.points[j]);
        }

        var resolution = detectCollision(thisHitboxPolygon, otherHitboxPolygon);

        if (resolution) {
            return true;
        }
        return false;
    }

    /**
     * collision detection and resolution between this and other object
     * this object is moved if collision resolution is needed, other object stays in place
     * returns true iff collision occurs
     */
    detectAndResolveCollisionWith(other) {

        var thisHitboxPolygon = this.hitbox.toPolygon();
        var otherHitboxPolygon = other.hitbox.toPolygon();

        //console.log("Player starting position: (" + this.player.position.x + ", " + this.player.position.y + ")");

        for (var j = 0; j < 4; j++) {
            this.convertPointFromLocalToGlobal(thisHitboxPolygon.points[j]);
            other.convertPointFromLocalToGlobal(otherHitboxPolygon.points[j]);
        }

        var resolution = detectCollision(thisHitboxPolygon, otherHitboxPolygon);

        if (resolution) {
            
            var resolutionConverted = {x: resolution.x, y: resolution.y};
            resolutionConverted = multiplyVectorByScalar(resolutionConverted, 1.1);
            if (this.parent) this.parent.convertPointFromGlobalToLocal(resolutionConverted);
            this.position = vectorSubtract(this.position, resolutionConverted);

            // check again for collision, in case resolution was backwards...
            thisHitboxPolygon = this.hitbox.toPolygon();
            for (var j = 0; j < 4; j++) {
                this.convertPointFromLocalToGlobal(thisHitboxPolygon.points[j]);
            }

            // if it was backwards, rectify it
            if (detectCollision(thisHitboxPolygon, otherHitboxPolygon)) {
                // debugger;
                resolution = multiplyVectorByScalar(resolution, -2);
                if (this.parent) this.parent.convertPointFromGlobalToLocal(resolution);
                this.position = vectorSubtract(this.position, resolution);
            }

            return true;

        }

        return false;
    }

    /**
     * kicker kicks o
     */
    // kick(kicker, o) {
    //     var sign = dotProduct(kicker.normal, o.physics.velocity);
    //     if (sign < 0) sign = -1;
    //     else sign = 1;
    //     o.physics.velocity = {x: sign * kickpower.x, y: sign * kickpower.y};
    // }


    /**
     * Getters and Setters
     *
     */
    getHitbox() {return this.hitbox;} // hitbox should be a Rectangle
    setHitbox(hitbox) {this.hitbox = hitbox;}
    getChildren() {return this.children;}
    getParent() {return this.parent;}
}

