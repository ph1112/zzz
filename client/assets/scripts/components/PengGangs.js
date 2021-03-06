cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.vv){
            return;
        }
        
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName("0");
        var pengangroot = myself.getChildByName("penggangs");
        var realwidth = cc.director.getVisibleSize().width;
        var scale = realwidth / 1280;
        pengangroot.scaleX *= scale;
        pengangroot.scaleY *= scale;
        
        var self = this;
        this.node.on('peng_notify',function(data){
            //刷新所有的牌
            //console.log(data.detail);
            var data = data.detail;
            self.onPengGangChanged(data);
        });
        
        this.node.on('gang_notify',function(data){
            //刷新所有的牌
            //console.log(data.detail);
            var data = data.detail;
            self.onPengGangChanged(data.seatData);
        });
        
        this.node.on('game_begin',function(data){
            self.onGameBein();
        });
        
        var seats = cc.vv.gameNetMgr.seats;
        for(var i in seats){
            this.onPengGangChanged(seats[i]);
        }
    },
    
    onGameBein:function(){
        this.hideSide("0");
        this.hideSide("1");
        this.hideSide("2");
        this.hideSide("3");
    },
    
    hideSide:function(side){
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");
        if(pengangroot){
            for(var i = 0; i < pengangroot.childrenCount; ++i){
                pengangroot.children[i].active = false;
            }            
        }
    },
    
    onPengGangChanged:function(seatData){
        
        if(seatData.angangs == null && seatData.diangangs == null && seatData.wangangs == null && seatData.pengs == null){
            return;
        }
        if(seatData.seatindex==3){
            return;
        }
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        var side =localIndex.toString()
         if(localIndex==2){
            //if(seatData.seatindex==0){
            //    side="1";
           // }
          //  else{side="3";}
          side="3";
         }
        //var side = cc.vv.mahjongmgr.getSide(localIndex);zyh    
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");
        
        for(var i = 0; i < pengangroot.childrenCount; ++i){
            pengangroot.children[i].active = false;
        }
        //初始化杠牌
        var index = 0;
        
        var gangs = seatData.angangs
        for(var i = 0; i < gangs.length; ++i){
            var mjid = gangs[i];
            this.initPengAndGangs(pengangroot,side,pre,index,mjid,"angang");
            index++;    
        } 
        var gangs = seatData.diangangs
        for(var i = 0; i < gangs.length; ++i){
            var mjid = gangs[i];
            this.initPengAndGangs(pengangroot,side,pre,index,mjid,"diangang");
            index++;    
        }
        
        var gangs = seatData.wangangs
        for(var i = 0; i < gangs.length; ++i){
            var mjid = gangs[i];
            this.initPengAndGangs(pengangroot,side,pre,index,mjid,"wangang");
            index++;    
        }
        
        //初始化碰牌
        var pengs = seatData.pengs
        if(pengs){
            for(var i = 0; i < pengs.length; ++i){
                var mjid = pengs[i];
                this.initPengAndGangs(pengangroot,side,pre,index,mjid,"peng");
                index++;    
            }    
        }        
    },
    
    initPengAndGangs:function(pengangroot,side,pre,index,mjid,flag){
        var pgroot = null;
        if(pengangroot.childrenCount <= index){
            if(side == "3" || side == "1"){
                pgroot = cc.instantiate(cc.vv.mahjongmgr.pengPrefabLeft);
            }
            else{
                pgroot = cc.instantiate(cc.vv.mahjongmgr.pengPrefabSelf);
            }
            pgroot.active = true;
            pengangroot.addChild(pgroot);    
        }
        else{
            pgroot = pengangroot.children[index];
            pgroot.active = true;
        }
        
        if(side == "3"){
            pgroot.y = -(index * 33 * 3)-index * 13;                    
        }
        else if(side == "1"){
            pgroot.y = (index * 33 * 3)+index * 13;
            pgroot.setLocalZOrder(-index);
        }
        else if(side == "0"){
            pgroot.x = index * 78 * 3 + index * 20;                    
        }
        else{
            pgroot.x = -(index * 55*3);
        }
        
        var sprites = pgroot.children;
        for(var s = 0; s < sprites.length; ++s){
            var sprite = sprites[s];
            if(sprite.name == "gang"){
                var isGang = flag != "peng";
                sprite.active = isGang;
                sprite.scaleX = 1.0;
                sprite.scaleY = 1.0;
                /*if(flag == "angang"){
                    sprite.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame(side);
                    sprite.getChildByName("Sprite").active=false//.getComponent(cc.Sprite).spriteFrame=cc.vv.mahjongmgr.getEmptySpriteFrame("0");
                    if(side == "0" || side == "2"){
                        sprite.scaleX = 0.9;
                        sprite.scaleY = 0.9;                        
                    }else{
                         sprite.scaleX=0.8;
                        sprite.scaleY=0.8;
                    }
                }   
                else{*/
                    
                    sprite.getChildByName("Sprite").getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getPengGangSpriteByID(side,mjid);    
               // }
            }
            else{ 
                if(flag =="angang"&&side != "0" && side != "2"){
                    sprite.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame(side);
                    sprite.scaleX=0.8;
                    sprite.scaleY=0.8;
                    sprite.getChildByName("Sprite").active=false//.getComponent(cc.Sprite).spriteFrame=cc.vv.mahjongmgr.getEmptySpriteFrame(00);

                }else
               sprite.getChildByName("Sprite").getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getPengGangSpriteByID(side,mjid);
                // sprite.setPosition(self_MJ.getChildByName("MJdi").width*(i+lackingNum)*0.9,0);
                // sprite.spriteFrame=cc.vv.mahjongmgr.getMahjongSpriteByID_ming(side,mjid);
                //sprite.active = s<3?true:false;
            }
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
