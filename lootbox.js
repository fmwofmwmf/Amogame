//{'C':50, 'UC':20, 'R':10, 'SR':5, 'SSR':3, 'SSSR':2, 'UR':1, 'UUR':0.5, 'Myth': 0.25}


/**
 * Given amount of items to return, the content of what items can be returned, these item's individual weights, the individual rarities of each tile and card's tiers, produce a random array of size amt with each element being an item produced.
 * @param {number} amt 
 * @param {number[]} contents [1,2,3,4,5] = [tile, card, consumable,shards,other] ie [1] for only tiles 
 * @param {number[]} weights 
 * @param {number[]} tile_rarity 
 * @param {number[]} card_rarity 
 * @param {number[][]} last [[type, rarity], ...]
 * @returns 
 */
function loot_roll(amt, contents, weights, tile_rarity=rarity, card_rarity=rarity, last=[]){
   rolled = {tiles:[],cards:[],resources:[],shards:[],other:[]}
   for (let i = 0; i < amt; i++) {
      if (i<amt-1) {
         choice = which_content(weights, contents)
      } else {
         choice = 1
      }
      switch (choice) {
         case 1:
            tile_choice = which_content(tile_rarity, tiers)
            rolled.tiles.push(generate_tile_rarity(tile_choice))
            break;
         case 2:
            card_choice = which_content(card_rarity, tiers)
            rolled.cards.push(new Card('structure', 'power', 0))
            break;
         case 3:
            res_choice = which_content([1,1,1,1], ['woods', 'stones', 'blue triangles', 'waters'])
            rolled.resources.push(res_choice)
            break;
         case 4:
            rolled.shards.push(["shard"])
            break;
         case 5:
            rolled.other.push(["other"])
            break;
         default:
            break;
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
   return generate_tile(Math.max(randint(c_to_t[ind], max_size), 5), ind+1, bime)
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