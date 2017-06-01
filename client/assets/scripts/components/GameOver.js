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
        _gameover:null,
        _gameresult:null,
        _seats:[],
        _isGameEnd:false,
        _pingju:null,
        _win:null,
        _lose:null,
        _over_time:null,
        _over_jushu:null,
        _over_roomId:null,
        _over_Ma:null,
        _isZimo:false,
        _isLiangdao:false,
        _overAni:{
            default:null,
            type:cc.Node
        },
        maiMacard:0,
        _mafen:null,
        _maiNam:-1,
		
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        if(cc.vv.gameNetMgr.conf == null){
            return;
        }
        // if(cc.vv.gameNetMgr.conf.type == "xzdd"){
        //     this._gameover = this.node.getChildByName("game_over");
        // }
        // else{
        //     this._gameover = this.node.getChildByName("game_over_xlch");
        // }
        
        this._gameover = this.node.getChildByName("game_over");
        cc.vv.gameNetMgr.dataEventHandler = this._gameover;
        this._gameover.active = false;
        this._over_time=this._gameover.getChildByName("Time");
        this._over_jushu=this._gameover.getChildByName("jushu");
        this._over_roomId=this._gameover.getChildByName("roomID");
        this._pingju = this._gameover.getChildByName("pingju");
        this._win = this._gameover.getChildByName("win");
        this._lose = this._gameover.getChildByName("lose");
        this._over_Ma=this._gameover.getChildByName("MA");
        this._gameresult = this.node.getChildByName("game_result");
        this.playAniNode=this.node.getChildByName("playani"); //胡动画
        this.huaTypeAni=this.playAniNode.getComponent(cc.Animation);
        this._overAni=cc.find("Canvas/Maima").getComponent(cc.Animation);
        this._mafen=this._gameover.getChildByName("mafen").getComponent(cc.Label);
        var wanfa = this._gameover.getChildByName("wanfa").getComponent(cc.Label);
        this._over_Ma.active = false;
        //this._mafen.active = false;
        cc.find("Canvas/Maima").active=false;
         this._diquType=this._gameover.getChildByName("typeNode");//地区
        wanfa.string = cc.vv.gameNetMgr.getWanfa();
        
        var listRoot = this._gameover.getChildByName("result_list");
        for(var i = 1; i <= 4; ++i){
            var s = "s" + i;
            var sn = listRoot.getChildByName(s);
            var viewdata = {};
            viewdata.username = sn.getChildByName('username').getComponent(cc.Label);
            viewdata.reason = sn.getChildByName('reason').getComponent(cc.Label);
            
            var f = sn.getChildByName('fan');
            
            if(f != null){
                viewdata.fan = f.getComponent(cc.Label);    
            }
            
            viewdata.score = sn.getChildByName('score').getComponent(cc.Label);
            viewdata.hu = sn.getChildByName('hu');
            viewdata.mahjongs = sn.getChildByName('pai');
            viewdata.zhuang = sn.getChildByName('zhuang');
            viewdata.hupai = sn.getChildByName('hupai');
            viewdata.gangfen = sn.getChildByName("gang");
            viewdata._pengandgang = [];
            this._seats.push(viewdata);
        }
        
        

        //初始化网络事件监听器
        var self = this;
        this.node.on('game_over',function(data){
            
            self.onGameOver(data.detail);
        });
        this.node.on('hupaitype',function(data){ //胡动画
            //播放声音和动画
           // self.onGameOver(data.detail);
        });
        this.node.on('game_end',function(data){self._isGameEnd = true;});
        this._overAni.on('finished',  this.aniOver1,    this);
        this.huaTypeAni.on('finished',this.hutypeOver,this);
    },
    playAni:function(array)
    {
        this.initAni();
        this.playAniNode.active=true;
        for(var i in array)
        {
            this.playAniNode.getChildByName("tongyong"+i).active=true;
            this.playAniNode.getChildByName("tongyong"+i).getComponent(cc.Sprite).spriteFrame= cc.vv.mahjongmgr.getHuTypeSprite(array[i].key);
        }
		
        
		var audioUrl = cc.vv.mahjongmgr.getActionVoice();
		if(array.length==0)
		{
			if(this._isZimo==true)
			{
				cc.vv.audioMgr.playSFX(audioUrl+"zimo.mp3");
			}else{
				cc.vv.audioMgr.playSFX(audioUrl+"wohule.mp3");
			}
			this.hutypeOver();
			
		}else{
        var length=array.length-1;
        cc.vv.audioMgr.playSFX(audioUrl+array[length].value+".mp3");
        this.huaTypeAni.play("TongYong");
		}
    },
    initAni:function()
    {
        for(var i ;i<this.playAniNode.children.length;++i)
        {
            this.playAniNode.getChildByName("tongyong"+i).active=false;
        }
    },
    playAnimation:function(target,num,musicName)
    {  
        this.playAniNode.active=true;
        this.playAniNode.getChildByName("tongyong").getComponent(cc.Sprite).spriteFrame= cc.vv.mahjongmgr.getHuTypeSprite(num);
        var audioUrl = cc.vv.mahjongmgr.getActionVoice();
        cc.vv.audioMgr.playSFX(audioUrl+musicName+".mp3");

        var mov=cc.moveTo(5,cc.p(0, 0));
        var sca=cc.scaleTo(5,0);
        var callBack=cc.callFunc(function(target)
        {
            //动画播放结束，移除自己
            target.runAction(cc.removeSelf());
        },target);
        var spawn= cc.spawn(mov,sca);
        var seque=cc.cc.sequence(spawn,callBack);
        target.runAction(seque);

    },
    aniOver1:function(){
        cc.log("动画播放结束");
        this._gameover.active = true;
        cc.find("Canvas/prepare").active=true;
        cc.find("Canvas/game").active=false;
        cc.find("Canvas/Maima").active=false;
    },
    hutypeOver:function () {
        
        //胡动画播放结束，播放码动画
         if(cc.vv.gameNetMgr.getMaiMa()==0)
        {
            this.scheduleOnce(this.setgameover,3);//没有买马，
        }else{
            if(cc.vv.gameNetMgr.getMaiMa()==1&&this._isZimo==false)//自摸买马是别人放炮
            {
                this.scheduleOnce(this.setgameover,3)
            }else if(cc.vv.gameNetMgr.getMaiMa()==2&&this._isLiangdao==false&&this._isZimo==false)//亮倒自摸买吗没有亮倒
            {
                this.scheduleOnce(this.setgameover,3)
            }else if(this.maiMacardi<0) //选码没有中码
            {
                this.scheduleOnce(this.setgameover,4);//没有中马，
            }else{
                this.scheduleOnce(this.daipai,5); //选码中马
            }       
        }
    },
    daipai:function(dt){
        this.playAniNode.active=false;
         cc.find("Canvas/Maima").active=true;
        this._overAni.play("maima");
    },
    setgameover:function()
    {
        this.playAniNode.active=false;
        this._gameover.active = true;
        this._over_Ma.active=false;
    },
    
    onGameOver:function(data){
        console.log("data[0].maimapai 118 "+data[0].maimapai);
        //得到当前的选马模式
            cc.find("Canvas/Maima/MJ_BG/MJ_ID").getComponent(cc.Sprite).spriteFrame
            =cc.vv.mahjongmgr.getSpriteFrameByMJID1(data[0].maimapai);

        console.log("onGameOver");
        this._gameover.active = false;
        this.onGameOver_XZDD(data);
        /*
        if(cc.vv.gameNetMgr.conf.type == "xzdd"){
            this.onGameOver_XZDD(data);
        }
        else{
            this.onGameOver_XLCH(data);
        }*/
    },
    gametype:function()
    {
        var array=this._diquType.children;
        for(var i=0;i<array.length;++i){
            if(i==cc.vv.gameNetMgr.getDiQuType()-1)
            {
                this._diquType.children[i].active=true;
            }else
            this._diquType.children[i].active=false;
        }
    },
    onGameOver_XZDD(data1){
        console.log(data1);
        if(data1.length == 0){
            this._gameresult.active = true;
            return;
        }
        var testDate=new Date();
       // this._gameover.active = true;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;

        this.gametype();
        this._over_time.getComponent(cc.Label).string=testDate.toLocaleString();
        this._over_jushu.getComponent(cc.Label).string="局数:"+" "+cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames;
        this._over_roomId.getComponent(cc.Label).string="房间号:"+" "+cc.vv.gameNetMgr.roomId;
        // this._mafen.string="码分:"+
        var myscore = data1[cc.vv.gameNetMgr.seatIndex].score;
        if(myscore > 0){
            this._win.active = true;
        }         
        else if(myscore < 0){
            this._lose.active = true;
        }
        else{
            this._pingju.active = true;
        }
        
            
        //显示玩家信息
        for(var i = 0; i < 3; ++i){ 
            var seatView = this._seats[i];
            var userData = data1[i];
            this.maiMacard=data1[i].maimapai;
            var hued = false;
            //胡牌的玩家才显示 是否清一色 根xn的字样
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            var numOfGen = userData.numofgen;
            var actionArr = [];
            var numberArr = [];
            var is7pairs = false;
            var ischadajiao = false;
            var seats=cc.vv.gameNetMgr.seats;
            seatView.piaoscore;//结算完的漂分
            
            for(var j = 0; j < userData.actions.length; ++j){
                var ac = userData.actions[j];
                if(ac.type == "zimo" || ac.type == "ganghua" || ac.type == "dianganghua" || ac.type == "hu" || ac.type == "gangpaohu" || ac.type == "qiangganghu" || ac.type == "chadajiao"){
                    if(userData.pattern == "7pairs"){
                        actionArr.push("七对");
                        var data={key:3,value:"qidui"}
                        numberArr.push(data); 

                    }
                    else if(userData.pattern == "l7pairs"){
                        actionArr.push("龙七对");
                        var data={key:4,value:"haohuaqidui"}
                        numberArr.push(data); 
                    }
                    else if(userData.pattern == "AnSiGui"){
                        actionArr.push("暗四归");
                        var data={key:11,value:"ansigui"}
                        numberArr.push(data);
                    }
                    else if(userData.pattern == "MingSiGui"){
                        actionArr.push("明四归");
                        var data={key:10,value:"mingsigui"}
                        numberArr.push(data);
                    }
                    else if(userData.pattern == "DaSanYuan"){
                        actionArr.push("大三元");
                        var data={key:9,value:"dasanyuan"}
                        numberArr.push(data);
                    }
                    else if(userData.pattern == "XiaoSanYuan"){
                        actionArr.push("小三元");
                        var data={key:8,value:"xiaosanyuan"}
                        numberArr.push(data);
                    }
                    else if(userData.pattern == "duidui"){
                        actionArr.push("碰碰胡");
                        var data={key:2,value:"pengpenghu"}
                        numberArr.push(data);
                    }
                
                    
                    if(ac.type == "zimo"){
                        actionArr.push("自摸");
                        this._isZimo=true;
                    }
                    else if(ac.type == "ganghua"){
                        actionArr.push("杠上花");
                        var data={key:14,value:"gangkaihua"}
                        numberArr.push(data);
                    }
                    else if(ac.type == "dianganghua"){
                        //actionArr.push("亮倒自摸买码");
                    }
                    else if(ac.type == "gangpaohu"){
                        actionArr.push("杠上炮");
                    }
                    else if(ac.type == "qiangganghu"){
                        actionArr.push("抢杠胡");
                        var data={key:15,value:"qiangganghu"}
                        numberArr.push(data);
                    }
                    else if(ac.type == "chadajiao"){
                        //ischadajiao = true;
                    }
                    hued = true;
                }
                else if(ac.type == "fangpao"){
                    actionArr.push("放炮");
                }
                else if(ac.type == "angang"){
                    actionArr.push("暗杠");
                }
                else if(ac.type == "diangang"){
                    actionArr.push("明杠");
                }
                else if(ac.type == "wangang"){
                    actionArr.push("续杠");
                }
                else if(ac.type == "fanggang"){
                   actionArr.push("放杠");
                }
                else if(ac.type == "zhuanshougang"){
                    //actionArr.push("转手杠");
                }
                else if(ac.type == "beiqianggang"){
                    //actionArr.push("被抢杠");
                }
            }
            if(hued&&seats[i].liangDao)
            {
                this._isLiangdao=true;
            }
            if(hued){
                if(userData.qingyise){
                    actionArr.push("清一色");
                    var data={key:1,value:"qingyise"}
                    numberArr.push(data);
                }
                
                if(userData.menqing){
                    //actionArr.push("门清");
                }
                if(userData.zhongzhang){
                    //actionArr.push("中张");
                }
                if(userData.jingouhu){
                    actionArr.push("手抓一");
                    var data={key:12,value:"shouzhuayi"}
                    numberArr.push(data);
                }
                if(userData.KaWuXIng){
                    actionArr.push("卡五星");
                    var data={key:7,value:"kawuxing"}
                    numberArr.push(data);
                }        
                if(userData.haidihu){
                    actionArr.push("海底胡");
                    var data={key:20,value:"haidelao"}
                    numberArr.push(data);
                }
                
                if(userData.tianhu){
                   // actionArr.push("天胡");
                }
                
                if(userData.dihu){
                    //actionArr.push("地胡");
                }
            
                if(numOfGen > 0){
                   // actionArr.push("根x" + numOfGen); 
                }                
                
                if(ischadajiao){
                    //actionArr.push("查大叫");
                }
            }
            if(hued)
            {
                this.playAni(numberArr);
            }
            //for(var o = 0; o < 3;++o){
                seatView.hu.children[0].active = false;    
            //}
            if(userData.huorder >= 0){
                seatView.hu.children[0].active = true;    
            }

            seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
            seatView.zhuang.active = cc.vv.gameNetMgr.button == i;   
            //seatView.reason.string = "漂分 x"+userData[i].piao+"、";  
            if(seats[i].liangDao)
            {
                actionArr.push("亮倒");
            }
            actionArr.push("漂分 x"+userData.piao);
            seatView.reason.string = actionArr.join("、");
            
            if(this.maiMacard==-1||!cc.vv.gameNetMgr.getMaiMa()){
              this._over_Ma.active=false;
            }
            else{
              this._over_Ma.active=true;
              this._over_Ma.getChildByName("Sprite").getComponent(cc.Sprite).spriteFrame=
              cc.vv.mahjongmgr.getMahjongSpriteByID_ming("0",userData.maimapai);
              console.log("userData.maimapai 307 "+userData.maimapai);
            }
            //漂分
            if(seatView.fan > 0){
               seatView.fan.string = "+" + userData.piaoscore;    
                }
             else{
               seatView.fan.string = userData.piaoscore;
            }
            //杠分
            if(seatView.gangfen>0)
            {
               seatView.gangfen.getComponent(cc.Label).string="+"+userData.gangfen;
            }else{
               seatView.gangfen.getComponent(cc.Label).string=userData.gangfen;
            }
            //总分
            if(userData.score > 0){
               seatView.score.string = "+" + userData.score;    
            }
            else{
               seatView.score.string = userData.score;
            }
          
           
            
            var hupai = -1;
            if(hued){
                hupai = userData.holds.pop();
            }
            
            cc.vv.mahjongmgr.sortMJ(userData.holds,userData.dingque);
            
            //胡牌不参与排序
            if(hued){
                userData.holds.push(hupai);
            }
            
            //隐藏所有牌
            for(var k = 0; k < seatView.mahjongs.childrenCount; ++k){
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }
           
            var lackingNum = (userData.pengs.length + numOfGangs)*3; 
            //显示相关的牌

            for(var k = 0; k < userData.holds.length; ++k){
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                
                 //var sprite = n.getComponent(cc.Sprite);
                var spr1=n.getChildByName("Sprite");
                var spr2=spr1.getComponent(cc.Sprite);

                //var sprite = n.getChildByName("Sprite").getComponent(cc.Sprite);
                spr2.spriteFrame = cc.vv.mahjongmgr.gameOverBymahjongID(pai);
            }
            
            
            for(var k = 0; k < seatView._pengandgang.length; ++k){
                seatView._pengandgang[k].active = false;
            }
            
            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"angang");
                index++;    
            }
            
            var gangs = userData.diangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"diangang");
                index++;    
            }
            
            var gangs = userData.wangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"wangang");
                index++;    
            }
            
            //初始化碰牌
            var pengs = userData.pengs
            if(pengs){
                for(var k = 0; k < pengs.length; ++k){
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView,index,mjid,"peng");
                    index++;    
                }    
            }
        }
    },
    onGameOver_XLCH:function(data){
        console.log(data);
        if(data.length == 0){
            this._gameresult.active = true;
            return;
        }
        this._gameover.active = true;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;

        var game = this.node.getChildByName("game");
        var sideRoot = game.getChildByName(side);
        cc.find("Canvas/game/0/ting").active = false;       
        cc.find("Canvas/game/0/daopai").active = false;    
        cc.find("Canvas/game/1/daopai").active = false;  
        cc.find("Canvas/game/3/daopai").active = false;
          
        var myscore = data[cc.vv.gameNetMgr.seatIndex].score;

        var tmaiMaPai = cc.vv.gameNetMgr.maiMaPai;//买码
        
        if(myscore > 0){
            this._win.active = true;
        }         
        else if(myscore < 0){
            this._lose.active = true;
        }
        else{
            this._pingju.active = true;
        }
            
        //显示玩家信息
        for(var i = 0; i < 2; ++i){
            var seatView = this._seats[i];
            var userData = data[i];
            var hued = false;
            var actionArr = [];
            var is7pairs = false;
            var ischadajiao = false;
            var hupaiRoot = seatView.hupai;
            
            for(var j = 0; j < hupaiRoot.children.length; ++j){
                hupaiRoot.children[j].active = false;
            }
            
            var hi = 0;
            for(var j = 0; j < userData.huinfo.length; ++j){
                var info = userData.huinfo[j];
                hued = hued || info.ishupai;
                if(info.ishupai){
                    if(hi < hupaiRoot.children.length){
                        var hupaiView = hupaiRoot.children[hi]; 
                        hupaiView.active = true;
                        hupaiView.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_",info.pai);
                        hi++;   
                    }
                }
                
                var str = ""
                var sep = "";
                
                var dataseat = userData;
                if(!info.ishupai){
                    if(info.action == "fangpao"){
                        str = "放炮";
                    }
                    else if(info.action == "gangpao"){
                        str = "杠上炮";
                    }
                    else if(info.action == "beiqianggang"){
                        str = "被抢杠";
                    }
          
                    dataseat = data[info.target]; 
                    info = dataseat.huinfo[info.index];
                }
                else{
                    if(info.action == "hu"){
                        str = "接炮胡"
                    }
                    else if(info.action == "zimo"){
                        str = "自摸";
                    }
                    else if(info.action == "ganghua"){
                        str = "杠上花";
                    }
                    else if(info.action == "dianganghua"){
                        str = "亮倒自摸买码";
                    }
                    else if(info.action == "gangpaohu"){
                        str = "杠上炮";
                    }
                    else if(info.action == "qiangganghu"){
                        str = "抢杠胡";
                    }
                    else if(info.action == "chadajiao"){
                        //str = "查大叫";
                    }   
                }
                
                str += "(";
                
                if(info.pattern == "7pairs"){
                    str += "七对";
                    sep = "、"
                }
                else if(info.pattern == "l7pairs"){
                    str += "龙七对";
                    sep = "、"
                }
                else if(info.pattern == "j7pairs"){
                    //str += "将七对";
                    //sep = "、"
                }
                else if(info.pattern == "duidui"){
                    str += "碰碰胡";
                    sep = "、"
                }
                else if(info.pattern == "jiangdui"){
                    //str += "将对";
                    //sep = "、"
                }
                else if(info.pattern == "AnSiGui"){
                     str += "暗四归";
                     sep = "、"
                }
                else if(info.pattern == "MingSiGui"){
                    str += "明四归";
                    sep = "、"
                }
                else if(info.pattern == "KaWuXIng"){
                    str += "卡五星";
                    sep = "、"
                }
                else if(info.pattern == "DaSanYuan"){
                    str += "大三元";
                    sep = "、"
                }
                else if(info.pattern == "XiaoSanYuan"){
                    str += "小三元";
                    sep = "、"
                }


                if(info.haidihu){
                    str += sep + "海底胡";
                    sep = "、";
                }
                
                if(info.tianhu){
                    str += sep + "天胡";
                    sep = "、";
                }
                
                if(info.dihu){
                    //str += sep + "地胡";
                    //sep = "、";
                }
                
                if(dataseat.qingyise){
                    str += sep + "清一色";
                    sep = "、";
                }
                
                if(dataseat.menqing){
                    str += sep + "门清";
                    sep = "、";
                }
                
                if(dataseat.jingouhu){
                    str += sep + "手抓一";
                    sep = "、";
                }
                         
                if(dataseat.zhongzhang){
                    //str += sep + "中张";
                    //sep = "、";
                }
            
                if(info.numofgen > 0){
                    //str += sep + "根x" + info.numofgen;
                    //sep = "、"; 
                }
                
                if(sep == ""){
                    str += "平胡";
                }
                
                str += "、" + info.fan + "番";
                
                str += ")";
                actionArr.push(str);
            }
            
            seatView.hu.active = hued;
            
            if(userData.angangs.length){
                actionArr.push("暗杠x" + userData.angangs.length);
            }
            
            if(userData.diangangs.length){
                actionArr.push("明杠x" + userData.diangangs.length);
            }
            
            if(userData.wangangs.length){
                actionArr.push("续杠x" + userData.wangangs.length);
            }

            seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
            seatView.zhuang.active = cc.vv.gameNetMgr.button == i;
            seatView.reason.string = actionArr.join("、");
            
            //
            if(userData.score > 0){
                seatView.score.string = "+" + userData.score;    
            }
            else{
                seatView.score.string = userData.score;
            }
           
            //隐藏所有牌
            for(var k = 0; k < seatView.mahjongs.childrenCount; ++k){
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }
            
            cc.vv.mahjongmgr.sortMJ(userData.holds,userData.dingque);
            
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
           
            var lackingNum = (userData.pengs.length + numOfGangs)*3; 
            //显示相关的牌
            for(var k = 0; k < userData.holds.length; ++k){
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                //var sprite = n.getComponent(cc.Sprite);
                var spr1=n.getChildByName("Sprite");
                var spr2=spr1.getComponent(cc.Sprite);
                spr2.spriteFrame = cc.vv.mahjongmgr.getMahjongSpriteByID_ming("0",pai);
            }
            
            
            for(var k = 0; k < seatView._pengandgang.length; ++k){
                seatView._pengandgang[k].active = false;
            }
            
            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"angang");
                index++;    
            }
            
            var gangs = userData.diangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"diangang");
                index++;    
            }
            
            var gangs = userData.wangangs;
            for(var k = 0; k < gangs.length; ++k){
                var mjid = gangs[k];
                this.initPengAndGangs(seatView,index,mjid,"wangang");
                index++;    
            }
            
            //初始化碰牌
            var pengs = userData.pengs
            if(pengs){
                for(var k = 0; k < pengs.length; ++k){
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView,index,mjid,"peng");
                    index++;    
                }    
            }

            pengs.length=[];
            diangangs.length=[];
            angangs.length=[];
            wangangs.length=[];
        }
    },
    
    initPengAndGangs:function(seatView,index,mjid,flag){
        var pgroot = null;
        if(seatView._pengandgang.length <= index){
            pgroot = cc.instantiate(cc.vv.mahjongmgr.pengPrefabSelf);
            seatView._pengandgang.push(pgroot);
            seatView.mahjongs.addChild(pgroot); 
            pgroot.active = true;   
        }
        else{
            pgroot = seatView._pengandgang[index];
            pgroot.active = true;
        }
        
            pgroot.setScale(0.9);
       // var sprites = pgroot.getComponentsInChildren(cc.Sprite);
            var sprites = pgroot.children;

        for(var s = 0; s < sprites.length; ++s){
            var sprite = sprites[s];
            if(sprite.name == "gang"){
                var isGang = flag != "peng";
                sprite.active = isGang;
                //sprite.scaleX = 1.0;
                //sprite.scaleY = 1.0;
                if(flag == "angang"){
                    sprite.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame("0");
                   sprite.getChildByName("Sprite").active=false;
                    //sprite.scaleX = 1.4;
                    //sprite.scaleY = 1.4;                        
                }   
                else{
                    sprite.getChildByName("Sprite").getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getPengGangSpriteByID("0",mjid);    
                }
            }
            else{ 
                sprite.getChildByName("Sprite").getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getPengGangSpriteByID("0",mjid);
            }
        }
        pgroot.x = index * 78 * 3;
    },
    
    onBtnReadyClicked:function(){
        console.log("onBtnReadyClicked");
        if(this._isGameEnd){
            this._gameresult.active = true;
        }
        else{
            
            cc.vv.net.send('ready');  
            var data={
                id:0
            }
            cc.vv.http.sendRequest("/get_user_slyder_count_openroom",data);
        }
        this._gameover.active = false;
		//如果游戏结束，影藏界面
		cc.find("Canvas/prepare").active=true;
		cc.find("Canvas/game").active=false;
    },
    
    onBtnShareClicked:function(){
        console.log("onBtnShareClicked");
    }

  
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
