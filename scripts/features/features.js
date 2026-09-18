const toast = Vars.headless ? () => {} : require(modName + "/libs/toast");

// feature functions and enabling/disabling
const features = {};
let restart = false;

const util = {
    features(){
        return features;
    },
    get(name){
        if(!name || typeof name !== "string" || !features[name]) return false;
        
        return Core.settings.getBool(name);
    },
    runf(name){
        if(!name || typeof name !== "string" || !features[name]) return false;
        
        let enabled = !Core.settings.getBool(name);
        Core.settings.put(name, enabled);
        features[name].func(enabled);
        if(!features[name].toggle){
            if(!restart && !enabled){
                restart = true;
                if(Vars.headless){
                    Log.warn("[red]this feature needs a game restart to be disabled[]");
                }else{
                    toast(Icon.warning, "[red]some features need a game restart to be disabled[]");
                }
            }
        }

        return enabled;
    }
};
module.exports = util;

function add(name, toggle, func){
    if(!name || typeof name !== "string") return;
    if(typeof toggle !== "boolean") return;
    if(!func || typeof func !== "function") return;
    
    features[name] = {
        func: func,
        toggle: toggle
    };
}

function load(f){
    require(modName + "/features/" + f)(add);
}

load("v1");
load("v2");
load("v3");
load("v4");

// The three primary content features are available on a fresh install without
// requiring the settings dialog first. Existing user choices still win.
Core.settings.defaults(
    "hackusated-conveyor", true,
    "hackusated-junction", true,
    "hackusated-walls", true
);

// if the feature is on it should stay on
let applied = false;
function applyEnabledFeatures(){
    if(applied) return;
    applied = true;

    for(let f in features){
        if(util.get(f)) features[f].func(true);
    }
}

Events.on(ClientLoadEvent, applyEnabledFeatures);
Events.on(ServerLoadEvent, applyEnabledFeatures);
