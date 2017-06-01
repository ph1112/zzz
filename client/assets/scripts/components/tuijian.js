var errorTips = {
    uidError:"用户UID必须是1-9位数字",
    uidNotFind:"用户UID不存在",
    dailiError1:"代理权限必须为 0 ，1 , 2",
    tuijian2:"你的已经领过了推荐礼包",
    tuijian3:"推荐礼包领取失败",
    fankaError1:"发放房卡数必须为 1-4位数字",
    fankaError2:"你的房卡不够",
    fankaError3:"添加房卡失败",
    chaXunError:"查询失败",
    };

cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad:function(){
        this._okBtn = cc.find("Canvas/tuijian/btn_ok")
        this.addClickEvent(this._okBtn,this.node,"TuiJian","onOkClicked");

        this._tuijianInput = cc.find("Canvas/tuijian/tuijianInput");
    },

    onOkClicked:function(event){
        var uid = this._tuijianInput.getComponent(cc.EditBox).string;
        
        this.checkString(uid);
    },

    checkString:function(str1){
        if(!this.isDigit(str1, 9)){
            this.OpacityShow(this.node,{text:errorTips.uidError});
            return;
        }else{
            this.sendTuijianSet(str1);
        }
    },

    sendTuijianSet:function(str1){
        var self = this;

        var data = {suggest_id:Number(str1)};
        var onTuijianSet = function(ret){
            console.log("ret", ret);
            
            if(ret.errcode == 0){
                var text_str = "领取推荐有奖成功，恭喜你获得了" + ret.gems + "张房卡";
                self.OpacityShow(self.node,{text:"领取推荐有奖成功，恭喜你获得了3张房卡"});
                if (ret.gems < 0){
                    ret.gems = 0;
                }
                cc.vv.userMgr.gems = cc.vv.userMgr.gems + ret.gems;
                
                //发送通知刷新大厅房卡 label
                cc.vv.HallEventMgr.dispatchEvent('refrushGems',ret);
                return;
                
            }else if(ret.errcode == 4){
                self.OpacityShow(self.node,{text:errorTips.uidNotFind});
                return;
            }else if(ret.errcode == 3){
                self.OpacityShow(self.node,{text:errorTips.tuijian2});
                return;      
            }else{
                var errorText = errorTips.tuijian3 + " errCode:" + ret.errcode;
                self.OpacityShow(self.node,{text:errorText});
                return;
            }
            
        }
        
        cc.vv.userMgr.tuijianSet(data,onTuijianSet);
    },

    OpacityShow:function(parentNode,o){
        if(!this._lab){
            this._lab = new cc.Node().addComponent(cc.Label);
            this._lab.node.parent = parentNode;
            this._lab.node.setPosition(20,-190);
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

    addClickEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },

   
});