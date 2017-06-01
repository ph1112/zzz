cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler:null,
        roomId:null,
        maxNumOfGames:0,
        numOfGames:0,
        numOfMJ:0,
        seatIndex:-1,
        creator:null, //房间的创建人,
        room_create_type:null, //创建的房间类型 0 为自己创建的  ，1 为其他人创建的
        
        seats:null,  //座位数据，GameNetMgr中存数据
        turn:-1,
        button:-1,
        dingque:-1,
        chupai:-1,
        maiMaPai:0,
        isDingQueing:false,
        isHuanSanZhang:false,
        gamestate:"",
        isOver:false,
        dissoveData:null,
        isTingTiShi:false,
        // foo: {
        //  重连标志
        game_sync_bool:false,
        isconnected:false,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },
    
    reset:function(){
        this.turn = -1;
        this.chupai = -1,
        this.dingque = -1;
        this.button = -1;
        this.gamestate = "";
        this.dingque = -1;
        this.maiMaPai = 0;
        this.isDingQueing = false;
        this.isHuanSanZhang = false;
        this.curaction = null;
        this.isTingTiShi=false;
        
        for(var i = 0; i < this.seats.length; ++i){
            this.seats[i].holds = [];
            this.seats[i].koudao = [];
            this.seats[i].folds = [];
            this.seats[i].pengs = [];
            this.seats[i].angangs = [];
            this.seats[i].diangangs = [];
            this.seats[i].wangangs = [];
            this.seats[i].dingque = -1;
            this.seats[i].ready = false;
            this.seats[i].hued = false;
            this.seats[i].liangDao=false;
            this.seats[i].huanpais = null;
            this.seats[i].tingMap=[];
            this.seats[i].daopai=[];
            this.huanpaimethod = -1;
        }
    },
    
    clear:function(){
        this.dataEventHandler = null;
        if(this.isOver == null){
            this.seats = null;
            this.roomId = null;
            this.creator = null;
            this.room_create_type = null;
            this.maxNumOfGames = 0;
            this.numOfGames = 0;        
        }
    },
    
    dispatchEvent(event,data){
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        }    
    },
    
    getSeatIndexByID:function(userId){
        for(var i = 0; i < this.seats.length; ++i){
            var s = this.seats[i];
            if(s.userid == userId){
                return i;
            }
        }
        return -1;
    },
    
    isOwner:function(){
        //return this.seatIndex == 0; 
        return this.creator == cc.vv.userMgr.userId;  
    },

    isCreatedForOther:function(){
        //return this.seatIndex == 0; 
        return this.room_create_type == 1;  
    },
    
    getSeatByID:function(userId){
        var seatIndex = this.getSeatIndexByID(userId);
        var seat = this.seats[seatIndex];
        return seat;
    },
    
    getSelfData:function(){
        return this.seats[this.seatIndex];
    },
    
    getLocalIndex:function(index){
        var ret = (index - this.seatIndex + 3) % 3;
        return ret;
    },
    
    prepareReplay:function(roomInfo,detailOfGame){
        this.roomId = roomInfo.id;
        this.seats = roomInfo.seats;
        this.turn = detailOfGame.base_info.button;
        var baseInfo = detailOfGame.base_info;
        for(var i = 0; i < this.seats.length; ++i){
            var s = this.seats[i];
            s.seatindex = i;
            s.score = null;
            s.holds = baseInfo.game_seats[i];
            s.pengs = [];
            s.angangs = [];
            s.diangangs = [];
            s.wangangs = [];
            s.folds = [];
            s.koudao = [];
            console.log(s);
            if(cc.vv.userMgr.userId == s.userid){
                this.seatIndex = i;
            }
        }
        this.conf = {
            type:baseInfo.type,
        }
        if(this.conf.type == null){
            this.conf.type == "xzdd";
        }
    },
    getMaiMa:function()
    {
         var conf = this.conf;
        if(conf && conf.maxGames!=null && conf.maxFan!=null){           
             return  conf.menqing;          
        }
        return 0;
    },
    getDiQuType:function()
    {
         var conf = this.conf;
        if(conf && conf.maxGames!=null && conf.maxFan!=null){           
             return  conf.zimo;          
        }
        return 1;
    },
    getWanfa:function(){
        var conf = this.conf;
        if(conf && conf.maxGames!=null && conf.maxFan!=null){
            var strArr = [];
            if(conf.zimo==1){
                strArr.push("襄阳玩法");   
            }else if(conf.zimo==2)
            {
                strArr.push("随州玩法");  
            }else if(conf.zimo==3)
            {
                strArr.push("十堰玩法");  
            }else if(conf.zimo==4)
            {
                  strArr.push("孝感玩法");
            }
            strArr.push(conf.maxGames + "局");
            strArr.push(conf.maxFan + "倍封顶");
            //strArr.push(conf.baseScore+"分");
             if(conf.jiangdui==1){
                strArr.push("半频道");   
            }
            else{
                    strArr.push("全频道");  
            }
            
            if(conf.menqing == 0){
                strArr.push("不买马");
            }else if(conf.menqing == 1)
            {
                strArr.push("自摸买马");
            }
            else{
                strArr.push("亮倒自摸买马");
            }
           if(conf.hsz){
               strArr.push("数坎");   
            }
            if(conf.dianganghua == 1){
               // strArr.push("自摸买码");   
            }
            else{
               // strArr.push("亮倒自摸买码");
            }
            
            if(conf.tiandihu){
                strArr.push("少于12张不可明");   
            }
            return strArr.join(" ");
        }
        return "";
    },
    
    initHandlers:function(){
        var self = this;
        cc.vv.net.addHandler("login_result",function(data){
             console.log("login_result");
            console.log(data);
            if(data.errcode === 0){
                var data = data.data;
                self.roomId = data.roomid;
                self.conf = data.conf;
                self.maxNumOfGames = data.conf.maxGames;
                self.numOfGames = data.numofgames;
                self.seats = data.seats;
                console.log("seats",data.seats);
                self.seatIndex = self.getSeatIndexByID(cc.vv.userMgr.userId);
                console.log(self.seatIndex);
                self.isOver = false;
            }
            else{
                console.log(data.errmsg);   
            }
        });
                
        cc.vv.net.addHandler("login_finished",function(data){
            console.log("login_finished");
            cc.director.loadScene("mjgame");
        });

        cc.vv.net.addHandler("exit_result",function(data){
            console.log("exit_result");
            self.roomId = null;
            self.turn = -1;
            self.dingque = -1;
            self.isDingQueing = false;
            self.seats = null;
        });
        
        cc.vv.net.addHandler("exit_notify_push",function(data){
            console.log("exit_notify_push");
           var userId = data;
           var s = self.getSeatByID(userId);
           if(s != null){
               s.userid = 0;
               s.name = "";
               self.dispatchEvent("user_state_changed",s);
           }
        });
        
        cc.vv.net.addHandler("dispress_push",function(data){
            console.log("dispress_push");
            self.roomId = null;
            self.turn = -1;
            self.dingque = -1;
            self.isDingQueing = false;
            self.seats = null;
        });
                
        cc.vv.net.addHandler("disconnect",function(data){
            console.log("disconnect");
            if(self.roomId == null){
                cc.director.loadScene("hall");
            }
            else{
                if(self.isOver == false){
                    cc.vv.userMgr.oldRoomId = self.roomId;
                    self.dispatchEvent("disconnect");                    
                }
                else{
                    self.roomId = null;
                }
            }
        });
        
        cc.vv.net.addHandler("new_user_comes_push",function(data){
            //console.log(data);
            console.log("new_user_comes_push");
            var seatIndex = data.seatindex;
            if(self.seats[seatIndex].userid > 0){
                self.seats[seatIndex].online = true;
            }
            else{
                data.online = true;
                self.seats[seatIndex] = data;
            }
            self.dispatchEvent('new_user',self.seats[seatIndex]);
        });
        
        cc.vv.net.addHandler("user_state_push",function(data){
            //console.log(data);
            console.log("user_state_push");
            var userId = data.userid;
            var seat = self.getSeatByID(userId);
            seat.online = data.online;
            self.dispatchEvent('user_state_changed',seat);
        });
        
        cc.vv.net.addHandler("user_ready_push",function(data){
            console.log("user_ready_push");
            //console.log(data);
            var userId = data.userid;
            var seat = self.getSeatByID(userId);
            //seat.ready = data.ready;
            self.dispatchEvent('user_state_changed',seat);
        });
        //服务器推送玩家的手牌
        cc.vv.net.addHandler("game_holds_push",function(data){
             console.log("game_holds_push");
            var seat = self.seats[self.seatIndex]; 
            console.log(data);
            seat.holds = data;
            
            for(var i = 0; i < self.seats.length; ++i){
                var s = self.seats[i]; 
                if(s.folds == null){
                    s.folds = [];
                }
                if(s.pengs == null){
                    s.pengs = [];
                }
                if(s.koudao == null){
                    s.koudao = [];
                }
                if(s.angangs == null){
                    s.angangs = [];
                }
                if(s.diangangs == null){
                    s.diangangs = [];
                }
                if(s.wangangs == null){
                    s.wangangs = [];
                }
                s.ready = false;
            }
            self.dispatchEvent('game_holds');
        });
         
        cc.vv.net.addHandler("game_begin_push",function(data){
            console.log("game_begin_push");
            console.log(data);
            self.button = data;
            self.turn = self.button;
            self.gamestate = "begin";
            self.dispatchEvent('game_begin');
        });
        
        cc.vv.net.addHandler("game_playing_push",function(data){
            console.log('game_playing_push'); 
            self.gamestate = "playing"; 
            self.dispatchEvent('game_playing');
        });
        
        cc.vv.net.addHandler("game_sync_push",function(data){
            console.log("game_sync_push");
            console.log(data);
            //将重连状态设置为 true；
            self.game_sync_bool = true;
            self.numOfMJ = data.numofmj;
            self.gamestate = data.state;
            if(self.gamestate == "dingque"){
                self.isDingQueing = true;
            }
            else if(self.gamestate == "huanpai"){
                self.isHuanSanZhang = true;
            }
            self.turn = data.turn;
            self.button = data.button;
            self.chupai = data.chuPai;
            self.huanpaimethod = data.huanpaimethod;
            for(var i = 0; i < 3; ++i){
                var seat = self.seats[i];
                var sd = data.seats[i];
                seat.holds = sd.holds;
                seat.folds = sd.folds;
                seat.angangs = sd.angangs;
                seat.diangangs = sd.diangangs;
                seat.wangangs = sd.wangangs;
                seat.pengs = sd.pengs;
                seat.dingque = sd.que;
                seat.hued = sd.hued; 
                seat.iszimo = sd.iszimo;
                seat.huinfo = sd.huinfo;
                seat.huanpais = sd.huanpais;
                seat.liangDao = sd.liangDao;
                seat.koudao = [];
                if(i == self.seatIndex){
                    self.dingque = sd.que;
                }
           }

        });
        
        cc.vv.net.addHandler("game_dingque_push",function(data){
            console.log("game_dingque_push");
            self.isDingQueing = true;
            self.isHuanSanZhang = false;
            self.dispatchEvent('game_dingque');
        });
        
        cc.vv.net.addHandler("game_huanpai_push",function(data){
            self.isHuanSanZhang = true;
            self.dispatchEvent('game_huanpai');
        });
        
        cc.vv.net.addHandler("hangang_notify_push",function(data){
            console.log("hangang_notify_push");
            self.dispatchEvent('hangang_notify',data);
        });
        
        cc.vv.net.addHandler("game_action_push",function(data){
            console.log("game_action_push");
            self.curaction = data;
            console.log(data);
            self.dispatchEvent('game_action',data);
        });
        
        cc.vv.net.addHandler("game_chupai_push",function(data){
            console.log('game_chupai_push');
            console.log(data);
            var turnUserID = data;
            var si = self.getSeatIndexByID(turnUserID);
            self.doTurnChange(si);
        });
        
        cc.vv.net.addHandler("game_num_push",function(data){
            console.log("game_num_push");
            self.numOfGames = data;
            self.dispatchEvent('game_num',data);
        });
        cc.vv.net.addHandler("game_over_push",function(data){
            console.log('game_over_push');
            var results = data.results;
            for(var i = 0; i <  self.seats.length; ++i){
                self.seats[i].score = results.length == 0? 0:results[i].totalscore;
            }
            for(var i = 0; i <  self.seats.length; ++i){
                self.seats[i].piaoscore = results.length == 0? 0:results[i].piaoscore;
            }//漂分
            self.dispatchEvent('game_over',results);
            if(data.endinfo){
                self.isOver = true;
                self.roomId = null;
                self.dispatchEvent('game_end',data.endinfo);    
            }
            self.reset();
            for(var i = 0; i <  self.seats.length; ++i){
                self.dispatchEvent('user_state_changed',self.seats[i]);    
            }
        });
        
        cc.vv.net.addHandler("mj_count_push",function(data){
            console.log('mj_count_push');
            self.numOfMJ = data;
            self.dispatchEvent('mj_count',data);
        });
        
        cc.vv.net.addHandler("hu_push",function(data){
            console.log('hu_push');
            self.doHu(data);
        });
        
        cc.vv.net.addHandler("game_hu_type_push",function(data){
            
            self.doHuType(data);
        });

        cc.vv.net.addHandler("game_chupai_notify_push",function(data){
            console.log("game_chupai_notify_push");
            var userId = data.userId;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doChupai(si,pai);
        });      

        cc.vv.net.addHandler("game_holds_notify_push",function(data){
            console.log("game_holds_notify_push");
            var userId = data.userId;
            var holds = data.holds;
            var si = self.getSeatIndexByID(userId);
            self.downHoldsData(si,holds);
        });

        cc.vv.net.addHandler("game_mopai_push",function(data){
            console.log('game_mopai_push',data);
            self.doMopai(self.seatIndex,data);
        });
        
        cc.vv.net.addHandler("guo_notify_push",function(data){
            console.log('guo_notify_push');
            var userId = data.userId;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doGuo(si,pai);
        });
   
        cc.vv.net.addHandler("guo_result",function(data){
            console.log('guo_result');
            self.dispatchEvent('guo_result');
        });
        
        cc.vv.net.addHandler("guohu_push",function(data){
            console.log('guohu_push');
            self.dispatchEvent("push_notice",{info:"过胡",time:1.5});
        });
        
        cc.vv.net.addHandler("huanpai_notify",function(data){
            var seat = self.getSeatByID(data.si);
            seat.huanpais = data.huanpais;
            self.dispatchEvent('huanpai_notify',seat);
        });
        
        cc.vv.net.addHandler("game_huanpai_over_push",function(data){
            console.log('game_huanpai_over_push');
            var info = "";
            var method = data.method;
            if(method == 0){
                info = "换对家牌";
            }
            else if(method == 1){
                info = "换下家牌";
            }
            else{
                info = "换上家牌";
            }
            self.huanpaimethod = method;
            cc.vv.gameNetMgr.isHuanSanZhang = false;
            self.dispatchEvent("game_huanpai_over");
            self.dispatchEvent("push_notice",{info:info,time:2});
        });
        
        cc.vv.net.addHandler("peng_notify_push",function(data){
            console.log('peng_notify_push');
            console.log(data);
            var userId = data.userid;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doPeng(si,data.pai);
        });
        
        cc.vv.net.addHandler("gang_notify_push",function(data){
            console.log('gang_notify_push');
            var userId = data.userid;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doGang(si,pai,data.gangtype);
        });
        
        cc.vv.net.addHandler("game_dingque_notify_push",function(data){
            self.dispatchEvent('game_dingque_notify',data);
        });

        cc.vv.net.addHandler("ting_notify_push",function(data){    
            var seatdata=self.seats[data.seatindex];
            if(data.holds){
                seatdata.holds = data.holds;
            }
            if(data.index){
                seatdata.koudao = {index:data.index};
            }
            seatdata.liangDao=true;
            self.dispatchEvent('game_LiangDao_notify',seatdata);    
        });
        
        cc.vv.net.addHandler("game_dingque_finish_push",function(data){
            for(var i = 0; i < data.length; ++i){
                self.seats[i].dingque = data[i];
            }
            self.dispatchEvent('game_dingque_finish',data);
        });
        
        
        cc.vv.net.addHandler("chat_push",function(data){
            self.dispatchEvent("chat_push",data);    
        });
        
        cc.vv.net.addHandler("quick_chat_push",function(data){
            self.dispatchEvent("quick_chat_push",data);
        });
        
        cc.vv.net.addHandler("emoji_push",function(data){
            self.dispatchEvent("emoji_push",data);
        });
        
        cc.vv.net.addHandler("dissolve_notice_push",function(data){
            console.log("dissolve_notice_push"); 
            console.log(data);
            self.dissoveData = data;
            self.dispatchEvent("dissolve_notice",data);
        });
        
        cc.vv.net.addHandler("dissolve_cancel_push",function(data){
            self.dissoveData = null;
            self.dispatchEvent("dissolve_cancel",data);
        });
        
        cc.vv.net.addHandler("voice_msg_push",function(data){
            self.dispatchEvent("voice_msg",data);
        });
    },
    
    doGuo:function(seatIndex,pai){
        var seatData = this.seats[seatIndex];
        var folds = seatData.folds;
        folds.push(pai);
        this.dispatchEvent('guo_notify',seatData);    
    },
    
    doMopai:function(seatIndex,pai){
        var seatData = this.seats[seatIndex];
        if(seatData.holds){
            console.log(" doMopai:function pai "+pai);
            seatData.holds.push(pai);
            this.dispatchEvent('game_mopai',{seatIndex:seatIndex,pai:pai});            
        }
    },
    doChupai:function(seatIndex,pai){
        this.chupai = pai;
        var seatData = this.seats[seatIndex];
        if(seatData.holds){             
            var idx = seatData.holds.indexOf(pai);
            seatData.holds.splice(idx,1);
        }
        this.dispatchEvent('game_chupai_notify',{seatData:seatData,pai:pai});    
    },

    downHoldsData:function(seatIndex,hold){
       console.log("seatIndex "+seatIndex);
       console.log("this.seats[seatIndex] "+this.seats[seatIndex]);
        var seatData = this.seats[seatIndex];
        seatData.holds=hold;
    },

    doPeng:function(seatIndex,pai){
        var seatData = this.seats[seatIndex];
        //移除手牌
        if(seatData.holds){
            for(var i = 0; i < 2; ++i){
                var idx = seatData.holds.indexOf(pai);
                seatData.holds.splice(idx,1);
            }                
        }
            
        //更新碰牌数据
        var pengs = seatData.pengs;
        pengs.push(pai);
            
        this.dispatchEvent('peng_notify',seatData);
    },
    
    getGangType:function(seatData,pai){
        if(seatData.pengs.indexOf(pai) != -1){
            return "wangang";
        }
        else{
            var cnt = 0;
            for(var i = 0; i < seatData.holds.length; ++i){
                if(seatData.holds[i] == pai){
                    cnt++;
                }
            }
            if(cnt == 3){
                return "diangang";
            }
            else{
                return "angang";
            }
        }
    },
    
    doGang:function(seatIndex,pai,gangtype){
        var seatData = this.seats[seatIndex];
        
        if(!gangtype){
            gangtype = this.getGangType(seatData,pai);
        }
        
        if(gangtype == "wangang"){
            if(seatData.pengs.indexOf(pai) != -1){
                var idx = seatData.pengs.indexOf(pai);
                if(idx != -1){
                    seatData.pengs.splice(idx,1);
                }
            }
            seatData.wangangs.push(pai);      
        }
        if(seatData.holds){
            for(var i = 0; i <= 4; ++i){
                var idx = seatData.holds.indexOf(pai);
                if(idx == -1){
                    //如果没有找到，表示移完了，直接跳出循环
                    break;
                }
                seatData.holds.splice(idx,1);
            }
        }
        if(gangtype == "angang"){
            seatData.angangs.push(pai);
        }
        else if(gangtype == "diangang"){
            seatData.diangangs.push(pai);
    
        }
        this.dispatchEvent('gang_notify',{seatData:seatData,gangtype:gangtype});
    },
  
    doHu:function(data){
        this.dispatchEvent('hupai',data);
    },
    
     doHuType:function(data){
        this.dispatchEvent('hupaitype',data);
    },

    doTurnChange:function(si){
        var data = {
            last:this.turn,
            turn:si,
        }
        this.turn = si;
        this.dispatchEvent('game_chupai',data);
    },
    
    connectGameServer:function(data){
        this.dissoveData = null;
        cc.vv.net.ip = data.ip + ":" + data.port;
        console.log(cc.vv.net.ip);
        var self = this;

        var onConnectOK = function(){
            console.log("onConnectOK");
            var sd = {
                token:data.token,
                roomid:data.roomid,
                time:data.time,
                sign:data.sign,
            };
            cc.vv.net.send("login",sd);

            self.isconnected = true;
            self.creator = data.creator;
            self.room_create_type = data.room_create_type;
        };
        
        var onConnectFailed = function(){
            console.log("failed.");
            cc.vv.wc.hide();
        };
        cc.vv.wc.show("正在进入房间");
        cc.vv.net.connect(onConnectOK,onConnectFailed);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
