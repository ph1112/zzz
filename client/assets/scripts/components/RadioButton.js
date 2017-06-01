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
        target:cc.Node,
        sprite:cc.SpriteFrame,
        checkedSprite:cc.SpriteFrame,
        checked:false,
        groupId:-1,
        showNode:[],
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        if(cc.vv.radiogroupmgr == null){
            var RadioGroupMgr = require("RadioGroupMgr");
            cc.vv.radiogroupmgr = new RadioGroupMgr();
            cc.vv.radiogroupmgr.init();
        }
        //console.log(typeof(cc.vv.radiogroupmgr.add));
        cc.vv.radiogroupmgr.add(this);
        this.helpNode=cc.find("Canvas/help/helpNode");
        if(this.helpNode){
            for(var i=0;i<this.helpNode.children.length;++i)
        {
            this.showNode.push(this.helpNode.children[i]);
        }
        }
        
        this.refresh();
         this.refreshTongYong();
        //this.showhelpNode();
    },
    
    refresh:function(){
        var targetSprite = this.target.getComponent(cc.Sprite);
        if(this.checked){
            targetSprite.spriteFrame = this.checkedSprite;
        }
        else{
            targetSprite.spriteFrame = this.sprite;
        }
    },
    refreshTongYong:function(){
        var targetSprite = this.target.getComponent(cc.Sprite);
        if(this.checked){
            targetSprite.spriteFrame = this.checkedSprite;
        }
        else{
            targetSprite.spriteFrame = this.sprite;
        }
    },
    
    check:function(value){
        this.checked = value;
        this.refresh();
    },
    checkduihuan:function(value){
        this.checked = value;
        this.refreshTongYong();
    },
     onClickedduihuan:function(event,customEventData){
        cc.vv.radiogroupmgr.checkDuiHuan(this);
    },
    onClicked:function(event,customEventData){
        cc.vv.radiogroupmgr.check(this);
        if(customEventData)
        {
            this.showhelpNode();
        }
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    showhelpNode:function()
    {
        for(var i=0;i<this.showNode.length;++i){
            var child=this.showNode[i];
            if(child.name==("ScrollView_"+this.node.name))
            {
                cc.find("Canvas/help/helpNode/"+child.name).active=true;
            }else{
                cc.find("Canvas/help/helpNode/"+child.name).active=false;
            }

        }

    },
    
    onDestroy:function(){
        if(cc.vv && cc.vv.radiogroupmgr){
            cc.vv.radiogroupmgr.del(this);            
        }
    }
});
