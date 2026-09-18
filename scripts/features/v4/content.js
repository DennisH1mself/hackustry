const buildVisibilities = {
    hidden: BuildVisibility.hidden,
    shown: BuildVisibility.shown,
    debugOnly: BuildVisibility.debugOnly,
    editorOnly: BuildVisibility.editorOnly,
    coreZoneOnly: BuildVisibility.coreZoneOnly,
    worldProcessorOnly: BuildVisibility.worldProcessorOnly,
    sandboxOnly: BuildVisibility.sandboxOnly,
    campaignOnly: BuildVisibility.campaignOnly,
    legacyLaunchPadOnly: BuildVisibility.legacyLaunchPadOnly,
    notLegacyLaunchPadOnly: BuildVisibility.notLegacyLaunchPadOnly,
    lightingOnly: BuildVisibility.lightingOnly,
    fogOnly: BuildVisibility.fogOnly
};

function content(){
    const dialog = new BaseDialog("content");
    dialog.addCloseButton();
    
    dialog.cont.center().pane(p => {
        p.defaults().size(210, 64);
        
        let i = 0;
        Vars.content.each(e => {
            if(!(e instanceof UnlockableContent)) return;
            p.button(e.localizedName, new TextureRegionDrawable(e.uiIcon), () => {
                const content = new BaseDialog(e.name);
                content.addCloseButton();
                
                let c = content.cont;
                c.defaults().center();
                c.image(e.fullIcon);
                c.row();
                c.label(() => {
                    let cls = getRealClass(e);
                    if(cls.getName().includes("$")) cls = cls.getSuperclass();
                    let name = cls.getName();
                    return e.localizedName + " (type: " + name.substring(name.lastIndexOf(".") + 1) + ")";
                });
                c.row();
                c.button("unlock", Icon.lockOpen, () => {
                    e.quietUnlock();
                    content.hide();
                }).size(210, 64);
                c.row();
                c.button("unlock temporarily", Icon.lockOpen, () => {
                    e.alwaysUnlocked = true;
                    content.hide();
                }).size(210, 64);
                c.row();
                c.button("lock", Icon.lock, () => {
                    e.clearUnlock();
                    content.hide();
                }).size(210, 64);
                c.row();
                
                if(e instanceof Block){
                    c.button("build visibility", Icon.eye, () => {
                        const bv = new BaseDialog("build visibility");
                        bv.addCloseButton();
                        
                        Object.keys(buildVisibilities).forEach(b => {
                            bv.cont.button(b, () => {
                                e.buildVisibility = buildVisibilities[b];
                                bv.hide();
                            }).size(210, 64);
                            bv.cont.row();
                        });
                        
                        bv.show();
                    }).size(210, 64);
                    c.row();
                }
                
                c.button("more", Icon.add, () => {
                    const stats = new BaseDialog("stats");
                    stats.addCloseButton();
                    
                    stats.cont.center().pane(pane => {
                        let i2 = 0;
                        Object.keys(e).forEach(s => {
                            if(e[s] === undefined) return;
                            if(typeof e[s] === "object") return;
                            if(typeof e[s] === "function") return;

                            pane.button(s, () => {
                                const valueType = typeof e[s];
                                Vars.ui.showTextInput("enter value (" + valueType + ")", s + ":", 128, String(e[s]), false, v => {
                                    let value = v;
                                    if(valueType === "boolean"){
                                        if(!v.match(/^true$|^false$/i)) return;
                                        value = v.toLowerCase() === "true";
                                    }else if(valueType === "number"){
                                        value = Number(v);
                                        if(!isFinite(value)) return;
                                    }

                                    try{
                                        e[s] = value;
                                    }catch(c){}
                                });
                                stats.hide();
                            }).size(210, 64);
                            i2++;
                            if(!(i2 % 2)) pane.row();
                        });
                    }).growY().width(Vars.mobile ? Core.graphics.getWidth() : Core.graphics.getWidth()/3);
                    
                    stats.show();
                }).size(210, 64);
                c.row();
                
                content.show();
            });
            i++;
            if(!(i % 2)) p.row();
        });
    }).growY().width(Vars.mobile ? Core.graphics.getWidth() : Core.graphics.getWidth()/3);
    
    dialog.buttons.button("more", Icon.add, () => {
        const more = new BaseDialog("more");
        more.addCloseButton();
        
        let c = more.cont;
        c.defaults().size(210, 64);
        
        c.button("unlock all", () => {
            Vars.content.each(e => {
                if(!(e instanceof UnlockableContent)) return;
                e.quietUnlock();
            });
            more.hide();
        });
        c.row();
        
        c.button("temporarily unlock all", () => {
            Vars.content.each(e => {
                if(!(e instanceof UnlockableContent)) return;
                e.alwaysUnlocked = true;
            });
            more.hide();
        });
        c.row();
        
        c.button("lock all", () => {
            Vars.content.each(e => {
                if(!(e instanceof UnlockableContent)) return;
                e.clearUnlock();
            });
            more.hide();
        });
        c.row();
        
        c.button("build visibility\n(all blocks)", Icon.eye, () => {
            const bv = new BaseDialog("build visibility");
            bv.addCloseButton();
            
            Object.keys(buildVisibilities).forEach(b => {
                bv.cont.button(b, () => {
                    Vars.content.blocks().each(e => e.buildVisibility = buildVisibilities[b]);
                    bv.hide();
                }).size(210, 64);
                bv.cont.row();
            });
            
            bv.show();
        });
        c.row();
       
        more.show();
    });
    
    dialog.show();
}

module.exports = (p) => {
    p.button("content", () => {
        content();
    }).left().width(210);
};
