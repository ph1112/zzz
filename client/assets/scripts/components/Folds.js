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
        _folds:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        this.initView();
        this.initEventHandler();
        
        this.initAllFolds();
    },
    
    initView:function(){
        this._folds = {};
        var game = this.node.getChildByName("game");
        var sides =["0","1","3","2"];  
        var sideNet =cc.vv.gameNetMgr.seats;
        for(var i = 0; i < sideNet.length; ++i){
            var sideName = sides[i];
            var sideRoot = game.getChildByName(sideName);
            var folds = [];
            var foldRoot = sideRoot.getChildByName("folds");
            for(var j = 0; j < foldRoot.children.length; ++j){
                var last=foldRoot.children.length-j-1;
                if(sideName=="1"||sideName=="0"){
                        var n = foldRoot.children[last];
                }else
                {
                    var n = foldRoot.children[j];
                }
                
                n.active = false;
                if(i==0){
                   // var sprite = n.getChildByName("Sprite").getComponent(cc.Sprite);               
                  
                }  else{
                      //  var sprite = n.getComponent(cc.Sprite); 
                }           
               // sprite.spriteFrame = null;
                folds.push(n); 
                           
            }
            this._folds[sideName] = folds; 
        }
        
        this.hideAllFolds();
    },
    
    hideAllFolds:function(){
        for(var k in this._folds){
            var f = this._folds[k];
            for(var i in f){
                f[i].active = false;
            }
        }
    },
    
    initEventHandler:function(){
        var self = this;
        this.node.on('game_begin',function(data){
            //self.hideAllFolds();
            self.initAllFolds();
        });  
        this.node.on('game_over',function(data){
            //self.hideAllFolds();
            self.initAllFolds();
        });  
        this.node.on('game_sync',function(data){
            self.initAllFolds();
        });
        
        this.node.on('game_chupai_notify',function(data){
            self.initFolds(data.detail);
        });
        
        this.node.on('guo_notify',function(data){
            self.initFolds(data.detail);
        });
    },
   
    initAllFolds:function(){
        var seats = cc.vv.gameNetMgr.seats;
        for(var i in seats){
            this.initFolds(seats[i]);
        }
    },
    
    initFolds:function(seatData,side){
        var folds = seatData.folds;
        if(folds == null||folds.length==0){
            return;
        }
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);
        if(localIndex>3||localIndex<0){
          return;
        }
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        //var side = cc.vv.mahjongmgr.getSide(localIndex);zyh
         var side =localIndex.toString();
         console.log("initAllFolds1 side"+side);
         if(side=="2"){
            /*if(seatData.seatindex==0){
                side="1";
            }
            else{side="3";}*/
            side="3";
         }        
     
        var foldsSprites = this._folds[side];        
        for(var i = 0; i < folds.length; ++i){
            var index = i;
            //if(side == "1"||side==="0"){
              //  index = foldsSprites.length - i - 1;
           // }
            var sprite = foldsSprites[index];
          /*if(side==="0"){*/
              var spr=sprite.getChildByName("Sprite");
              var spr1=spr.getComponent(cc.Sprite);
           spr1.spriteFrame= cc.vv.mahjongmgr.getMahjongSpriteByID_ming(side,folds[i]);
       cc.log('sprite.getChildByName("Sprite").getComponent(cc.Sprite).spriteFrame'+sprite.getChildByName("Sprite").getComponent(cc.Sprite).spriteFrame);
       /* }else
        sprite.getComponent(cc.Sprite).spriteFrame=cc.vv.mahjongmgr.getMahjongSpriteByID_ming(side,folds[i]);*/
         sprite.active=true;
         spr.active=true;
              if(side==="0")
            {
                //sprite.getParent().active=true;
            }
            //this.setSpriteFrameByMJID(pre,sprite,folds[i]);//zyh
        }
        for(var i = folds.length; i < foldsSprites.length; ++i){
            var index = i;
           // if(side == "1" || side == "3"){
              //  index = foldsSprites.length - i - 1;
          //  }      
            var sprite = foldsSprites[index];
            //sprite.spriteFrame = null;
            sprite.active = false;
        }  
    },
    
    setSpriteFrameByMJID:function(pre,sprite,mjid){
        sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre,mjid);
        sprite.active = true;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
