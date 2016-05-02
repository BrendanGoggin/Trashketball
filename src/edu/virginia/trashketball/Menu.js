// /**
//  * This class contains methods for creating the Menu DisplayObjectNode
//  */

// "use strict";

// class Menu extends DisplayObjectNode {


//     constructor(id, filename) {
//         super(id, ""); // has no image, just a parent node

//         // levels (nodes of level names for player to select)
//         this.levels = [];
//         this.levelSelected = 0;
//         this.background = false; // a background sprite (to be set)



//     }


//     update(pressedKeys, dt) {

//     }

//     /**
//      * Returns the parent node of the level's walls
//      */
//     static makeMenuLayer() {

//         var levelHeight = 100;
//         var levelWidth = 200;
//         var levelCount = 5;

//         for (var i = 0; i < levelCount; i++) {
//             this.levels.push(this.makeLevel(i));
//         }
//     };


//     /**
//      * Makes the level title nodes for the player to select from
//      */
//     static makeLevel(var levelNumber) {
        
//     }


// }