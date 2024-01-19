export default class Enemy {
    constructor(scene, x, y) {
        this.scene = scene;

        // создаю спрайт в виде игрока, который буду передвигать
        this.sprite = scene.physics.add
            .sprite(x, y, "enemy", 0)
    }

    update(player, scene) {
        const sprite = this.sprite;

        if ((sprite.y === player.sprite.y) && (Math.abs(sprite.x - player.sprite.x) <= 25)
            || (sprite.x === player.sprite.x) && (Math.abs(sprite.y - player.sprite.y) <= 25)) {

                // если игрок не успеет нажать пробел за 0.3 секунды, враг его разрушит
            setTimeout(() => {
                if (sprite.active) {
                    player.sprite.destroy(true)
                    scene.restart()
                }
            }, 300)

        }

        // включаем передвижение врагов по полю
        if (sprite.active) {
            this.scene.physics.moveTo(sprite, player.sprite.x, player.sprite.y, 30)
        }
    }

}
