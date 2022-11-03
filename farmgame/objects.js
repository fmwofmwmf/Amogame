const farm = {
    disp:`
    <span class="hover">
        A farm
        <span class="hover-info">
        Basic farm. Farms money.</br>
        Innate: Efficency is affected by seasons.</br>
        Active: Grows Crops.<br>
        Leveling: Increased speed.
        </span>
    </span>
    `,
    updates: function (o) {
        o.stats['name'] = "Farm"
        o.stats['income'] 
        if (o.stats.level==(o.stats.rank+1)*1) {
            o.stats['upcost'] = {number:(o.stats.rank+1)*690}
            o.stats.rankup = true;
        } else {
            o.stats['upcost'] = {number:(o.stats.level+1)*10}
            o.stats.rankup = false;
        }

        cost = ''
        for (const key in o.stats.upcost) {
            cost += `- ${key}: ${o.stats.upcost[key]}<br>`
        }
        o.upcost.innerHTML = `Cost: <br>${cost}`
    },
    daily: function (o) {

        resources.number += (o.stats.level + 2*o.stats.rank + 1)*(o.stats.rank+1);
    },
    onlevel: function (o) {

    },
    onrank: function (o) {

    }
}