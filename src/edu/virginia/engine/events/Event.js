"use strict";

/**
 * Basic Event implementation for the game engine.
 * 
 */
class Event {
    
    /**
     * eventType: string
     * source: the EventDispatcher that created this event
     * note: EventDispatcher creating this event can just use their 'this' identifier
     */
    constructor(eventType, source) {
        this.eventType = eventType; // the event type
        this.source = source; // the EventDispatcher that created this event
    }

    // Getters and Setters
    // ...
    
}

