export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        // создаю спрайт в виде игрока, который буду передвигать
        this.sprite = scene.physics.add
            .sprite(x, y, "player", 0)
            .setDrag(500, 500)

        // работа с клавишами WASD и соответствующие им клавиши вверх, влево, вниз, вправо
        const { LEFT, RIGHT, UP, DOWN, W, A, S, D, SPACE } = Phaser.Input.Keyboard.KeyCodes;
        this.keys = scene.input.keyboard.addKeys({
            left: LEFT,
            right: RIGHT,
            up: UP,
            down: DOWN,
            w: W,
            a: A,
            s: S,
            d: D,
            space: SPACE
        });
    }

    update(walls, enemies) {
        const sprite = this.sprite;
        const keys = this.keys;

        // уничтожаем врага, если он на соседней клетке и мы нажали пробел
        if (isDown(keys.space)) {
            enemies.forEach(enemy => {
                if ((sprite.y === enemy.sprite.y) && (Math.abs(sprite.x-enemy.sprite.x) <= 25) 
                || (sprite.x === enemy.sprite.x) && (Math.abs(sprite.y -enemy.sprite.y)<= 25)) {
                    enemy.sprite.destroy(true)
                    enemy = null
                }
            })
        }

        // фуекция для проверки, что стена рядом
        function checkWall(direction, sprite, layer) {

            let x = (sprite.x - 12.5) / 25;
            let y = (sprite.y - 12.5) / 25;


            switch (direction) {
                case 'left':
                    return layer.getTileAt(x - 1, y) === null
                case 'right':
                    return layer.getTileAt(x + 1, y) === null
                case 'up':
                    return layer.getTileAt(x, y - 1) === null
                case 'down':
                    return layer.getTileAt(x, y + 1) === null

            }

        }

            // фуекция для проверки, нажата ли клавиша
        function isDown(key) {
            return Phaser.Input.Keyboard.JustDown(key)
        }

        // передвижение игрока в том направлении, в каком работает нажатая клавиша
        if (isDown(keys.left) || isDown(keys.a)) {
            if (checkWall('left', sprite, walls) === true) {
                sprite.x -= 25;
                sprite.setFlipX(true);
            }
        }
        else if (isDown(keys.right) || isDown(keys.d)) {
            if (checkWall('right', sprite, walls) === true) {
                sprite.x += 25;
                sprite.setFlipX(false);
            }
        } else if (isDown(keys.up) || isDown(keys.w)) {
            if (checkWall('up', sprite, walls) === true) {
                sprite.y -= 25;
            }
        }
        else if (isDown(keys.down) || isDown(keys.s)) {
            if (checkWall('down', sprite, walls) === true) {
                sprite.y += 25;
            }
        }
    }
}
