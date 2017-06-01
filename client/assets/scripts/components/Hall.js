var Net = require("Net")
var Global = require("Global")
cc.Class({
    extends: cc.Component,

    properties: {
        lblName:cc.Label,
        lblMoney:cc.Label,
        lblGems:cc.Label,
        lblID:cc.Label,
        lblNotice:cc.Label,
        joinGameWin:cc.Node,
        createRoomWin:cc.Node,
        settingsWin:cc.Node,
        helpWin:cc.Node,
        xiaoxiWin:cc.Node,
        btnJoinGame:cc.Node,
        btnReturnGame:cc.Node,
        sprHeadImg:cc.Sprite,
        kefuWin:cc.Node,
        fenxiangWin:cc.Node,
        kaifang:cc.Node,
        chongzhi:cc.Node,
        tuijianNode:cc.Node,
        duihuanNode:cc.Node,
        choujiangNode:cc.Node,
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
    
    initNetHandlers:function(){
        var self = this;
    },
    
    onShare:function(){
        cc.vv.anysdkMgr.share("至尊卡五星","至尊卡五星包含经典的卡五星玩法。");   
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        if(!cc.vv){
            cc.director.loadScene("loading");
            return;
        }
       
        this.initLabels();
        
        if(cc.vv.gameNetMgr.roomId == null){
            this.btnJoinGame.active = true;
            this.btnReturnGame.active = false;
        }
        else{
            this.btnJoinGame.active = false;
            this.btnReturnGame.active = true;
        }
        
        //var params = cc.vv.args;
        var roomId = cc.vv.userMgr.oldRoomId 
        if( roomId != null){
            cc.vv.userMgr.oldRoomId = null;
            cc.vv.userMgr.enterRoom(roomId,function(){},true);
        }

        this.createRoomWin.active = false;   
        
        var imgLoader = this.sprHeadImg.node.getComponent("ImageLoader");
        imgLoader.setUserID(cc.vv.userMgr.userId);
        cc.vv.utils.addClickEvent(this.sprHeadImg.node,this.node,"Hall","onBtnClicked");
        
        
        this.addComponent("UserInfoShow");
        
        this.initButtonHandler("Canvas/right_bottom/btn_shezhi");
        this.initButtonHandler("Canvas/right_bottom/btn_help");
        this.initButtonHandler("Canvas/right_bottom/btn_xiaoxi");
         this.initButtonHandler("Canvas/right_bottom/btn_kefu");//客服
         this.initButtonHandler("Canvas/right_bottom/btn_share");//分享
         this.initButtonHandler("Canvas/right_bottom/btn_kaifang");//开房
         this.initButtonHandler("Canvas/right_bottom/btn_chongzhi");//充值
         this.initButtonHandler("Canvas/right_bottom/btn_tuijian");//推荐
         this.initButtonHandler("Canvas/btn_convert");//兑换
         this.initButtonHandler("Canvas/right_bottom/btn_chouJiang");//抽奖

         this.chongzhiBtn=cc.find("Canvas/right_bottom/btn_chongzhi");
        this.helpWin.addComponent("OnBack");
        this.xiaoxiWin.addComponent("OnBack");
        
        this.kefuWin.addComponent("OnBack");
        this.fenxiangWin.addComponent("OnBack");
        this.kaifang.addComponent("OnBack");
        this.kaifang.addComponent("OnBack");
        this.chongzhi.addComponent("OnBack");
        this.tuijianNode.addComponent("OnBack");
        this.duihuanNode.addComponent("OnBack");
        this.choujiangNode.addComponent("OnBack");
        
        if(!cc.vv.userMgr.notice){
            cc.vv.userMgr.notice = {
                version:null,
                msg:"数据请求中...",
            }
        }
        
        if(!cc.vv.userMgr.gemstip){
            cc.vv.userMgr.gemstip = {
                version:null,
                msg:"数据请求中...",
            }
        }
        
        this.lblNotice.string = cc.vv.userMgr.notice.msg;
        
        this.refreshInfo();
        this.refreshNotice();
        this.refreshGemsTip();
        
        cc.vv.audioMgr.playBGM("bgMain.mp3");
        this.checkDealerLev();
    },
     checkDealerLev:function(){
        var lev = cc.vv.userMgr.dealer_level;
        if(lev == 3){
            this.chongzhiBtn.active = true;
        }
    },
    refreshInfo:function(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                if(ret.gems != null){
                    this.lblGems.string = ret.gems;    
                }
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
        };
        cc.vv.http.sendRequest("/get_user_status",data,onGet.bind(this));
    },
    
    refreshGemsTip:function(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                cc.vv.userMgr.gemstip.version = ret.version;
                cc.vv.userMgr.gemstip.msg = ret.msg.replace("<newline>","\n");
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            type:"fkgm",
            version:cc.vv.userMgr.gemstip.version
        };
        cc.vv.http.sendRequest("/get_message",data,onGet.bind(this));
    },
    
    refreshNotice:function(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                cc.vv.userMgr.notice.version = ret.version;
                cc.vv.userMgr.notice.msg = ret.msg;
                this.lblNotice.string = ret.msg;
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            type:"notice",
            version:cc.vv.userMgr.notice.version
        };
        cc.vv.http.sendRequest("/get_message",data,onGet.bind(this));
    },
    
    initButtonHandler:function(btnPath){
        var btn = cc.find(btnPath);
        cc.vv.utils.addClickEvent(btn,this.node,"Hall","onBtnClicked");        
    },
    
    
    
    initLabels:function(){
        this.lblName.string = cc.vv.userMgr.userName;
        this.lblMoney.string = cc.vv.userMgr.coins;
        this.lblGems.string = cc.vv.userMgr.gems;
        this.lblID.string = "ID:" + cc.vv.userMgr.userId;
    },
    
    onBtnClicked:function(event){
        if(event.target.name == "btn_shezhi"){
            this.settingsWin.active = true;
        }   
        else if(event.target.name == "btn_help"){
            this.helpWin.active = true;
        }
        else if(event.target.name == "btn_xiaoxi"){
            this.xiaoxiWin.active = true;
        }
        else if(event.target.name=="btn_kefu")
        {
            
            this.kefuWin.active=true;
            var ani=this.kefuWin.getComponent(cc.Animation);
            ani.play("kefu");
            //var anim = this.getComponent(cc.Animation);
        }
        else if(event.target.name=="btn_share")
        {
                this.fenxiangWin.active = true;
        }
         else if(event.target.name=="btn_kaifang")
        {
                this.kaifang.active = true;
                //cc.vv.userMgr.getListUserRooms();
               // this.kaifang.dispatchEvent('checkRoomList',1);
               // cc.vv.HallEventMgr.dispatchEvent('checkRoomList',false);
        }
        else if(event.target.name=="btn_chongzhi")
        {
                this.chongzhi.active=true;
        }   
         else if(event.target.name=="btn_tuijian")
        {
                this.tuijianNode.active=true;
        } 
        else if(event.target.name=="btn_convert")
        {
                this.duihuanNode.active=true;
        } 
        else if(event.target.name=="btn_chouJiang")
        {    var self=this;
            var onGet = function(ret) {             
                console.log("ret.count"+ret.count);
               // self.choujiangNode.dispatchEvent('get_lastNum',{count:ret.count});  
                cc.vv.gameNetMgr.dispatchEvent('get_lastNum',{count:ret.count});          
            };

            var data = {
                token: cc.vv.userMgr.token
            };
            //this.node.dispatchEvent('get_lastNum',1); 
            cc.vv.http.sendRequest("/get_slyder_count", data, onGet);
            this.choujiangNode.active=true;
        }
        else if(event.target.name == "head"){
            cc.vv.userinfoShow.show(cc.vv.userMgr.userName,cc.vv.userMgr.userId,this.sprHeadImg,cc.vv.userMgr.sex,cc.vv.userMgr.ip);
        }
    },
    
    onJoinGameClicked:function(){
        this.joinGameWin.active = true;
    },
    
    onReturnGameClicked:function(){
        cc.director.loadScene("mjgame");  
    },
    
    onBtnAddGemsClicked:function(){
        cc.vv.alert.show("提示",cc.vv.userMgr.gemstip.msg);
        this.refreshInfo();
    },
    
    onCreateRoomClicked:function(){
        if(cc.vv.gameNetMgr.roomId != null){
            cc.vv.alert.show("提示","房间已经创建!\n必须解散当前房间才能创建新的房间");
            return;
        }
        console.log("onCreateRoomClicked");
        this.createRoomWin.active = true;   
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var x = this.lblNotice.node.x;
        x -= dt*100;
        if(x + this.lblNotice.node.width < -1000){
            x = 500;
        }
        this.lblNotice.node.x = x;
        
        if(cc.vv && cc.vv.userMgr.roomData != null){
            cc.vv.userMgr.enterRoom(cc.vv.userMgr.roomData,function(){},true);
            cc.vv.userMgr.roomData = null;
        }
    },
});
