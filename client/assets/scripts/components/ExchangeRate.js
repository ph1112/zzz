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
        goodscode:0,
    },

    // use this for initialization
    onLoad: function () {

         this._duihuan = cc.find("Canvas/duihuan_UI/Button1");
         this._guize = cc.find("Canvas/duihuan_UI/Button2");
        this._duihuanNode = cc.find("Canvas/duihuan_UI/duihuanNode");
        this._guizeNode = cc.find("Canvas/duihuan_UI/guizeNode");
        this._lijuannum=this._duihuanNode.getChildByName("need_lijuan").getChildByName("lijuan_num").getComponent(cc.Label);
        this._mylijuannum=this._duihuanNode.getChildByName("my_lijuan").getChildByName("lijuan_num").getComponent(cc.Label);
        this._mylijuannum.string=cc.vv.userMgr.coins;
        this.show(true);
        this.checkExchangeRate();

    },

    show:function(value)
    {
        this._duihuanNode.active=value;
        this._guizeNode.active=!value;
    },

     onOkClicked:function(event){
        if(event.target.parent.name=="Button1")
        {
            this.show(true);
        }else if(event.target.parent.name=="Button2")
        {
            this.show(false);
        } 
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
     
     checkExchangeRate:function()
     {
         //var btnsend =this._duihuanNode.getChildByName("btn_send");
        // this.addClickEvent(btnsend,this.node,"ExchangeRate","onbtncheck",0);//发送
         for(var i=1;i<=6;++i)
         {
            var btn =this._duihuanNode.getChildByName("itemDuiHuan"+i);
            var price=btn.getChildByName("lijuan_price").getComponent(cc.Label).string;
            this.addClickEvent(btn,this.node,"ExchangeRate","onbtncheck",parseInt(price));//num
            //btn.getChildByName("price").getComponent(cc.Label).string=
            //btn.getChildByName("lijuan_price").getComponent(cc.Label).string=


         }
     },
     onsendClick:function()
     {
        //  var _this=this;
        //  var isOK = function(ret){
        //     console.log("pay -----81  ");
        //     _this._mylijuannum.string=ret.residuecoins;
        //     console.log("ret"+ret);
        //     console.log("ret"+ret.residuecoins);
        //     cc.vv.userMgr.coins=ret.residuecoins;
        //     cc.find("Canvas/top_left/headinfo/lblGems").getComponent(cc.Label).string=cc.vv.userMgr.coins;
        //     console.log("cc.vv.userMgr.coins"+cc.vv.userMgr.coins);
        //   }

        //   var tmp =  parseInt(this._lijuannum.string);
        //   console.log("this._lijuannum.string "+this._lijuannum.string);
        //   console.log("tmp "+tmp);


        //    var data={
        //         token:cc.vv.userMgr.token,
        //         goods_code:tmp,
        //     }

        //     console.log("num"+data.goods_code);
        //     console.log("token"+data.token);

        //     cc.vv.http.sendRequest("/get_giftcer_of_user",data,isOK);            
     },
     onbtncheck:function(event,num)
     {
        if(event.target.name!="btn_send")
        {
            this._lijuannum.string=num;
            this.goodscode=num;
        }
        if(event.target.name=="btn_send"){
         var _this=this;
         var tmp =  parseInt(this._lijuannum.string);
         var tmp1 =  parseInt(this._mylijuannum.string);
         if(tmp1<tmp)
         {
             this.OpacityShow(this.node,{text:"礼卷不足，请充值。"})
            return;
         }
         if(this._lijuannum.string=="")
         {
            this.OpacityShow(this.node,{text:"请选择一种商品兑换。"});
            return;
         }
         var isOK = function(ret){
            _this._mylijuannum.string=ret.residuecoins;
            console.log("ret"+ret);
            console.log("ret"+ret.residuecoins);
            cc.vv.userMgr.coins=ret.residuecoins;
            cc.find("Canvas/top_left/headinfo/lblGems").getComponent(cc.Label).string=cc.vv.userMgr.coins;
            console.log("cc.vv.userMgr.coins"+cc.vv.userMgr.coins);
          }

          
          console.log("this._lijuannum.string "+this._lijuannum.string);
          console.log("tmp "+tmp);


           var data={
                token:cc.vv.userMgr.token,
                goods_code:tmp,
            }

            console.log("num"+data.goods_code);
            console.log("token"+data.token);

            cc.vv.http.sendRequest("/get_giftcer_of_user",data,isOK);
            //Http.send("xxxx");
           //var price=parseInt(this._lijuannum.string);

            //var mylijuan=parseInt(this._mylijuannum.string);
           //var mun=mylijuan-price;
           // this._mylijuannum.string=mun.toString();
        }
     },
     OpacityShow:function(parentNode,o){
        if(!this._lab){
            this._lab = new cc.Node().addComponent(cc.Label);
            this._lab.node.parent = parentNode;
            this._lab.node.setPosition(10,13);
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
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
