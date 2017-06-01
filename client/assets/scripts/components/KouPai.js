var hupaiCard = require("Module_exports");
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
        btn0:{
            default:null,
            type:cc.Button,
            },
        btn_MJID:0,
        btn_checked:false ,
        btnArray:[],
        MJidArray:[], 
    },

    // use this for initialization
    onLoad: function () {
        //cc.vv.gameNetMgr.dataEventHandler = this.node;
        // this.btnArray=[];
         for (var index = 0; index < 4; index++) {
             
            var btn= cc.find("Canvas/game/KouPai/Button"+index);
             this.btnArray.push(btn);
         }
         var self=this;
        this.node.on("koupai",function(data)
        {
           // data.detail
           var a=self.btnArray;
            for (var index = 0; index < data.detail.length; index++) {
                var element = data.detail[index];
                self.btnArray[index].active=true;
                self.btnArray[index].koupaiId=element;
                self.btnArray[index].getChildByName("Sprite").getComponent(cc.Sprite).spriteFrame=
                cc.vv.mahjongmgr.gameOverBymahjongID(element);
                
            }

        });

    },
    setVisble:function(name,isVisb)
    {
        this.node.getChildByName(name).getChildByName("kouxia").active=isVisb;
    },
    btnKouPaiClick:function(event){
        cc.log("扣牌");
       var tt= event.target.name;
       
       switch (tt) {
           case "Button0":
           case "Button1":
           case "Button2":
           case "Button3":
               {
                   var isVisb=this.node.getChildByName(tt).getChildByName("kouxia").active;
                   if(!isVisb)
                   {   event.target.koupaiId

                       this.MJidArray.push(event.target.koupaiId);
                       this.setVisble(tt,true);
                   }else
                   {
                       this.MJidArray.pop(event.target.koupaiId);
                        this.setVisble(tt,false);
                   }
                   //this.setVisble(tt,false);
                  // =true;
                 //MJidArray.push(event.target.btn_MJID);
               }
               break;
            case "queren":
            {
                 cc.log("扣下选的牌");
                  var seatData = cc.vv.gameNetMgr.getSelfData();
                    var holds=seatData.holds//现在是自己出牌。提示选择一张牌，再点亮
                 if(holds.length == 2 ||
                    holds.length == 5 || holds.length == 8 || holds.length == 11 || holds.length == 14){
               
                    if(hupaiCard.data){
                        cc.vv.net.send("chupai", hupaiCard.data.mjId);
                    }else{
                        var length=holds.length-1;
                        cc.vv.net.send("chupai", holds[length]);
                    }
                  }
                 cc.vv.net.send('liangDao',this.MJidArray);//选择要扣的牌
                 this.node.active=false;
            }
            break;
            case "quxiao":
            {
                cc.log("取消扣牌");
                //亮可见
                cc.find("Canvas/game/0/ting").active = true;
                this.node.active=false;
            }
            break;
           default:
               break;
       }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
