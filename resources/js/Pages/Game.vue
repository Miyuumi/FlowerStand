<script setup>

import { getEnemies } from '@/Resources/Enemies';
import { Enemy } from '@/Resources/EnemyClass';
import { getFlowers } from '@/Resources/Flowers';
import { Rarity } from '@/Resources/Rarity';
import { nextTick, onMounted, ref, watch } from 'vue';
const dialog = defineModel("show");
const inventory = defineModel("inventory");
const resources = defineModel("resources");
const fields = defineModel("fields");
const stage = defineModel("stage");
const enemies = ref([]);
const Enemies = ref([]);
const enemyValue = ref(0);
const projectiles = ref([]);
const gameUpdate = ref(()=>{});

const canvasRef = ref(null);
let ctx = null;
let animationId = null;

// Square properties
const battleField = ref({
  width: 1200,
  height: 400,
});

let square = {
  x: 1200,
  y: 100,
  size: 30,
  speed: 1,
  image: "/Characters/Fairy_1.png",
  sprite: null,
};

const update = ()=>{
  console.log("Turn");
  fields.value.forEach((row, rowIndex) => {
    row.forEach((plant, colIndex) => {
      if (plant && typeof plant.onTurn === "function") {
        plant.onTurn(plant, resources, fields, enemies, projectiles, rowIndex, colIndex);
        
      }
    });
  });

  if(enemies.value.length === 0){
    dialog.value = false;
    clearInterval(gameUpdate.value);
    gameUpdate.value = null;

  }
}

function draw() {
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  enemies.value.forEach((enemy) => {
    // Move enemy left
    enemy.x -= enemy.speed;

    // Draw enemy sprite
    if (enemy.sprite && enemy.sprite.complete) {
      ctx.drawImage(enemy.sprite, enemy.x, enemy.y, enemy.size, enemy.size);
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
    }

    // === Draw health bar ===
    const barWidth = enemy.size;
    const barHeight = 5;
    const healthPercent = Math.max(enemy.health, 0) / enemy.maxhealth; // assuming max health = 10
    const barX = enemy.x;
    const barY = enemy.y - 10; // above the enemy

    // background (gray)
    ctx.fillStyle = "gray";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // health (green to red)
    ctx.fillStyle = healthPercent > 0.5 ? "green" : "red";
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

    // === Respawn or remove ===
    if (enemy.x < -enemy.size) {
      enemy.x = canvasRef.value.width; // respawn
      resources.value.Life -= enemy.damage;
      // or: remove if you want it gone
      // enemies.value.splice(index, 1);
    }
  });

  // Draw plants
  fields.value.forEach((row, rowIndex) => {
    row.forEach((plant, colIndex) => {
      if (plant && plant.sprite) {
        const x = colIndex * 30;
        const y = rowIndex * 30;
        ctx.drawImage(plant.sprite, x, y, 30, 30);
      }
    });
  });

  projectiles.value.forEach((proj, index) => {
    if (!proj.target || proj.target.health <= 0) {
      projectiles.value.splice(index, 1);
      return;
    }

    // Vector toward target
    const dx = (proj.target.x + proj.target.size/2) - proj.x;
    const dy = (proj.target.y + proj.target.size/2) - proj.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist < proj.speed) {
      // Hit!
      let source = fields.value[proj.location.x][proj.location.y]
      // console.log(proj);
      
      proj.target.onTakeDamage(proj.damage, proj, resources, fields, enemies, source, projectiles, proj.location.x, proj.location.y);

      projectiles.value.splice(index, 1);
    } else {
      proj.x += (dx / dist) * proj.speed;
      proj.y += (dy / dist) * proj.speed;
    }

    // Draw projectile
    ctx.fillStyle = proj.color || "yellow";
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);
    ctx.fill();
  });

  animationId = requestAnimationFrame(draw);
}


function preloadEnemyImages() {
  enemies.value.forEach((enemy) => {
    if (!enemy.sprite) {
      const img = new Image();
      img.src = enemy.image;
      img.onload = () => {
        enemy.sprite = img;
      };
    }
  });
}

function preloadPlantImages() {
  fields.value.forEach((row) => {
    row.forEach((plant) => {
      if (plant && !plant.sprite) {
        const img = new Image();
        img.src = `/Images/${plant.name}.png`;
        img.onload = () => {
          plant.sprite = img; // store it directly on plant
        };
      }
    });
  });
}

async function initCanvas() {
  await nextTick();
  const canvas = canvasRef.value;
  if (!canvas) return;

  canvas.width = battleField.value.width;
  canvas.height = battleField.value.height;
  ctx = canvas.getContext("2d");

  preloadEnemyImages();
  preloadPlantImages(); // from before

  gameUpdate.value = setInterval(()=>{
    update();
  }, 100);
  cancelAnimationFrame(animationId);
  draw();
}

watch(dialog, (val) => {
  
  enemyValue.value = 0;
  Enemies.value = getEnemies(stage.value);
  enemies.value = [];
  while(enemyValue.value < stage.value * 10){
    let template = Enemies.value[Math.floor(Math.random() * Enemies.value.length)];
    let enemy = Object.assign(
      Object.create(Object.getPrototypeOf(template)), 
      template
    );
    
    enemy.x = 1200 + (Math.random() * 600);
    enemy.y = 100 + (Math.random() * ((battleField.value.height - 100) - enemy.size));
    enemies.value.push(enemy);
    enemyValue.value += enemy.value;
  }

  if (val) {
    initCanvas();
  } else {
    cancelAnimationFrame(animationId);
  }
});
</script>

<template>
  <v-dialog v-model="dialog" fullscreen>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Stage {{ stage }}</v-toolbar-title>
        <v-toolbar-items>
          <div class="flex flex-row-reverse w-full h-full items-center gap-5">
            <div class="flex items-center mx-4 gap-1" v-for="res in Object.entries(resources)">
                <div v-if="res[0] !== 'currentSeason'" class="flex items-center gap-1">
                    <img class="w-[30px]" :src="'/icons/'+res[0]+'.png'"></img>
                    <span>{{ res[1].toFixed(0) }}</span>
                </div>
                <div v-else>

                </div>
            </div>
        </div>
        </v-toolbar-items>
      </v-toolbar>
      <canvas ref="canvasRef"></canvas>
    </v-card>
  </v-dialog>
</template>