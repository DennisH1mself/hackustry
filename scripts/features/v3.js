const defaultPowerProduction = Blocks.powerSource.powerProduction;
const originalSizes = {};

module.exports = add => {
    
    // reconstructors take no items and instant
    add("reconstructors", false, () => {
        Vars.content.blocks().each(e => {
            if(!(e instanceof Reconstructor)) return;
            e.constructTime = 0.001;
            e.removeConsumers(consumer => consumer instanceof ConsumeItems);
            e.reinitializeConsumers();
        });
    });
    
    // fixes the built in power source to give infinite power
    add("power-sources", true, t => {
        Blocks.powerSource.powerProduction = t ? Infinity : defaultPowerProduction;
    });
    
    add("cursed-mode", true, t => {
        Vars.content.blocks().each(e => {
            if(e instanceof CoreBlock) return;

            if(originalSizes[e.name] === undefined) originalSizes[e.name] = e.size;
            e.size = t && originalSizes[e.name] > 2 ? originalSizes[e.name] - 2 : originalSizes[e.name];
        });
    });
    
    add("op-turrets", false, () => {
        Blocks.scorch.localizedName = "Scorch v5";
        Blocks.ripple.localizedName = "Ripplag";
        Blocks.lancer.localizedName = "Lancerdown";
        Blocks.meltdown.localizedName = "Meltlong";
        Blocks.foreshadow.localizedName = "Foreshadop";
        
        Vars.content.blocks().each(e => {
            if(e.minfo.mod) return;
            
            if(!(e instanceof Turret)) return;
            e.reload = 0;
            e.inaccuracy = 0;
            e.recoil = 0;
            e.recoilTime = 0;
            e.xRand = 0;
            e.cooldownTime = 0.001;
            e.rotateSpeed = Float.MAX_VALUE;
            e.targetGround = true;
            e.targetAir = true;

            if(e.shoot != null){
                e.shoot.firstShotDelay = 0;
                e.shoot.shotDelay = 0;
                if(e.shoot instanceof ShootSpread) e.shoot.spread = 0;
            }
            
            if(!(e instanceof PowerTurret)) return;
            e.shootType.collidesGround = true;
            e.shootType.collidesAir = true;
            
            if(!(e instanceof LaserTurret)) return;
            e.range = 999;
            e.shootDuration = 999;
            if(e.shootType instanceof LaserBulletType) e.shootType.length = 999;
        });
    });
};
