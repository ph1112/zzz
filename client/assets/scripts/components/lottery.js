
var awardAngle01=parseInt(Math.random()*35+5);
var awardAngle02=parseInt(Math.random()*35+47);
var awardAngle03=parseInt(Math.random()*35+92);
var awardAngle04=parseInt(Math.random()*35+137);
var awardAngle05=parseInt(Math.random()*35+182);
var awardAngle06=parseInt(Math.random()*35+227);
var awardAngle07=parseInt(Math.random()*35+272);
var awardAngle08=parseInt(Math.random()*35+317);
var dataId={
    '0':"10张礼卷",
    '1':"10张房卡",
    '2':"30张礼卷",
    '3':"5张房卡",
    '4':"50张礼卷",
    '5':"100张礼卷",
    '6':"3张房卡",
    '7':"1张房卡"
}
cc.Class({
    extends:cc.Component,
    properties:{
        pointer:{
            default:null,
            type:cc.Sprite
        },
        pointerButton:cc.Button,
        awardWords:{
            default:null,
            type:cc.Label
        },
        odd:{
            default:null,
            type:cc.Label
        },
        fangka:{
            default:null,
            type:cc.Label
        },
        gold:{
            default:null,
            type:cc.Label
        },
        cost:{
            default:null,
            type:cc.Label
        },
        allLotter:[]

    },
    onLoad:function()
    {
        this.getfangkaAndother();
        var _this=this;
        cc.vv.gameNetMgr.dataEventHandler=this.node;
        this.node.on("get_lastNum",function(data)
        {
            _this.odd.string=data.detail.count;
        });
    },
    pointerbegin:function(_this,adValue)
    {
        

    },
    refresh:function()
    {
        //this.fangka.getComponent(cc.Label).string=cc.vv.userMgr.gems;
       // this.gold.getComponent(cc.Label).string=cc.vv.userMgr.coins;
        //this.cost.getComponent(cc.Label).string=//话费
        this.pointer.node.rotation=23;
        for(var i in this.allLotter)
        {
            this.allLotter[i].active=false;
        }
    },

    getfangkaAndother:function()
    {
        this.fangka.getComponent(cc.Label).string=cc.vv.userMgr.gems;
        this.gold.getComponent(cc.Label).string=cc.vv.userMgr.coins;

        for(var i=1;i<=8;i++)
        {   this.node.getChildByName("lotteryNode").getChildByName("bg").getChildByName("Id"+i).active=false;
            var spr=this.node.getChildByName("lotteryNode").getChildByName("bg").getChildByName("Id"+i);
            this.allLotter.push(spr);
        }
        
        //this.cost.getComponent(cc.Label).string=//话费
    },
    pointerButtonStartControl:function(event,value)
    {
        var _this=this;
        var clicktimes=6;
        var rounds = 10;
         
        if(parseInt(_this.odd.string)<=0)
        {
            this.OpacityShow(this.node,{text:"剩余次数不足，请充值后再来"});
            return;
        }
        this.refresh();
               var adValue=8;
        var onGet = function(ret){
                    adValue = ret.result;
                    var numID=awardAngle01;
                    switch (adValue) {
                        case 1:
                            numID=awardAngle01;
                            break;
                            case 2:
                                numID=awardAngle02;
                                break;
                            case 3:
                                numID=awardAngle03;
                                break;
                            case 4:
                                numID=awardAngle04;
                                break;
                            case 5:
                                numID=awardAngle05;
                                break;
                            case 6:
                                numID=awardAngle06;
                                break;
                            case 7:
                                numID=awardAngle07;
                                break;
                            case 8:
                                numID=awardAngle08;
                                break;
                    
                        default:
                            break;
                    }
                    _this.pointerButton.interactable=false;
                        var rotateBy01 =cc.rotateBy(clicktimes,numID+360*rounds);//numID+360*rounds-23
                        var action=rotateBy01.easing(cc.easeCircleActionInOut(clicktimes));
                        var actionStepa=_this.pointer.node.runAction(cc.sequence( rotateBy01,cc.callFunc(function()
                        {
                            _this.pointerButton.interactable=true;
                            _this.odd.string=parseInt(_this.odd.string)-1;
                            cc.vv.userMgr.getCoins();
                            _this.showAward(dataId[adValue-1]);
                            var id=adValue-1;
                            _this.allLotter[id].active=true;
                        })));

                };
                
               var data={
                    token:cc.vv.userMgr.token,
               }
               cc.vv.http.sendRequest("/getslyder_result",data,onGet);

              
                //_this.pointerButton.destroy();
           // }

        //});
    },
    showAward:function(value)
    {
        this.node.getChildByName("awardinfo").active=true;
        this.awardWords.getComponent(cc.Label).string="恭喜获得"+value;
    },
    showinfo:function()
    {
        console.log("cc.vv.userMgr.gems"+cc.vv.userMgr.gems);
        console.log("cc.vv.userMgr.coins"+cc.vv.userMgr.coins);

       this.fangka.getComponent(cc.Label).string=cc.vv.userMgr.gems;
       this.gold.getComponent(cc.Label).string=cc.vv.userMgr.coins;
    },
    addClickEvent:function(node,target,component,handler,value){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        eventHandler.customEventData = value;
        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },

    OpacityShow:function(parentNode,o){
        if(!this._lab){
            this._lab = new cc.Node().addComponent(cc.Label);
            this._lab.node.parent = parentNode;
            this._lab.node.setPosition(10,-340);
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
            },this, 10)
            
			);
       
        this._lab.node.runAction(cc.sequence(ani));
    },
    btnconfirm:function()
    {
        this.node.getChildByName("awardinfo").active=false;
        this.showinfo();
    }
});