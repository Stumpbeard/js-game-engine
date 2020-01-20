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

class MapScene extends Scene {
    constructor() {
        super(
            [
                [GameMap, [16, 16]]
            ]
        )
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
    constructor(x, y, z, height, scene) {
        super(x, y, z, scene)
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
            // Should also set bounding box here
        this.bounds = {
            x: this.x,
            y: this.y - this.height * 16,
            w: 64,
            height: 32
        }
    }

    draw() {
        this.y -= this.height * 16
        _draw(this)
        this.y += this.height * 16
    }
}

class GameMap extends Entity {
    constructor(cols, rows, scene) {
        super(__gameWidth / 2 - 32, __gameHeight / 2 - 16 * rows, 0, scene);
        this.tileMap = []
        this.rows = rows
        this.cols = cols
        let xMod = 0
        let yMod = 0
        let zMod = 0
        for (let y = 0; y < rows; y++) {
            let row = []
            for (let x = 0; x < cols; x++) {
                let t = new Tile(this.x + x * 32 + xMod, this.y + x * 16 + yMod, x + zMod, Math.ceil(Math.random() * 5), scene)
                row.push(t)
                this.scene.entities.push(t)
            }
            zMod++
            xMod -= 32
            yMod += 16
            this.tileMap.push(row)
        }

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let height = [
                    this.tileMap[y][x].height,
                    (this.tileMap[y][x + 1] || this.tileMap[y][0]).height,
                    (this.tileMap[y][x - 1] || this.tileMap[y][this.tileMap[y].length - 1]).height,
                    (this.tileMap[y + 1] || this.tileMap[0])[x].height,
                    (this.tileMap[y - 1] || this.tileMap[this.tileMap.length - 1])[x].height,
                ].reduce((prev, a) => prev + a, 0) / 5
                this.tileMap[y][x].height = Math.floor(height)
                this.tileMap[y][x].generateSprite()
            }
        }
    }

    draw() {
        return
    }
}