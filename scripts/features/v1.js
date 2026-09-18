// Content must be created while this mod is the active loading context. Creating
// it from ContentInitEvent is too late in v8 and loses the mod namespace.
const hjunction = extend(Junction, "hackusated-junction", {
    localizedName: "Hackusated Junction",
    description: "Crosses item streams with no transit delay.",
    category: Category.distribution,
    requirements: ItemStack.empty,
    buildVisibility: BuildVisibility.hidden,
    inEditor: false,
    health: 99999,
    speed: 0,
    capacity: 64,
    displayedSpeed: 99999,
    instantBuild: true,
    instantDeconstruct: true,
    alwaysUnlocked: true
});

// Vanilla junctions release at most one item per direction each tick, even
// with zero transit delay. Repeat the vanilla update only while it is making
// progress so full conveyor bursts cross without creating a 60 item/s choke.
hjunction.buildType = () => extend(Junction.JunctionBuild, hjunction, {
    updateTile(){
        for(let pass = 0; pass < hjunction.capacity; pass++){
            let before = 0;
            for(let direction = 0; direction < 4; direction++){
                before += this.buffer.indexes[direction];
            }
            if(before === 0) break;

            this.super$updateTile();

            let after = 0;
            for(let direction = 0; direction < 4; direction++){
                after += this.buffer.indexes[direction];
            }
            if(after === before) break;
        }
    }
});

const hconv = extend(Conveyor, "hackusated-conveyor", {
    localizedName: "Hackusated Conveyor",
    description: "Moves items effectively instantly. Also launches units at absurd speed.",
    category: Category.distribution,
    requirements: ItemStack.empty,
    buildVisibility: BuildVisibility.hidden,
    inEditor: false,
    health: 99999,
    speed: 99999,
    displayedSpeed: 99999,
    junctionReplacement: hjunction,
    instantBuild: true,
    instantDeconstruct: true,
    alwaysUnlocked: true
});

function setVisible(block, visible){
    block.inEditor = visible;
    block.buildVisibility = visible ? BuildVisibility.shown : BuildVisibility.hidden;
}

module.exports = add => {
    add("hackusated-conveyor", true, enabled => setVisible(hconv, enabled));
    add("hackusated-junction", true, enabled => setVisible(hjunction, enabled));
};
