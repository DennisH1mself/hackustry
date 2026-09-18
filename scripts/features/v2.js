function restoreWall(build){
    build.dead = false;
    build.health = build.maxHealth;
}

// Damage is ignored, but removal is intentionally not overridden. Mindustry's
// instantDeconstruct flag handles player removal without breaking world cleanup.
const wallbuild = {
    handleDamage(){
        return 0;
    },

    kill(){
        restoreWall(this);
    },

    killed(){
        restoreWall(this);
    }
};

const wall = extend(Wall, "hackusated-wall", {
    localizedName: "Hackusated Wall",
    description: "An indestructible wall that builds and deconstructs instantly.",
    category: Category.defense,
    requirements: ItemStack.empty,
    buildVisibility: BuildVisibility.hidden,
    inEditor: false,
    size: 1,
    health: Integer.MAX_VALUE,
    instantBuild: true,
    instantDeconstruct: true,
    alwaysUnlocked: true
});
wall.buildType = () => extend(Wall.WallBuild, wall, wallbuild);

const largewall = extend(Wall, "hackusated-wall-large", {
    localizedName: "Large Hackusated Wall",
    description: "A large indestructible wall that builds and deconstructs instantly.",
    category: Category.defense,
    requirements: ItemStack.empty,
    buildVisibility: BuildVisibility.hidden,
    inEditor: false,
    size: 2,
    health: Integer.MAX_VALUE,
    instantBuild: true,
    instantDeconstruct: true,
    alwaysUnlocked: true
});
largewall.buildType = () => extend(Wall.WallBuild, largewall, wallbuild);

function setVisible(block, visible){
    block.inEditor = visible;
    block.buildVisibility = visible ? BuildVisibility.shown : BuildVisibility.hidden;
}

module.exports = add => {
    add("hackusated-walls", true, enabled => {
        setVisible(wall, enabled);
        setVisible(largewall, enabled);
    });
};
