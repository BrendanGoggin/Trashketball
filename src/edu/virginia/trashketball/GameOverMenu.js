/**
 * This class contains methods for creating the Menu DisplayObjectNode
 */

"use strict";

// var KEY_W = 87;
// var KEY_A = 65;
// var KEY_S = 83;
// var KEY_D = 68;
// var KEY_UP_ARROW = 38;
// var KEY_LEFT_ARROW = 37;
// var KEY_DOWN_ARROW = 40;
// var KEY_RIGHT_ARROW = 39;
// var KEY_ENTER = 13;

// var FONT_HEIGHT = 60;
// var MENU_FONT = "" + FONT_HEIGHT + "px Comic Sans MS";
// var TEXT_COLOR = "";

var PAUSE_MENU_SPACING = 10;
var PAUSE_MENU_PADDING = 15;
var PAUSE_MENU_POSITION_X = 70;

class GameMenu extends DisplayObjectNode {


    constructor(id, filename) {
        super(id, ""); // has no image, just a parent node

        // levels (nodes of level names for player to select)
        this.options = [];
        // this.levelSelected = 0;
        this.background = false; // a background sprite (to be set)
        this.selected = -1;
        this.cursor = false; // a node represented the cursor for selecting things

        this.upPressed = false;
        this.downPressed = false;

        this.restartGame = false;
        this.backToMainMenu = false;

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
            if (this.selected != -1) {
                this.choose(this.selected);
            }
        }
    }

    /**
     * "Chooses" the level specified. AKA hitting enter on the level
     *  specified, or clicking on it.
     */
    choose(optionNumber) {
        this.chooseSound.play();
        if (optionNumber < 0 || optionNumber > this.options.length - 1) return;
        switch (optionNumber) {
            
            // resume game
            case 0:
                this.resumeGame = true;
                break;
            case 1:
                this.backToMainMenu = true;

        }
    }


    /**
     * Selects the level with the specified number, but doesn't 'click' it
     * Unselects the level which was previously selected, if there was one
     */
    select(optionNumber) {
        if (this.selected != -1) this.options[this.selected].unselect(this.cursor);
        this.selected = optionNumber;
        this.options[optionNumber].select(this.cursor);
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
        if (selected < 0) selected = this.options.length - 1;
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
        var selected = (this.selected + 1) % this.options.length;
        this.select(selected);
    }

    /**
     * Returns the parent node of the level's walls
     * success is a boolean
     */
    static makeGameOverMenuLayer(success) {

        var layer = new PauseMenu("GameOverMenu", "");
        layer.background = makePauseLayer();
        layer.addChild(layer.background);

        layer.cursor = this.makeCursor();

        var optionCount = 2;
        var optionRestart = this.makeRestartGame(0, 2);
        var optionBack = this.makeBackToMainMenu(1, 2);

        layer.options.push(optionRestart);
        layer.addChild(optionRestart);

        layer.options.push(optionBack);
        layer.addChild(optionBack);


        layer.select(0);
        return layer;
    };


    /**
     * Makes the level title nodes for the player to select from
     */
    static makeRestartGame(optionNumber, optionCount) {
        var optionText = "Restart Game";
        var optionNode = new TextNode("RestartGame", optionText);
        optionNode.font = MENU_FONT;
        var optionPositionX = PAUSE_MENU_POSITION_X;
        var optionPositionY = this.generateYCoordinate(optionNumber, optionCount);
        optionNode.position = ({x: optionPositionX, y: optionPositionY});

        return optionNode;
    }


    /**
     * Makes the "Back to Main Menu" option TextNode
     */
    static makeBackToMainMenu(optionNumber, optionCount) {
        var optionText = "Back to Main Menu";
        var optionNode = new TextNode("BackToMainMenu", optionText);
        optionNode.font = MENU_FONT;
        var optionPositionX = PAUSE_MENU_POSITION_X;
        var optionPositionY = this.generateYCoordinate(optionNumber, optionCount);
        optionNode.position = ({x: optionPositionX, y: optionPositionY});

        return optionNode;
    }


    /**
     * Generates the Y coordinate of the option TextNode
     */
    static generateYCoordinate(optionNumber, optionCount) {
        var paddingTop = PAUSE_MENU_PADDING;
        var paddingBottom = PAUSE_MENU_PADDING;
        var spacing = PAUSE_MENU_SPACING;
        var yCoord = (((600.0 - paddingTop - paddingBottom) / optionCount) * optionNumber);
        yCoord += spacing + MENU_FONT_HEIGHT + paddingTop;
        return yCoord;
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

}