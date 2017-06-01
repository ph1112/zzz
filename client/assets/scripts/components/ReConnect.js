cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _reconnect:null,
        _lblTip:null,
        _lastPing:0,
    },

    // use this for initialization
    onLoad: function () {
        this._reconnect = cc.find("Canvas/reconnect");
        this._lblTip = cc.find("Canvas/reconnect/tip").getComponent(cc.Label);
        var self = this;
        
        var fnTestServerOn = function(){
            cc.log("disconnect XXX");
            
            var roomId = cc.vv.userMgr.oldRoomId;
            cc.vv.userMgr.enterRoom(roomId,function(){},true);
                
            if(self.thecount < 10 && !cc.vv.gameNetMgr.isconnected){
                 setTimeout(fnTestServerOn,2000);
                 self.thecount++;
            }
            
            if(self.thecount >= 10){
                 cc.director.loadScene('hall');
            }

            if(cc.vv.gameNetMgr.isconnected){
                try{
                    self._reconnect.active = false;
                }catch(v){
                    
                }finally{
                    
                }
            }    
            //cc.director.loadScene('hall');
            
        }

        
        var fn = function(data){
            if(cc.vv.gameNetMgr.gamestate && cc.vv.gameNetMgr.gamestate.length>0){
                self.node.off('disconnect',fn);
                self._reconnect.active = true;
                self._lblTip.string = "与服务器断开连接，请检查网络。";
                cc.vv.gameNetMgr.isconnected = false;
                self.thecount = 0
                fnTestServerOn();
            }
        };
        
        this.node.on('disconnect',fn);
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._reconnect.active){
            if(cc.vv.gameNetMgr.isconnected){
                this._reconnect.active = false;
            }
        }
        /*
        if(this._reconnect.active){
            var t = Math.floor(Date.now() / 1000) % 4;
            this._lblTip.string = "与服务器断开连接，请检查网络，并重启游戏";
            for(var i = 0; i < t; ++ i){
                this._lblTip.string += '.';
            }
        }
        */
    },
});
