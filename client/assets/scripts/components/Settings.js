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
        _btnYXOpen:null,
        _btnYXClose:null,
        _btnYYOpen:null,
        _btnYYClose:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
            
        this._btnYXOpen = this.node.getChildByName("yinxiao").getChildByName("btn_yx_open");
        this._btnYXClose = this.node.getChildByName("yinxiao").getChildByName("btn_yx_close");
        
        this._btnYYOpen = this.node.getChildByName("yinyue").getChildByName("btn_yy_open");
        this._btnYYClose = this.node.getChildByName("yinyue").getChildByName("btn_yy_close");
        
        this._language=this.node.getChildByName("language");//声音选择
        this._sex=this.node.getChildByName("sex");//男女
        if(this._language&&this._sex)
        {   
            this._btPT=this._language.getChildByName("putong").getChildByName("Button1");
            this._btXY=this._language.getChildByName("xiangyang").getChildByName("Button2");
            this._btSZ=this._language.getChildByName("suizhou").getChildByName("Button3");
            this._btSY=this._language.getChildByName("shiyan").getChildByName("Button4");
            this._btXG=this._language.getChildByName("xiaogan").getChildByName("Button5");

            this._btNan=this._sex.getChildByName("men").getChildByName("Button6");
            this._btNv=this._sex.getChildByName("women").getChildByName("Button7");

            this.initButtonHandler(this._btPT);
            this.initButtonHandler(this._btXY);
            this.initButtonHandler(this._btSZ);
            this.initButtonHandler(this._btSY);
            this.initButtonHandler(this._btXG);
            this.initButtonHandler(this._btNan);
            this.initButtonHandler(this._btNv);
            this.initVolue();
        }

        this.initButtonHandler(this.node.getChildByName("btn_close"));
        this.initButtonHandler(this.node.getChildByName("btn_exit"));
       
        
        this.initButtonHandler(this._btnYXOpen);
        this.initButtonHandler(this._btnYXClose);
        this.initButtonHandler(this._btnYYOpen);
        this.initButtonHandler(this._btnYYClose);



        var slider = this.node.getChildByName("yinxiao").getChildByName("progress");
        cc.vv.utils.addSlideEvent(slider,this.node,"Settings","onSlided");
        
        var slider = this.node.getChildByName("yinyue").getChildByName("progress");
        cc.vv.utils.addSlideEvent(slider,this.node,"Settings","onSlided");
        
        this.refreshVolume();
    },
    initVolue:function()
    {
        var key="Language" 
        var key1="sex";
        var userData = JSON.parse(cc.sys.localStorage.getItem(key));
        var userData1 = JSON.parse(cc.sys.localStorage.getItem(key1));
        if(userData&&userData1)
        {
            this._btPT.parent.getComponent("RadioButton").checked=false;
            this._btXY.parent.getComponent("RadioButton").checked=false;
            this._btSZ.parent.getComponent("RadioButton").checked=false;
            this._btSY.parent.getComponent("RadioButton").checked=false;
            this._btXG.parent.getComponent("RadioButton").checked=false;

            this._btNan.parent.getComponent("RadioButton").checked=false;
            this._btNv.parent.getComponent("RadioButton").checked=false;
            switch (userData) {
                case 1:
                     this._btPT.parent.getComponent("RadioButton").checked=true;
                    break;
                case 2:
                     this._btXY.parent.getComponent("RadioButton").checked=true;
                    break;
                case 3:
                     this._btSZ.parent.getComponent("RadioButton").checked=true;
                    break;
                case 4:
                     this._btSY.parent.getComponent("RadioButton").checked=true;
                    break;
                case 5:
                     this._btXG.parent.getComponent("RadioButton").checked=true;
                    break;

               
            
                default:
                    break;
            }

            switch (userData1) {
                 case 1:
                     this._btNan.parent.getComponent("RadioButton").checked=true;
                    break;
                case 2:
                     this._btNv.parent.getComponent("RadioButton").checked=true;
                    break;
            
                default:
                    break;
            }
        }

    },
    onSlided:function(slider){
        if(slider.node.parent.name == "yinxiao"){
            cc.vv.audioMgr.setSFXVolume(slider.progress);
        }
        else if(slider.node.parent.name == "yinyue"){
            cc.vv.audioMgr.setBGMVolume(slider.progress);
        }
        this.refreshVolume();
    },
    
    initButtonHandler:function(btn){
        cc.vv.utils.addClickEvent(btn,this.node,"Settings","onBtnClicked");    
    },
    
    refreshVolume:function(){
        
        this._btnYXClose.active = cc.vv.audioMgr.sfxVolume > 0;
        this._btnYXOpen.active = !this._btnYXClose.active;
        
        var yx = this.node.getChildByName("yinxiao");
        var width = 430 * cc.vv.audioMgr.sfxVolume;
        var progress = yx.getChildByName("progress")
        progress.getComponent(cc.Slider).progress = cc.vv.audioMgr.sfxVolume;
        progress.getChildByName("progress").width = width;  
        //yx.getChildByName("btn_progress").x = progress.x + width;
        
        
        this._btnYYClose.active = cc.vv.audioMgr.bgmVolume > 0;
        this._btnYYOpen.active = !this._btnYYClose.active;
        var yy = this.node.getChildByName("yinyue");
        var width = 430 * cc.vv.audioMgr.bgmVolume;
        var progress = yy.getChildByName("progress");
        progress.getComponent(cc.Slider).progress = cc.vv.audioMgr.bgmVolume; 
        
        progress.getChildByName("progress").width = width;
        //yy.getChildByName("btn_progress").x = progress.x + width;
    },
    
    onBtnClicked:function(event){

        var key="Language"
        var key1="sex"
        if(event.target.name == "btn_close"){
            this.node.active = false;
        }
        else if(event.target.name == "btn_exit"){
            cc.sys.localStorage.removeItem("wx_account");
            cc.sys.localStorage.removeItem("wx_sign");
            cc.director.loadScene("login");
        }
        else if(event.target.name == "btn_yx_open"){
            cc.vv.audioMgr.setSFXVolume(1.0);
            this.refreshVolume(); 
        }
        else if(event.target.name == "btn_yx_close"){
            cc.vv.audioMgr.setSFXVolume(0);
            this.refreshVolume();
        }
        else if(event.target.name == "btn_yy_open"){
            cc.vv.audioMgr.setBGMVolume(1);
            this.refreshVolume();
        }
        else if(event.target.name == "btn_yy_close"){
            cc.vv.audioMgr.setBGMVolume(0);
            this.refreshVolume();
        }else if(event.target.name=="Button1")//普通
        {
            cc.sys.localStorage.setItem(key, 1);

        }else if(event.target.name=="Button2")
        {
            cc.sys.localStorage.setItem(key, 2);

        }else if(event.target.name=="Button3")
        {

            cc.sys.localStorage.setItem(key, 3);
        }else if(event.target.name=="Button4")
        {
            cc.sys.localStorage.setItem(key, 4);

        }else if(event.target.name=="Button5")
        {
            cc.sys.localStorage.setItem(key, 5);

        }else if(event.target.name=="Button6")//男女
        {
            cc.sys.localStorage.setItem(key1, 1);

        }else if(event.target.name=="Button7")
        {
            cc.sys.localStorage.setItem(key1, 2);
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
