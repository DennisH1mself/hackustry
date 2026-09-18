const originalSectorUnlocks = {};
let capturedSectorUnlocks = false;
const originalDebugSelect = PlanetDialog.debugSelect;

module.exports = add => {
    
    // launch to any sector
    add("launch-anywhere", true, t => {
        if(!capturedSectorUnlocks){
            Vars.content.sectors().each(e => originalSectorUnlocks[e.name] = e.alwaysUnlocked);
            capturedSectorUnlocks = true;
        }

        PlanetDialog.debugSelect = t || originalDebugSelect;
        Vars.content.sectors().each(e => {
            e.alwaysUnlocked = t ? true : originalSectorUnlocks[e.name];
        });
    });
};
