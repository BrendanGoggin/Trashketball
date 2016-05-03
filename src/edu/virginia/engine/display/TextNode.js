"use strict";

var DEFAULT_FONT = "36px Comic Sans MS";
var FONT_COLOR = "black";
var FONT_COLOR_SELECTED = "#b9d5b7";
var FONT_COLOR_DISABLED = "#555555";

/**
 * A node which draws text instead of an image
 * 
 * */
class TextNode extends DisplayObjectNode {
    
    constructor(id, text){
        super(id, "");

        this.text = text;
        this.font = DEFAULT_FONT;
        this.fontColorUnselected = FONT_COLOR;
        this.fontColorSelected = FONT_COLOR_SELECTED;
        this.fontColor = this.fontColorUnselected;
        this.selected = false;

    }

    /**
     * Invoked every frame, manually for now, but later automatically if this DO is in DisplayTree
     * dt: time since last call (ms)
     */
    // update(pressedKeys, dt){
        
    // }


    /**
     * Draws this image to the screen
     */
    draw(g) {
        this.applyTransformations(g);
        if (this.text) {
            if (this.font) g.font = this.font;
            if (this.fontColor) g.fillStyle = this.fontColor;
            g.fillText(this.text, -this.pivotPoint.x, -this.pivotPoint.y);
        }
        this.children.forEach(function(child) {
            child.draw(g);
        });
        this.reverseTransformations(g);
    }


    /**
     * Makes this node appear as "selected"
     * Cursor: optional param, node to be added as child of this one on selection
     */
    select(cursorNode) {
        this.fontColor = this.fontColorSelected;
        this.selected = true;
        if (cursorNode) {
            this.cursor = cursorNode;
            this.addChild(cursorNode);
        }
    }


    /**
     * Marks this node as "unselected", adjusts appearance
     * cursor: optional param, node to be removed as child of this one on unselection
     */
     unselect() {
        if (this.selected) {
            this.selected = false;
            this.fontColor = this.fontColorUnselected;
            if (this.cursor) {
                this.removeChild(this.cursor);
                this.cursor = false;
            }
        }
     }


}