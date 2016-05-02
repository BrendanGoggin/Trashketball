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
    update(pressedKeys, dt) {
        // update each child node
        if (this.physics) this.physics.update(this.position, dt);
        this.updateChildren(pressedKeys, dt);
    }

    /**
     * calls update on the node's children
     *
     */
    updateChildren(pressedKeys, dt) {
        this.children.forEach(function(child) {
            child.update(pressedKeys, dt);
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

            if (this.hitbox.shape == "Rectangle" && !this.points) {
                g.strokeRect(this.hitbox.x, this.hitbox.y, this.hitbox.width, this.hitbox.height);
            }
            else if (this.hitbox.shape == "Circle") {
                g.beginPath();
                g.arc(this.hitbox.center.x, this.hitbox.center.y, this.hitbox.radius, 0, 2 * Math.PI, false);
                g.stroke();
            }
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
        if (this.hasParent()) this.parent.rotateToLocal(vector);
        rotate(vector, this.rotation);
        // if (this.scale.x < 0) vector.x *= -1;
        // if (this.scale.y < 0) vector.y *= -1;
        //scale(vector, {'x': 1/this.scale.x, 'y': 1/this.scale.y});
        return;
    }

    /**
     * Scales the vector to global and returns it in global scale
     */
    scaleToGlobal(vector) {
        scale(vector, this.scale);
        if (this.hasParent()) this.parent.scaleToGlobal(vector);
        return;
    }

    /**
     * Scales the vector to local and returns it in local scale
     */
    scaleToLocal(vector) {
        if (this.hasParent()) this.parent.scaleToLocal(vector);
        scale(vector, {x:1.0/this.scale.x, y:1.0/this.scale.y});
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
        var index = -1; 
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].id == child.id) index = i;
        }
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
     * normal is the normal of the surface of otherNode (get it from detectCollision)
     */
    bounceOffOf(otherNode, normal, cRest, cFriction) {

        // velocity of this, normal of other node
        var v = {x: this.physics.velocity.x, y: this.physics.velocity.y};
        var n;

        if (normal) {
            n = normalize(normal);
        }
        else {
            n = normalize({x:otherNode.normal.x, y:otherNode.normal.y});
            otherNode.rotateToGlobal(n);
        }

        // coefficient of restitution (bounciness)
        var bounce = cRest;

        if (bounce == undefined) bounce = 1.0;
        bounce = 1 + bounce;

        // components of v parallel/perpendicular to n
        var vPar  = multiplyVectorByScalar(n, dotProduct(v, n));
        var vPerp = vectorSubtract(v, vPar);

        // adjust for friction
        if (cFriction) {
            v = vectorSubtract(v, multiplyVectorByScalar(vPerp, cFriction));
        }

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

        var thisHitbox = this.hitbox;
        var otherHitbox = other.hitbox;


        // convert Rectangles to Polygons
        if (this.hitbox.shape == "Rectangle" && !this.hitbox.points) {
            thisHitbox = this.hitbox.toPolygon();
        }

        if (other.hitbox.shape == "Rectangle" && !other.hitbox.points) {
            var otherHitbox = other.hitbox.toPolygon();
        }


        // convert rectangle Polygons to global coordinates
        if (this.hitbox.shape == "Rectangle") {
            for (var j = 0; j < 4; j++) {
                this.convertPointFromLocalToGlobal(thisHitbox.points[j]);
            }
        }
        if (other.hitbox.shape == "Rectangle") {
            for (var j = 0; j < 4; j++) {
                other.convertPointFromLocalToGlobal(otherHitbox.points[j]);
            }
        }


        // convert circles to global coordinates
        if (this.hitbox.shape == "Circle") {
            thisHitbox = thisHitbox.getCopy();
            this.convertPointFromLocalToGlobal(thisHitbox.center);
            var scaler = {x:1, y:0};
            this.scaleToGlobal(scaler);
            thisHitbox.radius *= Math.abs(scaler.x);
        }
        if (other.hitbox.shape == "Circle") {
            otherHitbox = otherHitbox.getCopy();
            other.convertPointFromLocalToGlobal(otherHitbox.center);
            var scaler = {x:1, y:0};
            other.scaleToGlobal(scaler);
            otherHitbox.radius *= Math.abs(scaler.x);
        }

        var resolution = detectCollision(thisHitbox, otherHitbox);

        if (resolution) {
            return true;
        }
        return false;
    }

    /**
     * collision detection and resolution between this and other object
     * this object is moved if collision resolution is needed, other object stays in place
     * returns resolution vector iff collision occurs
     */
    detectAndResolveCollisionWith(other) {

        var thisHitbox = this.hitbox;
        var otherHitbox = other.hitbox;


        // convert Rectangles to Polygons
        if (this.hitbox.shape == "Rectangle" && !this.hitbox.points) {
            thisHitbox = this.hitbox.toPolygon();
        }

        if (other.hitbox.shape == "Rectangle" && !other.hitbox.points) {
            var otherHitbox = other.hitbox.toPolygon();
        }


        // convert rectangle Polygons to global coordinates
        if (this.hitbox.shape == "Rectangle") {
            for (var j = 0; j < 4; j++) {
                this.convertPointFromLocalToGlobal(thisHitbox.points[j]);
            }
        }
        if (other.hitbox.shape == "Rectangle") {
            for (var j = 0; j < 4; j++) {
                other.convertPointFromLocalToGlobal(otherHitbox.points[j]);
            }
        }


        // convert circles to global coordinates
        if (this.hitbox.shape == "Circle") {
            thisHitbox = thisHitbox.getCopy();
            this.convertPointFromLocalToGlobal(thisHitbox.center);
            var scaler = {x:1, y:0};
            this.scaleToGlobal(scaler);
            thisHitbox.radius *= Math.abs(scaler.x);
        }
        if (other.hitbox.shape == "Circle") {
            otherHitbox = otherHitbox.getCopy();
            other.convertPointFromLocalToGlobal(otherHitbox.center);
            var scaler = {x:1, y:0};
            other.scaleToGlobal(scaler);
            otherHitbox.radius *= Math.abs(scaler.x);
        }

        var resolution = detectCollision(thisHitbox, otherHitbox);

        if (resolution) {
            
            var resolutionConverted = {x: resolution.x, y: resolution.y};
            resolutionConverted = multiplyVectorByScalar(resolutionConverted, 1.1);
            if (this.parent) this.parent.convertPointFromGlobalToLocal(resolutionConverted);
            this.position = vectorSubtract(this.position, resolutionConverted);

            // check again for collision, in case resolution was backwards
            // if it was backwards, rectify it
            if (this.detectCollisionWith(other)) {
                // debugger;
                var fixedResolution = multiplyVectorByScalar(resolution, -2);
                if (this.parent) this.parent.convertPointFromGlobalToLocal(fixedResolution);
                this.position = vectorSubtract(this.position, fixedResolution);
                return multiplyVectorByScalar(fixedResolution, 0.5);
            }
            else {
                return resolution;
            }
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

