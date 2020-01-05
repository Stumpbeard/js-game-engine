function _update() {
    // __activeScene.update()
    if (_keyPressed('ArrowUp') && man.animation !== 'walkUp') {
        man.setAnimation('walkUp', 15)
    } else if (_keyPressed('ArrowDown') && man.animation !== 'walkDown') {
        man.setAnimation('walkDown', 15)
    } else if (_keyPressed('ArrowLeft') && man.animation !== 'walkLeft') {
        man.setAnimation('walkLeft', 15)
    } else if (_keyPressed('ArrowRight') && man.animation !== 'walkRight') {
        man.setAnimation('walkRight', 15)
    }
}

function _render() {
    // __activeScene.draw()
    man.draw()
}


initKeys()
initScreen()
loadAllImages()
loadAllSounds()

// __scenes['intro'] = introScene()
// __activeScene = __scenes['intro']

let man = new Entity(150, 150, 0, undefined)
_createAnimation('fatman', 'walkDown', [1, 0, 2, 0])
_createAnimation('fatman', 'walkUp', [4, 3, 5, 3])
_createAnimation('fatman', 'walkLeft', [7, 6])
_createAnimation('fatman', 'walkRight', [9, 8])
man.setImage('fatman')
man.setAnimation('walkDown', 15)

main(0)