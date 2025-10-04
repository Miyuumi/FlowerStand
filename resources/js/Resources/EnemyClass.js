export class Enemy {
  constructor({ name, x, y, health = 10, damage = 1, wave = 1, level = 1, speed = 1, size = 30, image = null }) {
    this.name = name;
    this.health = health;
    this.maxhealth = health;
    this.damage = 1;
    this.wave = 1;
    this.level = 1;
    this.value = 1;
    this.experience = 1;
    this.coins = 1;
    this.size = size;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.image = image;
    this.sprite = null;
  }

  onTakeDamage(damage, projectile, resources, plants, enemies, source, projectiles, x, y) {
    this.health -= damage;
    source.damageDealt += damage;
    source.onDamage(source, resources, plants, enemies, projectiles, x, y);
    if (this.health <= 0) {
      this.onDeath(source, damage, resources, enemies, plants, projectiles, x, y);
    }
  }

  onTurn(enemies, plants, projectiles) {
    // custom AI per tick
  }

  onDeath(source, damage, resources, enemies, plants, projectiles, x, y) {
    source.kills += 1;
    source.experience += this.experience;
    resources.value.Coins += this.coins;

    if(source.experience >= source.nextLevelExp){
      source.onLevel(source, resources, plants, enemies, projectiles, x, y);
    }
    
    source.onDeath(source, resources, plants, enemies, projectiles, x, y)
    enemies.value = enemies.value.filter(e => e !== this);
  }
}