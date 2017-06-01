cc.Class({
    extends: cc.Component,
    properties: {
        account:null,
	    userId:null,
		userName:null,
        token:null,
		lv:0,
		exp:0,
		coins:0,
		gems:0,
		sign:0,
        ip:"",
        sex:0,
        roomData:null,
        
        oldRoomId:null,
    },
    
    guestAuth:function(){
        var account = cc.args["account"];
        if(account == null){
            account = cc.sys.localStorage.getItem("account");
        }
        
        if(account == null){
            account = Date.now();
            cc.sys.localStorage.setItem("account",account);
        }
        
        cc.vv.http.sendRequest("/guest",{account:account},this.onAuth);
    },
    
    onAuth:function(ret){
        var self = cc.vv.userMgr;
        if(ret.errcode !== 0){
            console.log(ret.errmsg);
        }
        else{
            self.account = ret.account;
            self.sign = ret.sign;
            self.token=ret.token;
            cc.sys.localStorage.setItem("token",self.token);
            cc.vv.http.url = "http://" + cc.vv.SI.hall;
            self.login();
        }   
    },
    
    login:function(){
        var self = this;
        var onLogin = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
                cc.vv.wc.hide();
            }
            else{
                if(!ret.userid){
                    //jump to register user info.
                    cc.director.loadScene("createrole");
                }
                else{
                    console.log("loginRet:",ret);
                    self.account = ret.account;
        			self.userId = ret.userid;
        			self.userName = ret.name;
        			self.lv = ret.lv;
        			self.exp = ret.exp;
        			self.coins = ret.coins;
        			self.gems = ret.gems;
                    self.roomData = ret.roomid;
                    self.sex = ret.sex;
                    self.ip = ret.ip;
                    self.dealer_level=ret.dealer_level;
        			cc.director.loadScene("hall");
                }
            }
        };
        cc.vv.wc.show("正在登录游戏");
        cc.vv.http.sendRequest("/login",{account:this.account,sign:this.sign,token:this.token},onLogin);
    },
    
     getCoins:function(){
        var self = this;
        var callback = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{      
                self.coins = ret.data.coins;
                self.gems = ret.data.gems;
                console.log("ret.coins:",ret.data.coins);
                console.log("ret.gems:",ret.data.gems);
        		console.log("self.coins:",self.coins);
                console.log("self.gems:",self.gems);
                
            }
        };
        //cc.vv.wc.show("正在登录游戏");
        var token = this.token;
        console.log("token:",token);
         var data={
                    token:this.token,
               }
        cc.vv.http.sendRequest("/coins_and_gems",data,callback);
    },

    create:function(name){
        var self = this;
        var onCreate = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                self.login();
            }
        };
        
        var data = {
            account:this.account,
            sign:this.sign,
            name:name,
            token:this.token,
        };
        cc.vv.http.sendRequest("/create_user",data,onCreate);    
    },
    
    enterRoom:function(roomId,callback,isReConnet){
        var self = this;
        if(isReConnet == false && cc.vv.gameNetMgr.roomId != roomId && cc.vv.gameNetMgr.roomId){
            var tips = "房间已经创建!\n必须解散当前房间" + cc.vv.gameNetMgr.roomId + "才能进入新的房间";
            cc.vv.alert.show("提示",tips);
            return;
        }

        var onEnter = function(ret){
            if(ret.errcode !== 0){
                if(ret.errcode == -1){
                    setTimeout(function(){
                        self.enterRoom(roomId,callback);
                    },5000);
                }
                else{
                    cc.vv.wc.hide();
                    if(callback != null){
                        callback(ret);
                    }
                }
            }
            else{
                if(callback != null){
                    callback(ret);
                }
                cc.vv.gameNetMgr.connectGameServer(ret);
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            roomid:roomId,
            token:cc.vv.userMgr.token
        };
        cc.vv.wc.show("正在进入房间 " + roomId);
        cc.vv.http.sendRequest("/enter_private_room",data,onEnter);
    },
    //得到自己的游戏历史记录
    getHistoryList:function(callback){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                console.log(ret.history);
                if(callback != null){
                    callback(ret.history);
                }
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            token:cc.vv.userMgr.token,
        };
        cc.vv.http.sendRequest("/get_history_list",data,onGet);
    },

    //得到用户创建房间的列表
    getListUserRooms:function(callback){
        var self = this;
        var onGet = function(ret){
            console.log("============= /list_user_rooms",ret);
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                console.log(ret.roomList);
                if(callback != null){
                    callback(ret.roomList);
                }
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            token:cc.vv.userMgr.token,
            
        };
        cc.vv.http.sendRequest("/list_user_rooms",data,onGet);
    },
    //通过回放码搜索
    getHuiFangRooms:function(callback,num){
        var self = this;
        var onGet = function(ret){
            console.log("============= /回放码",ret);
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                console.log(ret.roomList);
                if(callback != null){
                    callback(ret.roomList);
                }
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            token:cc.vv.userMgr.token,
            index:0,
            id:num,
            room_uuid:0
        };
        cc.vv.http.sendRequest("/get_detail_of_game",data,onGet);
    },

    getGamesOfRoom:function(uuid,callback){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                console.log(ret.data);
                callback(ret.data);
            }
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            uuid:uuid,
            token:cc.vv.userMgr.token,
        };
        cc.vv.http.sendRequest("/get_games_of_room",data,onGet);
    },
    
    getDetailOfGame:function(uuid,index,callback){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                console.log(ret.data);
                callback(ret.data);
            }       
        };
        
        var data = {
            account:cc.vv.userMgr.account,
            sign:cc.vv.userMgr.sign,
            uuid:uuid,
            index:index,
            token:cc.vv.userMgr.token,
        };
        cc.vv.http.sendRequest("/get_detail_of_game",data,onGet);
    }
});
