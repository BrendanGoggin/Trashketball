/**
 * This class contains methods for creating the Menu DisplayObjectNode
 */

"use strict";

var KEY_W = 87;
var KEY_A = 65;
var KEY_S = 83;
var KEY_D = 68;
var KEY_UP_ARROW = 38;
var KEY_LEFT_ARROW = 37;
var KEY_DOWN_ARROW = 40;
var KEY_RIGHT_ARROW = 39;
var KEY_ENTER = 13;

var MENU_FONT_HEIGHT = 60;
var MENU_FONT = "" + MENU_FONT_HEIGHT + "px Comic Sans MS";
var TEXT_COLOR = "";

class Menu extends DisplayObjectNode {


    constructor(id, filename) {
        super(id, ""); // has no image, just a parent node

        // levels (nodes of level names for player to select)
        this.levels = [];
        // this.levelSelected = 0;
        this.background = false; // a background sprite (to be set)
        this.selected = -1;
        this.cursor = false; // a node represented the cursor for selecting things

        this.upPressed = false;
        this.downPressed = false;

        this.loadNewLevel = -1;

        this.sounds = [];

        this.cursorUpSound = new Audio();
        this.cursorUpSound.src = 'resources/sounds/menu_select_2_trimmed.wav';
        this.sounds.push(this.cursorUpSound);

        this.cursorDownSound = new Audio();
        this.cursorDownSound.src = 'resources/sounds/menu_select_1_trimmed.wav';
        this.sounds.push(this.cursorDownSound);

        this.chooseSound = new Audio();
        this.chooseSound.src = 'resources/sounds/menu_enter_1.wav';
        this.sounds.push(this.chooseSound);

    }


    update(pressedKeys, dt) {

        this.pollPressedKeys(pressedKeys);

        this.updateChildren(pressedKeys, dt);
    }


    /**
     * Handles key presses
     */
    pollPressedKeys(pressedKeys) {

        // Up
        if (pressedKeys.contains(KEY_W) || pressedKeys.contains(KEY_UP_ARROW)) {
            if (!this.upPressed) {
                this.moveCursorUp();
                this.upPressed = true;
            }
        }
        else {
            this.upPressed = false;
        }

        // Down
        if (pressedKeys.contains(KEY_S) || pressedKeys.contains(KEY_DOWN_ARROW)) {
            if (!this.downPressed) {
                this.moveCursorDown();
                this.downPressed = true;
            }
        }
        else {
            this.downPressed = false;
        }

        // Enter
        if (pressedKeys.contains(KEY_ENTER)) {
            if (!this.enterPressed) {
                if (this.selected != -1) {
                    this.choose(this.selected);
                }
            }
            this.enterPressed = true;
                
        }
        else {
            this.enterPressed = false;
        }

    }

    /**
     * "Chooses" the level specified. AKA hitting enter on the level
     *  specified, or clicking on it.
     */
    choose(levelNumber) {
        this.chooseSound.play();
        if (levelNumber < 0 || levelNumber > this.levels.length - 1) return;
        this.loadNewLevel = levelNumber;
    }


    /**
     * Selects the level with the specified number, but doesn't 'click' it
     * Unselects the level which was previously selected, if there was one
     */
    select(levelNumber) {
        if (this.selected != -1) this.levels[this.selected].unselect(this.cursor);
        this.selected = levelNumber;
        this.levels[levelNumber].select(this.cursor);
    }


    /**
     * Moves the cursor up
     */
    moveCursorUp() {
        this.cursorUpSound.play();
        if (this.selected == -1) {
            var selected = 0;
            this.select(selected);
            return;
        }
        var selected = this.selected - 1;
        if (selected < 0) selected = this.levels.length - 1;
        this.select(selected);
    }


    /**
     * Moves the cursor down
     */
    moveCursorDown() {
        this.cursorDownSound.play();
        if (this.selected == -1) {
            var selected = 0;
            this.select(selected);
            return;
        }
        var selected = (this.selected + 1) % this.levels.length;
        this.select(selected);
    }

    /**
     * Returns the parent node of the level's walls
     */
    static makeMenuLayer() {


        var layer = new Menu("Menu", "");
        layer.background = new DisplayObjectNode("MenuBackground", "MenuBackground.jpg");
        layer.addChild(layer.background);

        layer.cursor = this.makeCursor();

        // var levelHeight = 100;
        // var levelWidth = 200;

        var levelCount = 3;

        for (var i = 0; i < levelCount; i++) {
            var levelNode = this.makeLevel(i, levelCount);
            layer.levels.push(levelNode);
            layer.addChild(levelNode);
        }

        layer.select(0);
        return layer;
    };


    /**
     * Makes the level title nodes for the player to select from
     */
    static makeLevel(levelNumber, levelCount) {
        var levelNumberText = this.levelNumberToText(levelNumber + 1);
        var levelNode = new TextNode("Level"+levelNumber+1, "Level " + levelNumberText);
        levelNode.font = MENU_FONT;
        var spacing = 10;
        var paddingTop = 15;
        var paddingBottom = 15;
        var levelPositionX = 70;
        var levelPositionY = (((600.0 - paddingTop - paddingBottom) / levelCount) * levelNumber);
        levelPositionY += spacing + MENU_FONT_HEIGHT + paddingTop;
        levelNode.position = ({x:levelPositionX, y: levelPositionY});

        return levelNode;
    }

    /**
     * Makes the cursor node
     */
    static makeCursor() {
        
        var cursorNode = new Sprite("Cursor", "Ball.png");
        cursorNode.setPosition({x: -30, y: -20});
        cursorNode.setPivotPoint({x:75,y:70});
        cursorNode.setScale({x:.35, y:.35});
        cursorNode.physics = new Physics(cursorNode);
        cursorNode.physics.gravity = {x:0, y:0};
        cursorNode.physics.angularVelocity = -0.001;

        return cursorNode;
    }


    /**
     * Converts level numbers to text numbers (1 becomes "One")
     * Only does 1-8, but could easily be extended to more numbers
     */
    static levelNumberToText(levelNumber) {
        switch (levelNumber) {
            case 1:
                return "One";
            case 2:
                return "Two";
            case 3:
                return "Three";
            case 4:
                return "Four";
            case 5:
                return "Five";
            case 6:
                return "Six";
            case 7:
                return "Seven";
            case 8:
                return "Eight";
            default:
                return;
        }
    }


}