Open up index.html and run the game. Grab the coin and watch the tween action.

Tweens:
    - Mario fades in at the beginning
    - Coin grows and moves to center on pickup
    - Coin fades out after done growing/moving

Non-linear Tweens:
    - Note: not located in TweenTransition.js, they subclass it and are in TweenTransitions.js
    - EaseInOut: ease in, max speed in middle, ease out. Note: hard to see that it's non-linear
    - ShockAbsorber: overshoots its target value and slings back, using a sine function. Coin uses this on
        its position.x after pickup, but not position.y, so it curves nicely


Best,
Brendan