cc.Class({
    extends: cc.Component,

    properties: {
        lblRoomNo: {
            default: null,
            type: cc.Label

        },
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _seats: [],
        _seats2: [],
        _timeLabel: null,
        _voiceMsgQueue: [],
        _lastPlayingSeat: null,
        _playingSeat: null,
        _lastPlayTime: null,
        //xuanPiao:{default:null,type:cc.Node}
    },

    // use this for initialization
    onLoad: function () {
        if (cc.vv == null) {
            return;
        }

        this.initView();
        this.initSeats();
        this.initEventHandlers();
    },

    addClickEvent: function (node, target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },

    initView: function () {
        var prepare = this.node.getChildByName("prepare");
        var seats = prepare.getChildByName("seats");
        for (var i = 0; i < seats.children.length; ++i) {
            this._seats.push(seats.children[i].getComponent("Seat"));
        }
        var xuanPiao = cc.find("Canvas/prepare/XuanPiao");
        if (cc.vv.gameNetMgr.numOfGames == 1) {
            //xuanPiao.active=true;//gameChild.getChildByName("XuanPiao");
        }
        else {
            //xuanPiao.active=false;
        }

        this.refreshBtns();

        this.lblRoomNo = cc.find("Canvas/infobar/Z_room_txt").getComponent(cc.Label);
        this._timeLabel = cc.find("Canvas/infobar/time").getComponent(cc.Label);
        this.lblRoomNo.string = cc.vv.gameNetMgr.roomId;
        var gameChild = this.node.getChildByName("game");

        var tindex = ["0", "1", "2", "3"];
        for (var i = 0; i < tindex.length; ++i) {
            var sideNode = gameChild.getChildByName(tindex[i]);
            var seat = sideNode.getChildByName("seat");
            this._seats2.push(seat.getComponent("Seat"));
        }
        var sideNet = cc.vv.gameNetMgr.seats;
        var btnWechat = cc.find("Canvas/prepare/btnWeichat");
        if (btnWechat) {
            cc.vv.utils.addClickEvent(btnWechat, this.node, "MJRoom", "onBtnWeichatClicked");
        }


        var btnDispress = prepare.getChildByName("btnDissolve");
        this.addClickEvent(btnDispress, this.node, "MJRoom", "onBtnDissolveClicked");
        var btnExit = prepare.getChildByName("btnExit");
        this.addClickEvent(btnExit, this.node, "MJRoom", "onBtnExit");
        var btnQuit = this.node.getChildByName("btn_tuichu");
        this.addClickEvent(btnQuit, this.node, "MJRoom", "onBtnQuit");


        var titles = cc.find("Canvas/typeTitle");
        for (var i = 0; i < titles.children.length; ++i) {
            titles.children[i].active = false;
        }

        if (cc.vv.gameNetMgr.conf) {
            var type = cc.vv.gameNetMgr.conf.type;
            if (type == null || type == "") {
                type = "xzdd";
            }

            //titles.getChildByName(type).active = true;   
        }
    },

    refreshBtns: function () {
        var prepare = this.node.getChildByName("prepare");
        var btnExit = prepare.getChildByName("btnExit");
        var btnDispress = prepare.getChildByName("btnDissolve");
        var btnWeichat = prepare.getChildByName("btnWeichat");
        //var btnBack = prepare.getChildByName("btnBack");
        var isIdle = cc.vv.gameNetMgr.numOfGames == 0;

        btnExit.active = this.btnExitShow();
        btnDispress.active = cc.vv.gameNetMgr.isOwner() && isIdle;

        btnWeichat.active =  cc.vv.gameNetMgr.isOwner() && isIdle;
        //btnBack.active = cc.vv.gameNetMgr.isOwner() && isIdle;
    },

    initEventHandlers: function () {
        var self = this;
        this.node.on('new_user', function (data) {
            self.initSingleSeat(data.detail);
        });

        this.node.on('user_state_changed', function (data) {
            self.initSingleSeat(data.detail);
        });

        this.node.on('game_begin', function (data) {
            self.refreshBtns();
            self.initSeats();
        });

        this.node.on('game_num', function (data) {
            self.refreshBtns();
        });

        this.node.on('game_huanpai', function (data) {
            for (var i in self._seats2) {
                self._seats2[i].refreshXuanPaiState();
            }
        });

        this.node.on('huanpai_notify', function (data) {
            var idx = data.detail.seatindex;
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            self._seats2[localIdx].refreshXuanPaiState();
        });

        this.node.on('game_huanpai_over', function (data) {
            for (var i in self._seats2) {
                self._seats2[i].refreshXuanPaiState();
            }
        });

        this.node.on('voice_msg', function (data) {
            var data = data.detail;
            self._voiceMsgQueue.push(data);
            self.playVoice();
        });

        this.node.on('chat_push', function (data) {
            var data = data.detail;
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            self._seats[localIdx].chat(data.content);
            self._seats2[localIdx].chat(data.content);
        });

        this.node.on('quick_chat_push', function (data) {
            var data = data.detail;
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);

            var index = data.content;
            var info = cc.vv.chat.getQuickChatInfo(index);
            self._seats[localIdx].chat(info.content);
            self._seats2[localIdx].chat(info.content);

            cc.vv.audioMgr.playSFX(info.sound);
        });

        this.node.on('emoji_push', function (data) {
            var data = data.detail;
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
            console.log(data);
            self._seats[localIdx].emoji(data.content);
            self._seats2[localIdx].emoji(data.content);
        });
		this.node.on('chaotian_notify',function(data){
            var data = data.detail;
            var seatData = data.seatData;
            var gangScore = data.gangScore;
            //刷新座位分
            self.initSeats();
           // self.addFenSeatsAction(gangScore);
        });

        this.node.on('gang_notify',function(data){
            var data = data.detail;
            var seatData = data.seatData;
            var gangtype = data.gangtype;
            if(data.gangScore==undefined){
               data.gangScore=0;
            }
             var gangScore = data.gangScore;
            //刷新座位分
            
            self.initSeats();
            //if(data.gangScore!=0){
            //  self.addFenSeatsAction(gangScore);
           // }
            
        });
    },

    initSeats: function () {
        var seats = cc.vv.gameNetMgr.seats;
        for (var i = 0; i < seats.length; ++i) {
            this.initSingleSeat(seats[i]);
        }
    },

    initSingleSeat: function (seat) {
        var index = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);
        var isOffline = !seat.online;
        var isZhuang = seat.seatindex == cc.vv.gameNetMgr.button;

        console.log("isOffline:" + isOffline);

        if (index == 2) {
            index = 3;
        }
        this._seats[index].setInfo(seat.name, seat.score);
        this._seats[index].setReady(seat.ready);
        this._seats[index].setOffline(isOffline);
        this._seats[index].setID(seat.userid);
        this._seats[index].voiceMsg(false);
        // if(index==3){
        //     return;
        // }

        // if(index==3){
        //     index=2;
        // }
        this._seats2[index].setInfo(seat.name, seat.score);
        this._seats2[index].setZhuang(isZhuang);
        this._seats2[index].setOffline(isOffline);
        this._seats2[index].setID(seat.userid);
        this._seats2[index].voiceMsg(false);
        this._seats2[index].refreshXuanPaiState();

        if (cc.vv.gameNetMgr.numOfGames == 1) {

            //var piao = cc.find("Canvas/game/0/piao");
            //console.log("initSingleSeat piao"+piao);
            //piao.active=true;
            console.log("选漂");

            //var piao = cc.find("Canvas/game/0/piao");
            //console.log("initSingleSeat piao"+piao);
            //piao.active=true;

        }
    },

    btnExitShow: function () {
        var isIdle = cc.vv.gameNetMgr.numOfGames == 0;
        if (cc.vv.gameNetMgr.isCreatedForOther() && isIdle) {
            return true;
        } else if (!cc.vv.gameNetMgr.isOwner() && isIdle) {
            return true;
        }
        return false;
    },

    choicePiao: function (piao) {
        var tmpselfdata = cc.vv.gameNetMgr.getSelfData();
        this._seats[0].setReady(seat.ready);
        console.log("tmpselfdata.seatindex " + tmpselfdata.seatindex);
        console.log("choicePiao");
        console.log("piao " + piao);
        //cc.vv.net.send("piao",tmpselfdata.seatindex,piao);
    },

    piao0: function () {
        console.log("piao0");
        this.choicePiao(0);

    },
    piao1: function () {
        console.log("piao1");
        this.choicePiao(1);
    },
    piao2: function () {
        console.log("piao2");
        this.choicePiao(2);
    },


    onBtnSettingsClicked: function () {
        cc.vv.popupMgr.showSettings();
    },

    onBtnBackClicked: function () {

        /*cc.vv.alert.show("返回大厅","返回大厅房间仍会保留，快去邀请大伙来玩吧！",function(){
            cc.director.loadScene("hall");    
        },true);*/
        //cc.vv.audioMgr.playSFX("ui_click.mp3");
        cc.vv.net.send("dissolve_request");
    },

    onBtnChatClicked: function () {

    },

    onBtnWeichatClicked: function () {
        var title = "<至尊卡五星>";
        cc.vv.anysdkMgr.share("至尊卡五星" + title, "房号:" + cc.vv.gameNetMgr.roomId + " 玩法:" + cc.vv.gameNetMgr.getWanfa());
    },

    onBtnDissolveClicked: function () {
        cc.vv.alert.show("解散房间", "解散房间不扣房卡，是否确定解散？", function () {
            cc.vv.net.send("dispress");
        }, true);
    },

    onBtnExit: function () {
        //cc.vv.audioMgr.playSFX("ui_click.mp3");
        if (cc.vv.gameNetMgr.isCreatedForOther() && cc.vv.gameNetMgr.isOwner()) {
            cc.vv.alert.show("退出自己创建的房间", "房间仍然会保留，是否确定退出？", function () {
                cc.vv.net.send("exit");
            }, true);
        } else {
            cc.vv.net.send("exit");
        }
    },

    playVoice: function () {
        if (this._playingSeat == null && this._voiceMsgQueue.length) {
            console.log("playVoice2");
            var data = this._voiceMsgQueue.shift();
            var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
            var localIndex = cc.vv.gameNetMgr.getLocalIndex(idx);
            this._playingSeat = localIndex;
            this._seats[localIndex].voiceMsg(true);
            this._seats2[localIndex].voiceMsg(true);

            var msgInfo = JSON.parse(data.content);

            var msgfile = "voicemsg.amr";
            console.log(msgInfo.msg.length);
            cc.vv.voiceMgr.writeVoice(msgfile, msgInfo.msg);
            cc.vv.voiceMgr.play(msgfile);
            this._lastPlayTime = Date.now() + msgInfo.time;
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var minutes = Math.floor(Date.now() / 1000 / 60);
        if (this._lastMinute != minutes) {
            this._lastMinute = minutes;
            var date = new Date();
            var h = date.getHours();
            h = h < 10 ? "0" + h : h;

            var m = date.getMinutes();
            m = m < 10 ? "0" + m : m;
            this._timeLabel.string = "" + h + ":" + m;
        }


        if (this._lastPlayTime != null) {
            if (Date.now() > this._lastPlayTime + 200) {
                this.onPlayerOver();
                this._lastPlayTime = null;
            }
        }
        else {
            this.playVoice();
        }
    },


    onPlayerOver: function () {
        cc.vv.audioMgr.resumeAll();
        console.log("onPlayCallback:" + this._playingSeat);
        var localIndex = this._playingSeat;
        this._playingSeat = null;
        this._seats[localIndex].voiceMsg(false);
        this._seats2[localIndex].voiceMsg(false);
    },

    onDestroy: function () {
        cc.vv.voiceMgr.stop();
        //        cc.vv.voiceMgr.onPlayCallback = null;
    }
});
