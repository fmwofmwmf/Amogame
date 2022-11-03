const tile_rarity = [50,20,10,5,3,2,1,0.5,0.25]
//{'C':50, 'UC':20, 'R':10, 'SR':5, 'SSR':3, 'SSSR':2, 'UR':1, 'UUR':0.5, 'Myth': 0.25}
//contents: (type)
// 1 - tile
// 2 - card
// 3 - consumable
// 4 - resource
//last:
// [type, rarity]
//rarity_chage:
// [[rarity, delta]]
/**
 * idk
 * @param {*} amt 
 * @param {*} contents 
 * @param {*} weights 
 * @param {*} tile_rarity 
 * @param {*} card_rarity 
 * @param {*} last 
 * @returns 
 */
function loot(amt, contents, weights, tile_rarity, card_rarity, last=[]){
   rolled = []
   for (let i = 0; i < amt; i++) {
      if (i == amt - 1 && last.length > 0) {
         rolled.push(last)
      } else {
         choice = which_content(weights, contents)
         switch (choice) {
            case 1:
               tile_choice = which_content(tile_rarity, tiers)
               rolled.push(generate_tile_rarity(tile_choice))
               break;
            case 2:
               card_choice = which_content(card_rarity, tiers)
               rolled.push(["Card", "Move 1 tile", card_choice])
               break;
            case 3:
               rolled.push(["Resources"])
               break;
            default:
               break;
         }
      }
   }
   return rolled
}

/**
 * idk
 * @param {*} rarity 
 * @param {*} bime 
 * @returns 
 */
function generate_tile_rarity(rarity, bime=-1) {
   ind = tiers.indexOf(rarity)
   if (ind == tiers.length - 1) {
      max_size = 100 
   } else {
      max_size = c_to_t[ind+1]
   }
   return generate_tile(randint(c_to_t[ind], max_size), ind+1, bime)
}

/**
 * 
 * @param {*} weights 
 * @returns 
 */
function weights_to_chance(weights) {
   chance = []
   rolling_sum = 0
   const weights_sum = weights.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
   for (let i = 0; i < weights.length; i++) {
      rolling_sum = rolling_sum + weights[i]
      chance.push(rolling_sum/weights_sum)
   }
   return chance
}

/**
 * 
 * @param {*} weights 
 * @param {*} contents 
 * @returns 
 */
function which_content(weights, contents) {
   chance = weights_to_chance(weights)
   num = Math.random()
   for (let i = 0; i < chance.length; i++) {
      if (num <= chance[i]) {
         return contents[i]
      }
   }
   return contents[-1]
}