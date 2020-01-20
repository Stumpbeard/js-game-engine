function _update() {
    __activeScene.update()
}

function _render() {
    __activeScene.draw()
}

initKeys()
initScreen()
loadAllImages()
loadAllSounds()

__scenes['map'] = new MapScene()
__activeScene = __scenes['map']

main(0)