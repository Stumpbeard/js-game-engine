function _update() {
    // __activeScene.update()
}

function _render() {
    // __activeScene.draw()
    man.draw()
}

class Scene {
    constructor(entities) {
        this.entities = []
        this.entitiesToPop = []
        entities.forEach(entity => {
            const entityName = entity[0]
            const entityArgs = entity[1]
            this.entities.push(new entityName(...entityArgs, this))
        });
        this.groomEntities()
    }

    draw() {
        this.entities.forEach(entity => {
            if (!entity.isActive()) {
                return
            }
            entity.draw()
        });
        this.groomEntities()
    }

    update() {
        this.entities.forEach(entity => {
            if (!entity.isActive()) {
                return
            }
            entity.update()
        });
    }

    groomEntities() {
        this.entities.sort((a, b) => a.zIndex > b.zIndex)
    }
}

class Entity {
    constructor(x, y, z, scene) {
        this.scene = scene
        this.x = x
        this.y = y
        this.zIndex = z
        this.id = Math.floor(Math.random() * 100000)
        this.active = true
        this.onCreate()
    }

    setImage(image) {
        this._image = image
    }

    image() {
        return this._image
    }

    frame() {
        return this._frame
    }

    draw() {
        _draw(this)
    }

    isActive() {
        return this.active
    }

    destroy() {
        this.active = false
        this.scene.entitiesToPop.push(this)
        this.onDestroy()
    }

    onCreate() {}
    update() {}
    onDestroy() {}
}

initKeys()
initScreen()
loadAllImages()
loadAllSounds()

// __scenes['intro'] = introScene()
// __activeScene = __scenes['intro']

let man = new Entity(150, 150, 0, undefined)

main(0)