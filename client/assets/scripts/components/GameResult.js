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
        _gameresult:null,
        _seats:[],
        _over_time:null,
        _over_jushu:null,
        _over_roomId:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.vv == null){
            return;
        }
        
        this._gameresult = this.node.getChildByName("game_result");
        //this._gameresult.active = false;
        this._over_time=this._gameresult.getChildByName("over_time");
        this._over_jushu=this._gameresult.getChildByName("over_jushu");
        this._over_roomId=this._gameresult.getChildByName("over_roomId");
        this._diquType=this._gameresult.getChildByName("typeNode");//地区
        this._lijuan=this._gameresult.getChildByName("songliejuan").getChildByName("songlijuan");
        var seats = this._gameresult.getChildByName("seats");
        for(var i = 0; i < seats.children.length; ++i){
            this._seats.push(seats.children[i].getComponent("Seat"));   
        }
        
        var btnClose = cc.find("Canvas/game_result/btnClose");
        if(btnClose){
            cc.vv.utils.addClickEvent(btnClose,this.node,"GameResult","onBtnCloseClicked");
        }
        
        var btnShare = cc.find("Canvas/game_result/btnShare");
        if(btnShare){
            cc.vv.utils.addClickEvent(btnShare,this.node,"GameResult","onBtnShareClicked");
        }
        
        //初始化网络事件监听器
        var self = this;
        this.node.on('game_end',function(data){self.onGameEnd(data.detail);});
    },
    
    showResult:function(seat,info,isZuiJiaPaoShou){
        seat.node.getChildByName("zuijiapaoshou").active = isZuiJiaPaoShou;
        
        seat.node.getChildByName("zimocishu").getComponent(cc.Label).string = info.numzimo;
        seat.node.getChildByName("jiepaocishu").getComponent(cc.Label).string = info.numjiepao;
        seat.node.getChildByName("dianpaocishu").getComponent(cc.Label).string = info.numdianpao;
        seat.node.getChildByName("angangcishu").getComponent(cc.Label).string = info.numangang;
        seat.node.getChildByName("minggangcishu").getComponent(cc.Label).string = info.numminggang;
        seat.node.getChildByName("chajiaocishu").getComponent(cc.Label).string = info.numchadajiao;
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
    onGameEnd:function(endinfo){
        var seats = cc.vv.gameNetMgr.seats;
        var maxscore = -1;
        var maxdianpao = 0;
        var dianpaogaoshou = -1;
        //显示时间，房间号，局数
        var testDate=new Date();
          this.gametype();

        var self=this;
        var onGet = function(ret){        
            console.log(ret.addcoins);
             self._lijuan.getComponent(cc.Label).string=ret.addcoins;        
        };

        //礼卷
        if(cc.vv.gameNetMgr.numOfGames == cc.vv.gameNetMgr.maxNumOfGames){
           cc.vv.http.sendRequest("/set_add_gameover_lijuan",{token:cc.vv.userMgr.token},onGet);
        }


         
        this._over_time.getComponent(cc.Label).string=testDate.toLocaleString();
       this._over_jushu.getComponent(cc.Label).string="局数:"+" "+cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames;
        this._over_roomId.getComponent(cc.Label).string="房间号:"+" "+cc.vv.gameNetMgr.roomId;

        for(var i = 0; i < seats.length; ++i){
            var seat = seats[i];
            if(seat.score > maxscore){
                maxscore = seat.score;
            }
            if(endinfo[i].numdianpao > maxdianpao){
                maxdianpao = endinfo[i].numdianpao;
                dianpaogaoshou = i;
            }
        }
        
        for(var i = 0; i < seats.length; ++i){
            var seat = seats[i];
            var isBigwin = false;
            if(seat.score > 0){
                isBigwin = seat.score == maxscore;
            }
            this._seats[i].setInfo(seat.name,seat.score, isBigwin);
            this._seats[i].setID(seat.userid);
            var isZuiJiaPaoShou = dianpaogaoshou == i;
            this.showResult(this._seats[i],endinfo[i],isZuiJiaPaoShou);
        }
    },
    
    onBtnCloseClicked:function(){
        cc.vv.userMgr.getCoins();
        cc.director.loadScene("hall");
    },
    
    onBtnShareClicked:function(){
        cc.vv.anysdkMgr.shareResult();
    }
});
