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
        _userinfo:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        this._userinfo = cc.find("Canvas/userinfo");
        this.oneUserInfo=this._userinfo.getChildByName("info1");
        this.twoUserInfo=this._userinfo.getChildByName("info2");
        this._userinfo.active = false;
        cc.vv.utils.addClickEvent(this._userinfo,this.node,"UserInfoShow","onClicked");
        
        cc.vv.userinfoShow = this;
    },
    getIconSprite:function(num)
    {
        var prepare= cc.find("Canvas/prepare");
        var game= cc.find("Canvas/game");
        if(prepare.active==true){
            return prepare.getChildByName("seats").children[num].getChildByName("icon").getComponent("ImageLoader").node.getComponent(cc.Sprite);
        }else if(game.active==true){
            if(num==2)
            {
                num==3;
            }
            
           /* var node = game.getChildByName(num+"");
           var node1 = node.getChildByName("seat");
            var node3 = node1.getChildByName("icon");*/
           return game.getChildByName(num+"").getChildByName("seat").getChildByName("icon").getComponent("ImageLoader").node.getComponent(cc.Sprite);
        }
    },
    heidInfo:function()
    {
        this.oneUserInfo.active=false;
        this.twoUserInfo.active=false;
    },
    heidMyself:function(value)
    {
         this._userinfo.getChildByName("icon").active=value;
         this._userinfo.getChildByName("name").active=value;
         this._userinfo.getChildByName("ip").active=value;
         this._userinfo.getChildByName("id").active=value;
         this._userinfo.getChildByName("sex_female").active=value;
         this._userinfo.getChildByName("sex_male").active=value;
    },
    heidInfoTwo:function()
    {

    },
    show:function(name,userId,iconSprite,sex,ip){
        this.heidInfo(); //看的自己，隐藏别人的
        this.heidMyself(true);
        if(userId != null && userId > 0){
            this._userinfo.active = true;
            this._userinfo.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = iconSprite.spriteFrame;
            this._userinfo.getChildByName("name").getComponent(cc.Label).string = name;
            this._userinfo.getChildByName("ip").getComponent(cc.Label).string = "IP: " + ip.replace("::ffff:","");
            this._userinfo.getChildByName("id").getComponent(cc.Label).string = "ID: " + userId;
            
            var sex_female = this._userinfo.getChildByName("sex_female");
            sex_female.active = false;
            
            var sex_male = this._userinfo.getChildByName("sex_male");
            sex_male.active = false;
            
            if(sex == 1){
                sex_male.active = true;
            }   
            else if(sex == 2){
                sex_female.active = true;
            }
        }
    },

     showTwo:function(array,userId,sexId){ 
         this.heidMyself(false);
         this.heidInfo();
        if(userId != null && userId > 0){
            var j=1;
            for(var i=0;i<sexId;++i)
            {

                if(userId==array[i].userid)
                {
                    j=1;
                }
                else{
                    j=2;
                }
                if(array[i].ready==false)
                {
                    if(cc.find("Canvas/game").active==false)
                    {
                        continue;
                    }
                    
                }
                     var seindex = cc.vv.gameNetMgr.getLocalIndex(array[i].seatindex);
                     var index=array[i].seatindex;
                if(seindex==0)
                {
                    continue;
                }            
            this._userinfo.active = true;
            this._userinfo.getChildByName("info"+j).active=true;
            this._userinfo.getChildByName("info"+j).getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.getIconSprite(index).spriteFrame;
            this._userinfo.getChildByName("info"+j).getChildByName("name").getComponent(cc.Label).string = array[index].name;
            this._userinfo.getChildByName("info"+j).getChildByName("ip").getComponent(cc.Label).string = "IP: " + array[index].ip.replace("::ffff:","");
            this._userinfo.getChildByName("info"+j).getChildByName("id").getComponent(cc.Label).string = "ID: " + array[index].userid;
            
            var sex_female = this._userinfo.getChildByName("info"+j).getChildByName("sex_female");
            sex_female.active = false;
            
            var sex_male = this._userinfo.getChildByName("info"+j).getChildByName("sex_male");
            sex_male.active = false;
            
            if(array[index].sex == 1){
                sex_male.active = true;
            }   
            else if(array[index].sex == 2){
                sex_female.active = true;
            }
            }

        }
    },
    
    onClicked:function(){
        this._userinfo.active = false;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
