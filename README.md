# js-game-engine
Base engine code for making a JS canvas game with scenes and entities

## Basics

The engine starts by loading all images and sounds. The basic game loop is
updating state based on game logic, clearing the screen, and rendering the new
information.

Most of this defined in `engine.js` which you shouldn't need to touch. Game code
lives in `main.js`. You can split out code wherever else you want, but `main.js`
should be the only place code runs and should stay at the bottom of the import
order.

## Content creation

**Entities** are the objects of your game and should be defined as `extends` of
the `Entity` class. Most of the game logic is intended to live in the `update`
functions of these children (or in top level system functions). Entities should
all be removed from play with the `destroy()` function so that they are handled
gracefully by the scene's update loop.

**Scenes** are collections of entities (think like a battle screen, the pause
screen, or the start screen) with usually a bit of their own logic on how to
create, destroy, and transition to other Scenes. These should likewise extend
the base `Scene` class. When the game updates and renders it runs through the
update and draw functions of every entity in the scene. Entities have circular
access to the scene they are a part of.

Instances of scenes should be stored in the `__scenes` object, and there should 
always be an **Active Scene** that is represented by `__activeScene`. This is
the scene that will have logic actively running on it.

The `_update()` and `_render()` functions at the top of `main.js` should work
fine out of the box, but you can add custom behavior if you'd like.

And so the basic creation of a game is creating scenes out of the objects that
should interact in those scenes, and managing the transition of scenes between
each other.