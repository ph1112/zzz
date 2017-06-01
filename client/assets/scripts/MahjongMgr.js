var mahjongSprites = [];
var mahjongSprites_PH=[];
var mahjongSprites_Ming=[];
var mahjongSprites_R_Ming=[];
var mahjongSprites_L_Ming=[];
var mahjongSprites_Out_Myself=[];
var penggang_L=[];
var penggang_R=[];
cc.Class({
    extends: cc.Component,

    properties: {
        leftAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        rightAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        GameOverAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
         leftMingHold:{
            default:null,
            type:cc.SpriteAtlas
        },
        
        rightMingHold:{
            default:null,
            type:cc.SpriteAtlas
        },

        bottomAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        outMyselfFoldAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        bottomFoldAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
         pengGangAtlasL:{
            default:null,
            type:cc.SpriteAtlas
        },
         pengGangAtlasR:{
            default:null,
            type:cc.SpriteAtlas
        },
        pengPrefabSelf:{
            default:null,
            type:cc.Prefab
        },
        
        pengPrefabLeft:{
            default:null,
            type:cc.Prefab
        },
        
        emptyAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
         huTypeEmpty:{
            default:null,
            type:cc.SpriteAtlas
        },
        holdsEmpty:{
            default:[],
            type:[cc.SpriteFrame]
        },
        _sides:null,
        _pres:null,
        _foldPres:null,
    },
    
    onLoad:function(){
        if(cc.vv == null){
            return;
        }
        this._sides = ["0","1","3"];     
        this._pres = ["M_","R_","B_","L_"];
        this._foldPres = ["B_","R_","B_","L_"];
        cc.vv.mahjongmgr = this; 
        
        //筒
        for(var i = 1; i < 10; ++i){
            mahjongSprites.push("dot_" + i);               
        }

        for(var j=0;j<2;++j){
         for(var i = 11; i < 20; ++i){
            if(j===0){
                    mahjongSprites_PH.push("handmah_"+i);    
            }else
            mahjongSprites_PH.push("handmah_"+(i+20));   
               
        }}
       // this.initMaJiangs(mahjongSprites_PH);//自己的手牌
        this.initMaJiangs(mahjongSprites_Ming);//自己的亮牌
        this.initMaJiangs(mahjongSprites_Out_Myself);//自己的打出去牌

        this.initMaJiangs(mahjongSprites_L_Ming);//左边的打出去牌
        this.initMaJiangs(mahjongSprites_R_Ming);//右边的打出去牌

        this.initMaJiangs(penggang_L);//左边的杠碰牌
        this.initMaJiangs(penggang_R);//右边的杠碰牌


        //条
        for(var i = 1; i < 10; ++i){
            mahjongSprites.push("bamboo_" + i);
        }
        
        //万
        for(var i = 1; i < 10; ++i){
            mahjongSprites.push("character_" + i);
        }
        
        //中、发、白
        mahjongSprites.push("red");
        mahjongSprites.push("green");
        mahjongSprites.push("white");
            mahjongSprites_PH.push("handmah_45");   
            mahjongSprites_PH.push("handmah_46");  
            mahjongSprites_PH.push("handmah_47");  
        


        //东西南北风
        mahjongSprites.push("wind_east");
        mahjongSprites.push("wind_west");
        mahjongSprites.push("wind_south");
        mahjongSprites.push("wind_north");
    },
    
    initMaJiangs:function(array){
        for(var j=0;j<2;++j){
         for(var i = 11; i < 20; ++i){
            if(j===0){
                    array.push("mingmah_"+i);    
            }else
            array.push("mingmah_"+(i+20));   
               
        }}
            array.push("mingmah_45");
            array.push("mingmah_46");
            array.push("mingmah_47");
    },
    
    getMahjongSpriteByID:function(id){
       return mahjongSprites_PH[id]
        
    },
    gameOverBymahjongID:function(id){
       
       return this.GameOverAtlas.getSpriteFrame(mahjongSprites_Ming[id]);    
    },
    getHuTypeSprite:function(num)
    {
        var type="HuType"+num;
        return this.huTypeEmpty.getSpriteFrame(type);
    },
    getPengGangSpriteByID:function(pre,id)
    {
         if(pre == "0"){
             return  this.GameOverAtlas.getSpriteFrame(mahjongSprites_Ming[id]);            //mahjongSprites_Ming[id]
        }
        else if(pre == "1"){
            return this.pengGangAtlasR.getSpriteFrame(penggang_L[id]);
        }
        else if(pre == "3"){
            return this.pengGangAtlasL.getSpriteFrame(penggang_R[id]);
        }
    },


    getMahjongSpriteByID_ming:function(pre,id){   
         //return  this.outMyselfFoldAtlas.getSpriteFrame(mahjongSprites_Out_Myself[id]);

        if(id>21)
        {
            return this.rightAtlas.getSpriteFrame(mahjongSprites_R_Ming[0]);;
        }    
        if(pre == "0"){
             return  this.outMyselfFoldAtlas.getSpriteFrame(mahjongSprites_Out_Myself[id]);            //mahjongSprites_Ming[id]
        }
        else if(pre == "1"){
            return this.rightAtlas.getSpriteFrame(mahjongSprites_R_Ming[id]);
        }
        else if(pre == "3"){
            return this.leftAtlas.getSpriteFrame(mahjongSprites_L_Ming[id]);
        }
    },
    
    /*getMahjongSpriteByID_L_ming:function(id){

       return  this.leftAtlas.getSpriteFrame(mahjongSprites_L_Ming[id]);  
        
    },
    getMahjongSpriteByID_R_ming:function(id){

       return  this.rightAtlas.getSpriteFrame(mahjongSprites_R_Ming[id]);  
        
    },*/


    getMahjongType:function(id){
      if(id >= 0 && id < 9){
          return 0;
      }
      else if(id >= 9 && id < 18){
          return 1;
      }
      else if(id >= 18 && id < 27){
          return 2;
      }
    },
    
    getSpriteFrameByMJID1:function(mjid)
    {
        return this.bottomAtlas.getSpriteFrame(this.getMahjongSpriteByID(mjid));    
    },

    getSpriteFrameByMJID:function(pre,mjid){
        var spriteFrameName = this.getMahjongSpriteByID(mjid);
        spriteFrameName = pre + spriteFrameName;
        if(pre == "M_"){
            return this.leftMingHold.getSpriteFrame(spriteFrameName);            
        }
        else if(pre == "B_"){
            return this.leftMingHold.getSpriteFrame(spriteFrameName);
        }
        else if(pre == "L_"){
            return this.leftMingHold.getSpriteFrame(spriteFrameName);
        }
        else if(pre == "R_"){
            return this.rightMingHold.getSpriteFrame(spriteFrameName);
        }//rightAtlas
    },

    getOtherPlayDaoSpriteFrameByMJID:function(pre,mjid,seatData){
        //mjid+=11;
        //var spriteFrameName = "mingmah_";
        //spriteFrameName+=mjid.toString();
        if(pre == "M_"){
            return this.leftMingHold.getSpriteFrame(mahjongSprites_L_Ming[mjid]);            
        }   
        else if(pre == "B_"){
            return this.leftMingHold.getSpriteFrame(mahjongSprites_L_Ming[mjid]);
        }  
        else if(pre =="L_"){
            return this.leftMingHold.getSpriteFrame(mahjongSprites_L_Ming[mjid]);
        }
        else if(pre =="R_"){
            return this.rightMingHold.getSpriteFrame(mahjongSprites_R_Ming[mjid]);
        }
    },

    getAudioURLByMJID:function(id){
        var realId = 0;
        if(id >= 0 && id < 9){
            realId = id + 21;
        }
        else if(id >= 9 && id < 18){
            realId = id - 8;
        }
        else if(id >= 18 && id < 21){
            if(id==18)
            {
                realId=71;
            }else if(id==19)
            {
                realId=81;
            }else if(id==20)
            {
                realId=91;
            }
           // realId = id +13;
        }
        var num=Math.floor(Math.random()*10);
        var str="";
        if(0<=num&&num<=4){
            str=realId;
        }else if(5<=num&&num<=9)
        {
            str=realId+"_1";
        }
        return "nv/" +this.getlanguage()+this.getSex()+str + ".mp3";
    },
    getActionVoice:function()
    {
        return "nv/"+this.getlanguage()+this.getSex();
    },
    getlanguage:function()
    {
        var languagearray= cc.find("Canvas/popups/settings/language").children;
        var str="";
        for(var i in languagearray )
        {
            var btn=languagearray[i].getComponent("RadioButton");
            if(btn.checked)
            {
                switch (i) {
                    case "0":
                        str="PT/";
                        break;
                    case "1":
                        str="XY/";
                        break;
                    case "2":
                        str="SZ/";
                        break;
                     case "3":
                        str="SY/";
                        break;
                    case "4":
                        str="XG/";
                        break;
                    default:
                        break;
                }
                return str;
            }

        }
    },
    getSex:function()
    {
        var sexarray= cc.find("Canvas/popups/settings/sex").children;
        var str="";
        for(var i in sexarray )
        {
            var btn=sexarray[i].getComponent("RadioButton");
            if(btn.checked)
            {
                switch (i) {
                    case "0":
                        str="men/";
                        break;
                    case "1":
                        str="women/";
                        break;                  
                    default:
                        break;
                }
                return str;
            }

        }
    },

    getEmptySpriteFrame:function(side){
        if(side == "2"){
            return this.emptyAtlas.getSpriteFrame("leftandR");
        }   
        else if(side == "0"){
            return this.emptyAtlas.getSpriteFrame("mingmah_00");
        }
        else if(side == "3"){
            return this.emptyAtlas.getSpriteFrame("leftandR");
        }
        else if(side == "1"){
            return this.emptyAtlas.getSpriteFrame("leftandR");
        }
        else if(side == "00"){
            return this.emptyAtlas.getSpriteFrame("touming");
        }
    },
    
    getHoldsEmptySpriteFrame:function(side){
        if(side == "2"){
            return this.emptyAtlas.getSpriteFrame("e_mj_up");
        }   
        else if(side == "0"){
            return null;
        }
        else if(side == "3"){
            return this.emptyAtlas.getSpriteFrame("e_mj_left");
        }
        else if(side == "1"){
            return this.emptyAtlas.getSpriteFrame("e_mj_right");
        }
    },
    
    sortMJ:function(mahjongs,dingque,kou){
        var self = this;
        mahjongs.sort(function(a,b){
            
        if(kou && kou.length>0){
            for(var i =0;i<kou.length;i++){
                 if(a==kou[i]){       
                    a = a-30;;
                 }
                 if(b==kou[i]){          
                    b = b-30;
                 }
            }
        }
        
            /*if(dingque >= 0){
                var t1 = self.getMahjongType(a);
                var t2 = self.getMahjongType(b);
                if(t1 != t2){
                    if(dingque == t1){
                        return 1;
                    }
                    else if(dingque == t2){
                        return -1;
                    }
                }*/
            
            return a - b;
           // }
        });
    },
    
    getSide:function(localIndex){
        return this._sides[localIndex];
    },
    
    getPre:function(localIndex){
        return this._pres[localIndex];
    },
    
    getFoldPre:function(localIndex){
        return this._foldPres[localIndex];
    }
});
