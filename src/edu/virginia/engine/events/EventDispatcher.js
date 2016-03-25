"use strict";

/**
 * Basic Event Dispatcher implementation for the game engine.
 * 
 */
class EventDispatcher {
    
    constructor() {

        // event listener tuples as such: {"eventListener":eventListener, "eventType": eventType}
        // a dispatcher will call .notify() on its listeners if that eventType is dispatched
        // note: eventListener is a class in this directory, eventType is a string
        this.eventListeners = [];

    }


    /**
     * Pushes an eventListener, eventType tuple (obj) onto this.eventListeners
     * eventListener is an object with a .notify() method
     * eventType is a string
     * returns the length of the updated list (same return value as array.push())
     */
    addEventListener(eventListener, eventType) {
        var pair = {"eventListener": eventListener, "eventType": eventType};
        if (this.indexOfEventListenerPair(pair) != -1) return false;
        return this.eventListeners.push(pair);
    }

    /**
     * Removes an eventLister, eventType pair from this.eventListeners 
     * If the pair isn't there, returns false
     * else, returns true
     */
    removeEventListener(eventListener, eventType) {
        var index = 0;
        var pair = {"eventListener": eventListener, "eventType": eventType};
        var wasRemoved = false;
        // while the pair is in the list, remove it over and check again
        while ((index = this.indexOfEventListenerPair(pair)) != -1) {
            // use splice to remove it
            this.eventListener.splice(index, 1);
            wasRemoved = true;
        }
        return wasRemoved;
    }

    /**
     * Calls .notify on eventListener-Type pairs with the event's type
     * Note: event must have string property called "eventType", 
     * because event.eventType will be checked
     */
    dispatchEvent(event) {
        // for each loop
        this.eventListeners.forEach(function(pair) {
            // call .notify(event) on each pair where the eventType matches up
            if (pair.eventType === event.eventType) {
                pair.eventListener.notify(event);
            }
        });
    }

    /**
     * Returns index of the first instance of the eventListener, eventType pair
     * Returns -1 if it isn't found
     * pair should be: {"eventListener": eventListener, "eventType": eventType}
     */
    indexOfEventListenerPair(pair) {
        for (var i = 0; i < this.eventListeners.length; i++) {
            if (this.eventListeners[i].eventListener === pair.eventListener
                && this.eventListener[i].eventType === pair.eventType) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Returns true if the eventListener-Type pair is in this.eventListener list,
     * returns false if not
     */
    hasEventListener(eventListener, eventType) {
        var pair = {"eventListener": eventListener, "eventType": eventType};
        return this.indexOfEventListenerPair(pair) != -1;
    }

}

