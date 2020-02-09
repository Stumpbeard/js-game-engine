// -----------------
// CORE FUNCTIONS
// -----------------

function initKeys() {
    document.addEventListener('keydown', (event) => {
        const keyPressed = event.key
        __keyStatus[keyPressed] = true
    })

    document.addEventListener('keyup', (event) => {
        const keyPressed = event.key
        __keyUpQueue.push(keyPressed)
    })
}

function initScreen() {
    __mainViewport.height = __gameHeight * __gameScale
    __mainViewport.width = __gameWidth * __gameScale
    __mainViewport.id = "viewport"
    __mainContext.imageSmoothingEnabled = false
    __mainContext.scale(__gameScale, __gameScale)
    __container.append(__mainViewport)
}

function loadAllImages() {
    const numImages = document.images.length
    for (let x = 0; x < numImages; x += 1) {
        const image = document.images[x]

        // Sheet case
        if (image.name.substring(0, 5) === 'sheet') {
            let frames = []
            let dim = image.name.split('-')[1].split('x')
            dim[0] = Number(dim[0])
            dim[1] = Number(dim[1])
            let curX = 0
            let curY = 0
            while (curY < image.height) {
                let frame = document.createElement('canvas')
                frame.width = dim[0]
                frame.height = dim[1]
                frameCtx = frame.getContext('2d')
                frameCtx.drawImage(image, curX, curY, dim[0], dim[1], 0, 0, dim[0], dim[1])
                frames.push(frame)
                curX += dim[0]
                if (curX >= image.width) {
                    curX = 0
                    curY += dim[1]
                }
            }
            const sheetName = image.name.split('-')[2]
            __sheets[sheetName] = { frames: frames, animations: {} }
        } else {
            __images[image.name] = image
        }
    }
}

function loadAllSounds() {
    const sounds = document.querySelectorAll('audio')
    for (let x = 0; x < sounds.length; x++) {
        const sound = sounds[x]
        __sounds[sound.id] = sound
    }
}

function main(timestamp) {
    window.requestAnimationFrame(main)
    let delta = timestamp - __time
    __interval = __interval - delta
    __time = timestamp

    if (__interval < 0) {
        __interval = (1000 / __FPS) - (__interval * -1)
        _update()
        processKeyUps()
        clear()
        _render()
    }
}

function processKeyUps() {
    __keyUpQueue.forEach(key => {
        __keyStatus[key] = false
    });
}

function clear() {
    __mainContext.clearRect(0, 0, __mainViewport.width, __mainViewport.height)
    __mainContext.fillStyle = 'white'
    __mainContext.fillRect(0, 0, __mainViewport.width, __mainViewport.height)
}

// -------------------
// HELPER FUNCTIONS
// -------------------

function _createAnimation(sheet, name, frames) {
    __sheets[sheet]['animations'][name] = frames
}

function _colliding(ent1, ent2) {
    let aX, aW, aY, aH, bX, bW, bY, bH

    if (!ent1.bounds) {
        const image1 = __images[ent1.image] || __sheets[ent1.image]['frames'][ent1.frame]
        aX = ent1.x
        aW = ent1.x + image1.width
        aY = ent1.y
        aH = ent1.y + image1.height
    } else {
        aX = ent1.bounds.x
        aW = aX + ent1.bounds.w
        aY = ent1.bounds.y
        aH = aY + ent1.bounds.h
    }

    if (!ent2.bounds) {
        const image2 = __images[ent2.image] || __sheets[ent2.image]['frames'][ent2.frame]
        bX = ent2.x
        bW = bX + ent2.x + image2.width
        bY = ent2.y
        bH = bY + ent2.y + image2.height
    } else {
        bX = ent2.bounds.x
        bW = bX + ent2.bounds.w
        bY = ent2.bounds.y
        bH = bY + ent2.bounds.h
    }

    if ((aX <= bX && bX < aW) || (aX < bW && bW <= aW) || (aX >= bX && aW <= bW) || (aX <= bX && aW >= bW)) {
        if ((aY <= bY && bY < aH) || (aY < bH && bH <= aH) || (aY >= bY && aH <= bH) || (aY <= bY && aH >= bH)) {
            console.log(aX, aW, aY, aH, bX, bW, bY, bH)
            return true
        }
    }
    return false
}

function _keyPressed(key) {
    if (__keyStatus.hasOwnProperty(key)) {
        return __keyStatus[key]
    } else {
        return false
    }
}

function _draw(entity) {
    let toDraw = undefined
    if (entity.animation) {
        let source = __sheets[entity.image]['frames']
        let animation = __sheets[entity.image]['animations'][entity.animation]
        toDraw = source[animation[entity.frame]]
        entity.rateTimer -= 1
        if (entity.rateTimer <= 0) {
            entity.rateTimer = entity.rate
            entity.frame += 1
            if (entity.frame >= animation.length) entity.frame = 0
        }
    } else {
        toDraw = __images[entity.image]
    }
    __mainContext.drawImage(toDraw, entity.x, entity.y)
}

function _writeText(text, x, y, size = 8, color = 'black') {
    __mainContext.font = `${size}px "Pixel"`
    __mainContext.textBaseline = 'top'
    __mainContext.fillStyle = color
    __mainContext.fillText(text, x, y)
}

function _viewWidth() {
    return __mainViewport.width
}

function _viewHeight() {
    return __mainViewport.height
}

function _playSound(sound) {
    __sounds[sound].play()
}

function _playMusic(music) {
    if (__currentSong) {
        __currentSong.pause()
        __currentSong.currentTime = 0
    }
    __currentSong = __sounds[music]
    __currentSong.play()
}

function goFullScreen() {
    __mainViewport.requestFullscreen()
}