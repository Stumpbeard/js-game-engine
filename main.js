function _update() {
    // __activeScene.update()
    if (moving) {
        man1.moveX(1)
        man2.moveX(-1)
    }
    if (_colliding(man1, man2)) {
        moving = false
        man1.moveX(-1)
        man2.moveX(1)
        box = 'red'
    }
}

let moving = true
let box = 'green'

function _render() {
    // __activeScene.draw()
    man1.draw()
    man2.draw()
    __mainContext.strokeStyle = box
    __mainContext.lineWidth = 1
    __mainContext.strokeRect(man1.bounds.x, man1.bounds.y, man1.bounds.w, man1.bounds.h)
    __mainContext.strokeRect(man2.bounds.x, man2.bounds.y, man2.bounds.w, man2.bounds.h)
}


initKeys()
initScreen()
loadAllImages()
loadAllSounds()

// __scenes['intro'] = introScene()
// __activeScene = __scenes['intro']
_createAnimation('fatman', 'right', [9, 8])
_createAnimation('fatman', 'left', [7, 6])
let man1Bound = { x: 0, w: 16, y: _viewHeight() / 2 + 8, h: 8 }
let man1 = new Entity(0, _viewHeight() / 2, 0, undefined, man1Bound)
man1.setImage('fatman')
man1.setAnimation('right', 15)
let man2Bound = { x: _viewWidth() - 16, w: 16, y: _viewHeight() / 2 + 16, h: 8 }
let man2 = new Entity(_viewWidth() - 16, _viewHeight() / 2 + 8, 0, undefined, man2Bound)
man2.setImage('fatman')
man2.setAnimation('left', 15)

main(0)