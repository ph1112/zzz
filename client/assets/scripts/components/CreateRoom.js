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
        _difenxuanze:null,
        _zimo:null,
        _wanfaxuanze:null,
        _zuidafanshu:null,
        _jushuxuanze:null,
        _MaiMa:null,
        _leixingxuanze:null,
    },

    // use this for initialization
    onLoad: function () {
        this._leixingxuanze = [];
        var t = this.node.getChildByName("leixingxuanze");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._leixingxuanze.push(n);
            }
        }

        //地区
        this._diquxuanze = [];
        var t = this.node.getChildByName("diquxuanze");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._diquxuanze.push(n);
            }
        }
        
        this._difenxuanze = [];
        var t = this.node.getChildByName("difenxuanze");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._difenxuanze.push(n);
            }
        }
        //console.log(this._difenxuanze);
        
        this._zimo = [];
        var t = this.node.getChildByName("zimojiacheng");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._zimo.push(n);
            }
        }
        //console.log(this._zimo);
        
        this._wanfaxuanze = [];
        var t = this.node.getChildByName("wanfaxuanze");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._wanfaxuanze.push(n);
            }
        }
        //console.log(this._wanfaxuanze);
        
        this._zuidafanshu = [];
        var t = this.node.getChildByName("zuidafanshu");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._zuidafanshu.push(n);
            }
        }
        //console.log(this._zuidafanshu);
        
        this._jushuxuanze = [];
        var t = this.node.getChildByName("xuanzejushu");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._jushuxuanze.push(n);
            }
        }
        
        this._MaiMa = [];
        var t = this.node.getChildByName("MaiMa");
        for(var i = 0; i < t.childrenCount; ++i){
            var n = t.children[i].getComponent("RadioButton");
            if(n != null){
                this._MaiMa.push(n);
            }
        }
        //console.log(this._jushuxuanze);

        //半频道
        this.banPinDao=this.node.getChildByName("zimojiacheng")//.children[1];
        //数坎 不可明
        this.wanfaNode=this.node.getChildByName("wanfaxuanze");
    },
    RefreshStatusPindao:function(value,sy)
    {   if(sy=="xg")
        {
            this.wanfaNode.active=true;
        }else
        this.wanfaNode.active=false;
       

        var sprnode=this.banPinDao.children[0].getComponent("RadioButton");
         var sprnode1=this.banPinDao.children[1].getComponent("RadioButton");
  
        var targetSprite = sprnode.target.getComponent(cc.Sprite);
        var targetSprite1 = sprnode1.target.getComponent(cc.Sprite);

        sprnode.checked=value;
        sprnode1.checked=false;
        targetSprite.spriteFrame = sprnode.checkedSprite;
        targetSprite1.spriteFrame = sprnode1.sprite;
          if(!value)
         {
            this.banPinDao.children[1].active=false;
        
        }else
         this.banPinDao.children[1].active=value;

    },
    RefreshStatuswanfa:function()
    {
        for(var i=0;i<this.wanfaNode.children.length;++i)
        {
           var tt = this.wanfaNode.children[i].getComponent("RadioButton");
           var spr = tt.target.getComponent(cc.Sprite);
             tt.checked=false;
             spr.spriteFrame = tt.sprite;
        }
    },
    OnDistrictSelector:function(event,customEventData)
    {
        if(customEventData=="xy")
        {
            this.RefreshStatusPindao(true);
            this.RefreshStatuswanfa();
        }else if(customEventData=="sz")
        {
            this.RefreshStatusPindao(false);
            this.RefreshStatuswanfa();

        }else if(customEventData=="sy")
        {
            this.RefreshStatusPindao(false);
            this.RefreshStatuswanfa();

        }else if(customEventData=="xg")
        {
            this.RefreshStatusPindao(true,customEventData);
        }

    },
    onBtnBack:function(){
        this.node.active = false;
    },
    
    onBtnOK:function(event,customEventData){
       
        this.node.active = false;
        this.createRoom(customEventData);
    },
    onBtn_other:function(event,customEventData){
        this.node.active = false;
        this.createRoom(customEventData);
    },
    
    createRoom:function(num){
        var self = this;
        var onCreate = function(ret){
            if(ret.errcode !== 0){
                cc.vv.wc.hide();
                //console.log(ret.errmsg);
                if(ret.errcode == 2222){
                    cc.vv.alert.show("提示","房卡不足，创建房间失败!");  
                }
                else{
                    cc.vv.alert.show("提示","创建房间失败,错误码:" + ret.errcode);
                }
            }
            else{
                if(num=="forMy"){
                    cc.vv.gameNetMgr.connectGameServer(ret);
                }else
                {
                     cc.vv.alert.show("提示","替他人房间，成功");                
                     
                }
                
            }
        };
        
        var difen = 0;
        /*for(var i = 0; i < self._difenxuanze.length; ++i){
            if(self._difenxuanze[i].checked){
                difen = i;
                break;
            }
        }*/

         var diqu = 0;
        for(var i = 0; i < self._diquxuanze.length; ++i){
            if(self._diquxuanze[i].checked){
                diqu = i+1;
                break;
            }
        }
        
        var pinDao = 0;
        for(var i = 0; i < self._zimo.length; ++i){
            if(self._zimo[i].checked){
                pinDao = i;
                break;
            }     
        }

        var shukan = self._wanfaxuanze[0].checked;        
        var BuKeMing = self._wanfaxuanze[1].checked;
        //var menqing = 0;
        //var tiandihu = false;
        var liangDaoZiMo = 0;
        var type = 0;
        for(var i = 0; i < self._leixingxuanze.length; ++i){
            if(self._leixingxuanze[i].checked){
                type = i;
                break;
            }     
        }
        
        if(type == 0){
            type = "xzdd";
        }
        else{
            type = "xlch";
        }
        
        var BeiShuFengDing = 0;
        for(var i = 0; i < self._zuidafanshu.length; ++i){
            if(self._zuidafanshu[i].checked){
                BeiShuFengDing = i;
                break;
            }     
        }
        var liangDaoZiMo=0;
        
        var jushuxuanze = 0;
        for(var i = 0; i < self._jushuxuanze.length; ++i){
            if(self._jushuxuanze[i].checked){
                jushuxuanze = i;
                break;
            }     
        }
        
        var MaiMa = 0;
        for(var i = 0; i < self._MaiMa.length; ++i){
            if(self._MaiMa[i].checked){
                MaiMa = i;
                break;
            }     
        }
        
        var conf = {
            type:type,
            difen:difen,
            zimo:diqu,  //地区
            jiangdui:pinDao,  //频道
            huansanzhang:shukan,  //数坎
            zuidafanshu:BeiShuFengDing,//倍数封顶
            //dianganghua:liangDaoZiMo,      //0                
            jushuxuanze:jushuxuanze,  //局数选择          
            menqing:MaiMa,     //买码
            tiandihu:BuKeMing,   //不可明
        }; 
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            conf:JSON.stringify(conf),
            token:cc.vv.userMgr.token,
        };
        console.log(data);
        cc.vv.wc.show("正在创建房间");
        console.log("正在创建房间");
        console.log("conf "+conf);
        if(num=="forMy")
        {
               cc.vv.http.sendRequest("/create_private_room",data,onCreate);
        }
        else
        cc.vv.http.sendRequest("/create_private_room_for_others",data,onCreate);
        
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
