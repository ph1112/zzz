var errorTips = {
    uidError:"用户UID必须是1-9位数字",
    uidNotFind:"用户UID不存在",
    dailiError1:"代理权限必须为 0 ，1 ,2",
    dailiError2:"你的权限不够",
    dailiError3:"代理设置失败",
    fankaError1:"发放房卡数必须为 1-4位数字",
    fankaError2:"你的房卡不够",
    fankaError3:"添加房卡失败",
    chaXunError:"查询失败",
    };
            
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
        _daili:null,
        button1:{
            default:null,
            type:cc.Button
        },
        button2:{
            default:null,
            type:cc.Button
        },
        daiLiAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        dengjiNum:1,
        _congNodes:[],
    },

    // use this for initialization
    onLoad: function () {
        this._chongFankaBtn=this.node.getChildByName("fangka_song");
        this._setDaiLi=this.node.getChildByName("shezhi_daili");
        this._fangkaUI=this.node.getChildByName("addNode1");
        this._DailiUI=this.node.getChildByName("addNode2");
        this._congNodes.push( this._fangkaUI);
        this._congNodes.push(this._DailiUI);

        this._chaXunBtn = this._fangkaUI.getChildByName("chaxun");
        this._infoLab1=this._fangkaUI.getChildByName("infoLab1");
        this._infoLab2=this._fangkaUI.getChildByName("infoLab2");
        this._infoLab1.active = false;
        this._infoLab1.active = false;
        this._inputUID = this._fangkaUI.getChildByName("PlayerIdEditbox1");
        this._inputGemsNum= this._fangkaUI.getChildByName("PlayerIdEditbox2");

        this._inputDailiUID = this._DailiUI.getChildByName("PlayerIdEditbox1");
        this._dailidengjiNode=this._DailiUI.getChildByName("dailidengji");
        this._DailiUI.active = false;
    
        this._congNodes[0].active = true;


        this.checkDealerLev();
    },

        //检测是否显示 权限按钮
    checkDealerLev:function(){
        var lev = cc.vv.userMgr.dealer_level;
        if(lev == 3){
            this._chaXunBtn.active = true;
            this._infoLab1.active = true;
            this._infoLab2.active = true;
        }
    },

    sendDailiSet:function(str1,str2){
        self = this;

        var data = {dealerId:Number(str1),dealer_level:Number(str2)};
        var onDailiSet = function(ret){
            console.log("ret", ret);

            if(ret.errcode == 0){
                self.OpacityShow(self.node,{text:"设置代理成功"});
                return;
            }
            else if(ret.errcode == 1){
                self.OpacityShow(self.node,{text:errorTips.uidNotFind});
                return;
            }else if(ret.errcode == 2){
                self.OpacityShow(self.node,{text:errorTips.dailiError2});
                return;      
            }else{
                var errorText = errorTips.dailiError3 + " errCode:" + ret.errcode;
                self.OpacityShow(self.node,{text:errorText});
                return;
            }
        }
        
        cc.vv.userMgr.dailiSet(data,onDailiSet);
    },

    sendFanKa:function(str1,str2){
        self = this;

        var data = {userid:Number(str1),num:Number(str2)};
        var onCallBack = function(ret){
            console.log("ret", ret);

            if(ret.errcode == 0){

                var str_p = "为用户 " +  Number(str1) +"添加" + Number(str2) + "房卡成功"
                self.OpacityShow(self.node,{text:str_p});
                console.log(ret.gems);
                if (ret.gems < 0){
                    ret.gems = 0;
                }
                cc.vv.userMgr.gems = ret.gems;
                
                //发送通知刷新大厅房卡 label
                cc.vv.HallEventMgr.dispatchEvent('refrushGems',ret);
                return;
            }
            else if(ret.errcode == 2){
                self.OpacityShow(self.node,{text:errorTips.uidNotFind});
                return;
            }else if(ret.errcode == 4){
                self.OpacityShow(self.node,{text:errorTips.fankaError2});
                return;      
            }else{
                var errorText = errorTips.fankaError3 + " errCode:" + ret.errcode;
                self.OpacityShow(self.node,{text:errorText});
                return;
            }
        }
        
        cc.vv.userMgr.sendFanKa(data,onCallBack);
    },
    //选择等级
    chooseDengJi:function(event,num)
    {
         for (var index = 0; index < this._dailidengjiNode.children.length; index++) {
              var element = this._dailidengjiNode.children[index];
              if(num==index){
                element.getComponent(cc.Toggle).isChecked=true;
                this.dengjiNum=num;
              }else
              element.getComponent(cc.Toggle).isChecked=false;
         }
    },
    //确定按钮点击
    onaddBtnClicked:function(event){
        if(this._infoLab1 || this._infoLab2){
            this._infoLab1.active = false;
            this._infoLab2.active = false;
        }

        if(event.target.name == "queding"){

            var uid = this._inputUID.getComponent(cc.EditBox).string;
            var fankaNum = this._inputGemsNum.getComponent(cc.EditBox).string;
            console.log("uid, fankaNum", uid,fankaNum);
            this.checkaddGems(uid,fankaNum);
        }else if(event.target.name == "btn_setdaili"){
            var uid = this._inputDailiUID.getComponent(cc.EditBox).string;
            var lvNUm = 0;
          /*for (var index = 0; index < this._dailidengjiNode.children.length; index++) {
              var element = this._dailidengjiNode.children[index];
              if(element.getComponent(cc.Toggle).isChecked){
                lvNUm=index;
              }
     
          }*/
            this.checkDaiLi(uid,this.dengjiNum);
        }else if(event.target.name == "chaxun"){
            var uid = this._inputUID.getComponent(cc.EditBox).string;

            console.log("uid", uid,fankaNum);
            this.quaryUID(uid);
        }
    },

    checkaddGems:function(str1,str2){
        if(!this.isDigit(str1, 9)){
            this.OpacityShow(this.node,{text:errorTips.uidError});
            return;
        }else if(!this.isDigit(str2, 4)){
            this.OpacityShow(this.node,{text:errorTips.fankaError1});
            return;
        }else if(cc.vv.userMgr.gems <= Number(str2)){
            this.OpacityShow(this.node,{text:errorTips.fankaError2});
            return;
        }else{
            console.log("send add fanka");
            this.sendFanKa(str1,str2);
        }
        
    },

    quaryUID:function(str1){
        if(!this.isDigit(str1, 9)){
            this.OpacityShow(this.node,{text:errorTips.uidError});
            return;
        }else{
            console.log("quary");
            this.sendQuary(str1);
        }
        
    },
    showQuary:function(ret){
        var str1 = "房卡:" + ret.gems+ ",级别："+ ret.dealer_level;
        var str2 = ret.name;

        this._infoLab1.getComponent(cc.Label).string = str1;
        this._infoLab1.active = true;
        this._infoLab2.getComponent(cc.Label).string = str2;
        this._infoLab2.active = true;
    },

    sendQuary:function(str1){
        var self = this;

        var data = {dealerId:Number(str1)};
        var onCallBack = function(ret){
            console.log("ret", ret);

            if(ret.errcode == 0){
                self.showQuary(ret);
                return;
            }
            else if(ret.errcode == -1){
                self.OpacityShow(self.node,{text:errorTips.uidNotFind});
                return;
            }else if(ret.errcode == 2){
                self.OpacityShow(self.node,{text:errorTips.dailiError2});
                return;      
            }else{
                var errorText = errorTips.chaXunError + " errCode:" + ret.errcode;
                self.OpacityShow(self.node,{text:errorText});
                return;
            }
        }
        
        cc.vv.userMgr.sendQuary(data,onCallBack);
    },

    checkDaiLi:function(str1,str2){
        if(!this.isDigit(str1, 9)){
            this.OpacityShow(this.node,{text:errorTips.uidError});
            return;
        }else if(!this.isDigit(str2, 1)){
            this.OpacityShow(this.node,{text:errorTips.dailiError1});
            return;
        }else if(cc.vv.userMgr.dealer_level <= Number(str2)){
            this.OpacityShow(this.node,{text:errorTips.dailiError2});
            return;
        }else{
            this.sendDailiSet(str1,str2);
        }
    },

    //校验是否全由数字组成 
    isDigit:function(s, num) 
    {   
        var patrn = /^[0-9]{1,9}$/;
        if(num == 4){
            patrn = /^[0-9]{1,4}$/;
        }else if( num == 1){
            patrn = /^[0-2]{1,1}$/;
        }
        
        if (!patrn.exec(s)) return false; 
        return true 
    },

    OpacityShow:function(parentNode,o){
        if(!this._lab){
            this._lab = new cc.Node().addComponent(cc.Label);
            this._lab.node.parent = parentNode;
            this._lab.node.setPosition(100,-270);
            this._lab.node.color = new cc.Color(255, 0, 0);
            this._lab.fontSize = 30;
        }
       
        this._lab.string = o.text;
        this._lab.node.stopAllActions();
        var ani = cc.sequence(
			
			cc.fadeTo(0.25,255),
            cc.delayTime(1),
            cc.fadeTo(0.25,0),
            cc.removeSelf(),
            cc.callFunc(function(){
                this._lab = null;
            },this, 10),
            
			);
       
        this._lab.node.runAction(cc.sequence(ani));
    },

    //左侧菜单项点击
    onBtnMenuItem:function(event){
        if(event.target.name == "fangka_song"){

        this._chongFankaBtn.getComponent(cc.Sprite).spriteFrame = this.daiLiAtlas.getSpriteFrame("btn_fkzs_n");
        this._setDaiLi.getComponent(cc.Sprite).spriteFrame = this.daiLiAtlas.getSpriteFrame("btn_szdl_h");
        this._fangkaUI.active=true;
        this._DailiUI.active=false;

    }else if(event.target.name == "shezhi_daili"){
        
        this._chongFankaBtn.getComponent(cc.Sprite).spriteFrame = this.daiLiAtlas.getSpriteFrame("btn_fkzs_h");
        this._setDaiLi.getComponent(cc.Sprite).spriteFrame = this.daiLiAtlas.getSpriteFrame("btn_sedl_n");
        this._fangkaUI.active=false;
        this._DailiUI.active=true; 

        }
    },

    onBtnrenwuClicked:function(){
        this._daili.active = true;
        
    },
    
    
    addClickEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    onBtnBackClicked:function(){
        
        this._daili.active = false;            
        
    },
     onBtnColse:function(){
        
        this.node.active = false;            
        
    },


});
