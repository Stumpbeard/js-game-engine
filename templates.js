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
    constructor(x, y, z, scene, bounds = undefined) {
        this.scene = scene
        this.bounds = bounds
        this.x = x
        this.y = y
        this.zIndex = z
        this.id = Math.floor(Math.random() * 100000)
        this.active = true
        this.onCreate()
    }

    setImage(image) {
        this.image = image
    }

    setAnimation(animation, rate) {
        this.animation = animation
        this.frame = 0
        this.rate = rate
        this.rateTimer = rate
    }

    moveX(d) {
        this.x += d
        if (this.bounds) this.bounds.x += d
    }

    moveY(d) {
        this.y += d
        if (this.bounds) this.bounds.y += d
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