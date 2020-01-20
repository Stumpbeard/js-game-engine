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

class Tile extends Entity {
    constructor(x, y, height) {
        super(x, y, 0, undefined)
        this.height = height
    }

    generateSprite() {
        let spriteCanvas = document.createElement('canvas')
        spriteCanvas.width = 64
        spriteCanvas.height = 32 + 16 * this.height
        let ctx = spriteCanvas.getContext('2d')
        const dirt = __images['dirt']
        const grass = __images['grass']
        let x = 0
        let y = spriteCanvas.height - 32
        for (let l = 0; l < this.height * 16; l++) {
            ctx.drawImage(dirt, x, y)
            y -= 1
        }
        ctx.drawImage(grass, x, y++)
        __images[this.id] = spriteCanvas
        this.setImage(this.id)
    }

    draw() {
        this.y -= this.height * 16
        _draw(this)
        this.y += this.height * 16
    }
}

class GameMap extends Entity {
    constructor(dims, scene) {
        super(__gameWidth / 2 - 32, __gameHeight / 2 - 16 * dims, 0, scene);
        this.tiles = []
        this.rows = dims
        this.cols = dims

        let counter = 0
        let curRow = 0
        let curCol = 0
        let yMod = 0
        let xMod = 0
        while (counter < dims * dims) {
            let newTile = new Tile(this.x + xMod, this.y + yMod, Math.ceil(Math.random() * 5))
            this.tiles.push(newTile)
            counter++
            curRow--
            curCol++
            xMod += 64
            if (curCol === this.cols) {
                yMod += 16
                xMod = (-32 * (this.rows - 1)) + (32 * (curRow + 2))
                curCol = curRow + 2
                curRow = this.rows - 1
            } else if (curRow < 0) {
                curRow = curCol
                curCol = 0
                yMod += 16
                xMod = (-32 * curRow)
            }
        }
        let iter = 0
        this.tiles.forEach(tile => {
            let height = [
                tile.height,
                (this.tiles[iter + 1] || { height: 1 }).height,
                (this.tiles[iter - 1] || { height: 1 }).height,
                (this.tiles[iter + dims] || { height: 1 }).height,
                (this.tiles[iter - dims] || { height: 1 }).height,
            ].reduce((prev, a) => prev + a, 0) / 5
            tile.height = Math.floor(height) // If the floor isn't here, weird shit happens
            iter++
            tile.generateSprite()
        });
    }

    draw() {
        this.tiles.forEach(tile => {
            tile.draw()
        });
    }
}