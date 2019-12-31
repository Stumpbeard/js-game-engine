function _update() {
    // __activeScene.update()
}

function _render() {
    // __activeScene.draw()
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
            _draw(entity)
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
    constructor(image, x, y, z, scene) {
        this.picture = image
        this.scene = scene
        this.x = x
        this.y = y
        this.zIndex = z
        this.id = Math.floor(Math.random() * 100000)
        this.active = true
        this.onCreate()
    }

    image() {
        return this.picture
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

main(0)