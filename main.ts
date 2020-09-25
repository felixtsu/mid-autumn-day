namespace SpriteKind {
    export const Flag = SpriteKind.create()
    export const Firework = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Flag, function (sprite, otherSprite) {
    otherSprite.setFlag(SpriteFlag.Ghost, true)
    startFireworks()
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    playerSprite.vy = -50
    playerSprite.startEffect(effects.spray)
})
function startFireworks () {
    for (let i = 0; i < 7; i++) {
        let fireworkSprite = sprites.create(img`
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . 2 2 2 . . . . . . .
            . . . . . 2 5 5 5 2 . . . . . .
            . . . . 2 5 5 1 5 5 2 . . . . .
            . . . 2 5 5 1 1 1 5 5 2 . . . .
            . . . 2 5 1 1 1 1 1 5 2 . . . .
            . . . 2 5 5 1 1 1 5 5 2 . . . .
            . . . . 2 5 5 1 5 5 2 . . . . .
            . . . . . 2 5 5 5 2 . . . . . .
            . . . . . . 2 2 2 . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
            . . . . . . . . . . . . . . . .
        `, SpriteKind.Firework)
        tiles.placeOnTile(fireworkSprite, tiles.getTileLocation(5, 13))
        fireworkSprite.vy = randint(-100, -140)
        fireworkSprite.ay = 40
        fireworkSprite.vx += randint(-30, 30)
        if (i == 3) {
            scene.cameraFollowSprite(fireworkSprite)
        }
        fireworkSprite.startEffect(effects.spray)
        fireworkSprite.lifespan = 2300
        pause(randint(100, 200))
    }
}

function explode(sprite:Sprite, speed: number, angle: number) {
    let vx = speed * Math.cos(angle)
    let vy = speed * Math.sin(angle)
    let spriteImage:Image = image.create(1, 1)
    spriteImage.setPixel(0, 0, randint(2, 14))
    let ashSprite = sprites.createProjectileFromSprite(spriteImage, sprite, vx, vy)
    ashSprite.ay = 100
    ashSprite.lifespan = 2000
    scene.centerCameraAt(80, 60)
}
sprites.onDestroyed(SpriteKind.Firework, function(sprite: Sprite) {
    for (let i = 0; i < 360; i+=15) {
        explode(sprite, 50, i / Math.PI)
    }
})
let playerSprite: Sprite = null
let flagSprite: Sprite = null
tiles.setTilemap(tiles.createTilemap(hex`0a00100005050505050505050505050505050505050505050505050505050505050505050505050505050505050505050505050505050505050505050505050505050505050505050505040404040404040404040404040404040404040403030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030101010101010101010102020202020202020202`, img`
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
    . . . . . . . . . .
`, [myTiles.transparency16,sprites.builtin.forestTiles6,sprites.builtin.forestTiles10,myTiles.tile1,myTiles.tile2,myTiles.tile3], TileScale.Sixteen))
playerSprite = sprites.create(img`
    . . . . . . f f f f . . . . . . 
    . . . . f f f 2 2 f f f . . . . 
    . . . f f f 2 2 2 2 f f f . . . 
    . . f f f e e e e e e f f f . . 
    . . f f e 2 2 2 2 2 2 e e f . . 
    . . f e 2 f f f f f f 2 e f . . 
    . . f f f f e e e e f f f f . . 
    . f f e f b f 4 4 f b f e f f . 
    . f e e 4 1 f d d f 1 4 e e f . 
    . . f e e d d d d d d e e f . . 
    . . . f e e 4 4 4 4 e e f . . . 
    . . e 4 f 2 2 2 2 2 2 f 4 e . . 
    . . 4 d f 2 2 2 2 2 2 f d 4 . . 
    . . 4 4 f 4 4 5 5 4 4 f 4 4 . . 
    . . . . . f f f f f f . . . . . 
    . . . . . f f . . f f . . . . . 
    `, SpriteKind.Player)
controller.moveSprite(playerSprite)
tiles.placeOnTile(playerSprite, tiles.getTileLocation(1, 13))
flagSprite = sprites.create(img`
    . . . . . . . . . . . . . . . .
    . . . . . . . . . . . . . . . .
    . . . f 2 2 2 2 2 . . . . 2 2 2
    . . . f 5 5 2 2 5 2 2 2 2 2 2 2
    . . . f 5 5 2 5 2 2 2 2 2 2 2 2
    . . . f 2 2 5 2 2 2 2 2 2 2 2 2
    . . . f 5 2 2 2 2 2 2 2 2 2 2 2
    . . . f 2 2 2 2 2 2 2 2 2 2 2 2
    . . . f 2 2 2 2 2 2 2 2 2 2 2 2
    . . . f 2 2 2 2 2 2 2 2 2 2 2 2
    . . . f . . 2 2 2 2 2 2 2 2 2 2
    . . . f . . . . . . 2 2 . . . .
    . . . f . . . . . . . . . . . .
    . . . f . . . . . . . . . . . .
    . . . f . . . . . . . . . . . .
    . . . f . . . . . . . . . . . .
`, SpriteKind.Flag)
tiles.placeOnTile(flagSprite, tiles.getTileLocation(7, 13))
let moonSprite = sprites.create(img`
    ................................
    ................................
    ................................
    ................................
    ...........11111111111..........
    ..........1111111111111.........
    ........11111111111111111.......
    .......1111111111111111111......
    ......111111111111111111111.....
    ......1111ddd111111dddddd11.....
    .....1111dcbbd1111dddccddd11....
    ....11111dbb1db11dddcccbddb11...
    ....11111db11db11ddcccbb1db11...
    ....111111dddb111dcccbb11db11...
    ....1111111bb1111dccbb111db11...
    ....1111111111111ddbb1111db11...
    ....11111ddddd111ddd11111bb11...
    ....1111ddccbdd111ddddddbb111...
    ....1111dccbb1db1111bbbbb1111...
    ....1111dcbb11db1111111111111...
    ....1111dbb111db1111111111111...
    ....1111dd1111db1111111111111...
    .....1111dddddb1111111111111....
    ......1111bbbb1111111111111.....
    ......111111111111111111111.....
    .......1111111111111111111......
    ........11111111111111111.......
    ..........1111111111111.........
    ...........11111111111..........
    ................................
    ................................
    ................................
    `, SpriteKind.Player)
tiles.placeOnTile(moonSprite, tiles.getTileLocation(3, 2))
scene.cameraFollowSprite(playerSprite)
