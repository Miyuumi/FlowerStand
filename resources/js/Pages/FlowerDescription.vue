<script setup>

import { getFlowers } from '@/Resources/Flowers';
import { Rarity } from '@/Resources/Rarity';
import { onMounted, ref } from 'vue';
const dialog = defineModel("show");
const flower = defineModel("flower");
const location = defineModel("location");
const tab = ref("one");
const emits = defineEmits(['dig']);

const dig = ()=>{
  emits('dig');
}
onMounted(()=>{
  
})
</script>
<template>
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      fullscreen
    >

      <v-card>
        <v-toolbar>
          <v-btn
            icon="mdi-close"
            @click="dialog = false"
          ></v-btn>

          <v-toolbar-title>
            <div class="flex justify-between">
              <div>{{ flower.name }}</div>
              <div><v-btn prepend-icon="mdi-shovel" variant="outlined" @click="dig">Dig Up</v-btn></div>
            </div>
          </v-toolbar-title>
        </v-toolbar>

        <v-card class="w-full h-full m-5 p-5">
          <div class="flex">
            <div class="w-[50%] flex justify-center">
              <img :src="'/images/'+flower.name+'.png'" style="object-fit: contain; height: 100%"></img> 
            </div>
            <div class="w-full p-5 overflow-y-auto">
              <v-tabs
                v-model="tab"
                bg-color="primary"
              >
                <v-tab value="one">Plant</v-tab>
                <v-tab value="two">Battle</v-tab>
                <v-tab value="three">Stats</v-tab>
              </v-tabs>

              <v-card-text>
                <v-tabs-window v-model="tab">
                  <v-tabs-window-item value="one">
                    <table class="w-full border-collapse h-[635px]" style="font-size: 18px">
                      <tbody>
                        <tr>
                          <td class="font-bold w-[200px] border-b p-2" style="font-size: 21px">Name</td>
                          <td class="border-b p-2">{{ flower.name }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Description</td>
                          <td class="border-b p-2">{{ flower.description }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px"></td>
                          <td class="border-b p-2"></td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Water</td>
                          <td class="border-b p-2">{{ (flower.water * 100).toFixed(2) }}%</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Resource</td>
                          <td class="border-b p-2">{{ flower.resource }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Rarity</td>
                          <td class="border-b p-2">{{ flower.rarity }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Original Sell Value</td>
                          <td class="border-b p-2">{{ flower.originalSellValue.toFixed(2) }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Sell Value</td>
                          <td class="border-b p-2">{{ flower.sellValue.toFixed(2) }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Full Growth Time</td>
                          <td class="border-b p-2">{{ flower.growthDuration }} days</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Living Time</td>
                          <td class="border-b p-2">{{ flower.livingTime }} days</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Season</td>
                          <td class="border-b p-2">{{ flower.season }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </v-tabs-window-item>

                  <v-tabs-window-item value="two">
                    <table class="w-full border-collapse h-[635px]" style="font-size: 18px">
                      <tbody>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Level</td>
                          <td class="border-b p-2">{{ flower.level }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Experience</td>
                          <td class="border-b p-2">{{ flower.experience }} / {{ flower.nextLevelExp }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Ability Description</td>
                          <td class="border-b p-2">{{ flower.abilityDescription }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Resource Output</td>
                          <td class="border-b p-2">{{ (flower.output * 100).toFixed(2) }}%</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Ability Power</td>
                          <td class="border-b p-2">{{ (flower.ability * 100).toFixed(2) }}% </td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Damage</td>
                          <td class="border-b p-2">{{ flower.damage }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Mana</td>
                          <td class="border-b p-2">{{flower.mana}} / {{ flower.maxmana }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Mana Regen</td>
                          <td class="border-b p-2">{{flower.manaRegen}}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Cooldown</td>
                          <td class="border-b p-2">{{ flower.cooldown }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </v-tabs-window-item>

                  <v-tabs-window-item value="three">
                    <table class="w-full border-collapse h-[635px]" style="font-size: 18px">
                      <tbody>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Kills</td>
                          <td class="border-b p-2">{{ flower.kills }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Damage Dealt</td>
                          <td class="border-b p-2">{{ flower.damageDealt }}</td>
                        </tr>
                        <tr>
                          <td class="font-bold border-b p-2" style="font-size: 21px">Mana Spent</td>
                          <td class="border-b p-2">{{ flower.manaSpent }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-card-text>`
            </div>
          </div>
        </v-card>
      </v-card>
    </v-dialog>
</template>