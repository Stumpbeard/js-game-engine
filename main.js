function _update() {
    // __activeScene.update()
}

function _render() {
    // __activeScene.draw()
    map.draw()
}

initKeys()
initScreen()
loadAllImages()
loadAllSounds()

// __scenes['intro'] = introScene()
// __activeScene = __scenes['intro']

let map = new GameMap(32, undefined)

main(0)