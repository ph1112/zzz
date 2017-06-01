cc.Class({
    extends: cc.Component,

    properties: {

        Item:{
            default:null,
            type:cc.Prefab
         },
        _content:null, 
        //_item:null,
    
    },

    onLoad: function () {
        //cc.vv.h
        this._content=  cc.find("Canvas/Kaifang_UI/scrollView/view/content");
        // cc.vv.HallEventMgr.
        this._content.removeChild( this._content.children[0]);
        var self = this;
        this.node.on("checkRoomList",function(num)
        {
                self.checkroomList();
        });
    },

     onJoinRoom:function(event, customEventData){
        cc.vv.audioMgr.playSFX("ui_click.mp3");
       var roomId = customEventData;

       console.log("customEventData:",customEventData);
        cc.vv.userMgr.enterRoom(roomId,function(ret){
            if(ret.errcode == 0){

            }
            else{
                var content = "房间["+ roomId +"]不存在，请重新输入!";
                if(ret.errcode == 4){
                    content = "房间["+ roomId + "]已满!";
                }
                cc.vv.alert.show("提示",content);
    
            }
        }.bind(this)); 
    },

    checkroomList:function()
    {
         var self = this;
        cc.vv.userMgr.getListUserRooms(function(data){
            self.initRoomList(data);
        });
    },

    initRoomList:function(data){
        var fankaNum = 1;
        if(data.length==0)
        {
            this.node.getChildByName("noRoom").active=true;
            return;
        }else{
            this.node.getChildByName("noRoom").active=false;
        }
        for(var i = 0; i < data.length; ++i){
            var node = this.getViewItem(i);
            node.idx = i;
            node.getChildByName("roomID").getComponent(cc.Label).string = "房间号：" + data[i].id;
            data[i].base_info = JSON.parse(data[i].base_info);
            var status = data[i].status;
            if (data[i].base_info.maxGames == 16){
                fankaNum = 2;
            }else{
                fankaNum = 1;
            }
            this.reflushListStatus(node,status);
            //var str_p = "总局数" + data[i].base_info.maxGames + "局 " + "消耗房卡 " + fankaNum
            node.getChildByName("Rounds").getComponent(cc.Label).string = "总局数" + data[i].base_info.maxGames;
            node.getChildByName("fangka").getComponent(cc.Label).string = "消耗房卡 " + fankaNum;

            var joinBtn = node.getChildByName("enter");
            this.addClickEvent(joinBtn,this.node,"Forotherkey","onJoinRoom",data[i].id);

            var yaoqingBtn = node.getChildByName("invite");
            this.addClickEvent(yaoqingBtn,this.node,"Forotherkey","OnYaoQingBtn",data[i].id);
            
        }
        this.shrinkContent(data.length);
        
    },

    OnYaoQingBtn:function(event, customEventData){
       cc.vv.audioMgr.playSFX("ui_click.mp3");
       var roomId = customEventData;
       var title = "<至尊卡五星>";  
        cc.vv.anysdkMgr.share("至尊卡五星" + title,"房号:" + roomId + " 玩法:" + cc.vv.gameNetMgr.getWanfa());
    },
     addClickEvent:function(node,target,component,handler,customEventData){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        eventHandler.customEventData = customEventData;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
     getViewItem:function(index){
        var content = this._content;
        if(content.childrenCount > index){
            return content.children[index];
        }
        var node = cc.instantiate(this.Item);
        content.addChild(node);
        return node;
    },
        shrinkContent:function(num){
        while(this._content.childrenCount > num){
            var lastOne = this._content.children[this._content.childrenCount -1];
            this._content.removeChild(lastOne,true);
        }
    },

     reflushListStatus:function(node,status){
        //var hallAtlas = this.node.getComponent("Hall").HallAtlas;
        if(status == 0){
            node.getChildByName("NotStarted").active=true;
            node.getChildByName("Started").active=false;
            //.getComponent(cc.Label).string = "未开始";
            //node.getChildByName("start_dian").getComponent(cc.Sprite).spriteFrame = hallAtlas.getSpriteFrame("yikais");
        }else{
            node.getChildByName("NotStarted").active=false;
            node.getChildByName("Started").active=true;
           // node.getChildByName("start_laber")//.getComponent(cc.Label).string = "已开始";
            //node.getChildByName("start_dian").getComponent(cc.Sprite).spriteFrame = hallAtlas.getSpriteFrame("weikaisi");
        }
    },
});
