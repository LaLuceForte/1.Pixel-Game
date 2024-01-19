// иморт класса для игрока
import Player from "./dude.js"

// импорт класса для врагов
import Enemy from "./enemy.js";

// конфигурация для Phaser
const config = {
  // контекст рендеринга
  type: Phaser.AUTO,
  // размер холста
  width: 1500,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  parent: "field",
  pixelArt: true,
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

// создаем новую игру на базе библиотеки Phaser
const game = new Phaser.Game(config);

// загружаем набор тайлов
function preload() {
  this.load.image("tiles", "../assets/tiles.png");
  this.load.spritesheet("player", 'assets/player.png', { frameWidth: 25, frameHeight: 25 });
  this.load.spritesheet("cure", 'assets/cure.png', { frameWidth: 25, frameHeight: 25 });
  this.load.spritesheet("sword", 'assets/sword.png', { frameWidth: 25, frameHeight: 25 });
  this.load.spritesheet("enemy", 'assets/enemy.png', { frameWidth: 25, frameHeight: 25 });
  this.load.tilemapTiledJSON("map", "../assets/tileset.json");
}

// набор зельев здоровья и мечей
const healthAndStrength = {
  cures: 2,
  swords: 5
}

// создаем карту игры
function create() {
  const map = this.make.tilemap({ key: "map" });

  // добавляю изображение тайлесета и даю ему имя
  const tileset = map.addTilesetImage("tileset", "tiles");

  // слои
  map.createLayer("below", tileset, 0, 0);
  this.walls = map.createLayer("walls", tileset, 0, 0);

  // воин - игрок
  const spawnPoint = map.findObject("Objects", (obj) => obj.name === "player");
  this.player = new Player(this, spawnPoint.x, spawnPoint.y);

  // столкновение игрока и стен -> игрок не млжет проходить сквозь стены
  const walls = this.walls.setCollisionByProperty({ collides: true })
  this.physics.world.addCollider(this.player.sprite, this.walls)

  // группа объектов зелья для прибавки к здоровью при столкновении с ними
  const cures = this.physics.add.group({
    key: 'cure',
    repeat: 9,
    setXY: { x: 87.5, y: 87.5, stepX: 75 }
  });

  // настройка против столкновения зелей и стен
  this.physics.world.addCollider(cures, walls);
  this.physics.add.overlap(this.player.sprite, cures, updateCure, null, this);

    // создаем врагов из класса Enemy
    this.enemies = [
      new Enemy(this, 162.5,112.5),
       new Enemy(this, 212.5,87.5),
       new Enemy(this, 212.5,262.5),
       new Enemy(this, 212.5,337.5),
       new Enemy(this, 387.5,337.5),
       new Enemy(this, 387.5,287.5),
       new Enemy(this, 562.5,437.5),
       new Enemy(this, 562.5,112.5),
       new Enemy(this, 562.5,262.5),
       new Enemy(this, 762.5,262.5)
    ]

    this.enemies.forEach(enemy=>{
      this.physics.world.addCollider(enemy.sprite, this.walls)
    })

  // группа объектов для мечей -> прибавка к силе
  const swords = this.physics.add.group({
    key: 'sword',
    repeat: 1,
    setXY: { x: 700, y: 80, stepX: 200 }
  });

  // настройка против столкновения мечей и стен
  this.physics.world.addCollider(swords, walls);
  this.physics.add.overlap(this.player.sprite, swords, updateSwords, null, this);

  // добавляю текст справа для отображения доступного здоровья, силы и подсказки об использовании клавиш
  this.add
    .text(1050, 16, "Arrow keys or WASD to move, space - kill", {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 5, y: 10 },
      backgroundColor: "#ffffff"
    })


  this.add
    .text(1050, 100, "Здоровье", {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 180, y: 40 },
      backgroundColor: "#ffffff"
    })

    this.add
    .text(1050, 300, "Сила", {
      font: "18px monospace",
      fill: "#000000",
      padding: { x: 180, y: 40 },
      backgroundColor: "#ffffff"
    })    
}

// функция для отображения релевантного количества здоровья
function updateCure(player, cure) {
  cure.disableBody(true, true)
  healthAndStrength.cures++
}

// функция для отображения релевантного количества силы
function updateSwords(player, sword) {
  sword.disableBody(true, true)
  healthAndStrength.swords++
}

function update() {

  // обновление игрока из класса Player
  this.player.update(this.walls,this.enemies);
  this.enemies.forEach(enemy=>{
    enemy.update(this.player, this.scene)
  })
  
 // обновляем количество здоровья
  for (let i = 1; i <= healthAndStrength.cures; i++) {
    this.add.sprite(1050 + i * 30, 180, 'cure')
  }

  // обновляем количество мечей
  for (let i = 1; i <= healthAndStrength.swords; i++) {
    this.add.image(1050 + i * 30, 380, 'sword')
  }
}
