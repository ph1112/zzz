
var Tingpai = require("mjcalc1");
var hupaiCard = require("Module_exports");
var tingcard = [];
cc.Class({
	extends: cc.Component,

	properties: {
		gameRoot: {
			default: null,
			type: cc.Node
		},

		prepareRoot: {
			default: null,
			type: cc.Node
		},

		_myMJArr: [],
		_options: null,
		_selectedMJ: null,
		_chupaiSprite: [],
		_mjcount: null,
		_gamecount: null,
		_hupaiTips: [],
		_hupaiLists: [],
		_playEfxs: [],
		_opts: [],
		_kouPai: [],
		_isschedule:null

		/*_overAni:{
			default:null,
			type:cc.Node
		}*/
	},

	onLoad: function () {
		if (!cc.sys.isNative && cc.sys.isMobile) {
			var cvs = this.node.getComponent(cc.Canvas);
			cvs.fitHeight = true;
			cvs.fitWidth = true;
		}
		if (!cc.vv) {
			cc.director.loadScene("loading");
			return;
		}
		this.addComponent("NoticeTip");
		this.addComponent("GameOver");
		this.addComponent("DingQue");
		this.addComponent("PengGangs");
		this.addComponent("MJRoom");
		this.addComponent("TimePointer");
		this.addComponent("GameResult");
		this.addComponent("Chat");
		this.addComponent("Folds");
		this.addComponent("ReplayCtrl");
		this.addComponent("PopupMgr");
		this.addComponent("HuanSanZhang");
		this.addComponent("ReConnect");
		this.addComponent("Voice");
		this.addComponent("UserInfoShow");
		this.addComponent("KouPai");
		//this.addComponent("Maima");
		//this.addComponent("XuanPiao");
		this.initView();
		this.initEventHandlers();

		this.gameRoot.active = false;
		this.prepareRoot.active = true;
		this.initWanfaLabel();
		this.onGameBeign();
		cc.vv.audioMgr.playBGM("bgMain.mp3");
	},

	initView: function () {

		//搜索需要的子节点
		var gameChild = this.node.getChildByName("game");

		this._mjcount = gameChild.getChildByName('mjcount').getComponent(cc.Label);
		this._mjcount.string = cc.vv.gameNetMgr.numOfMJ;
		this._gamecount =gameChild.getChildByName('gamecount').getComponent(cc.Label);
		this._gamecount.string = "" + cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames;
		// this._overAni=gameChild.getChildByName("Maima");
		var myselfChild = gameChild.getChildByName("0");
		var myholds = myselfChild.getChildByName("holds");
		//自己的牌数
		console.log("myholds.children.length" + myholds.children.length);

		/* for(var i = 0; i < myholds.children.length; ++i){
			 var sprite = myholds.children[i].getComponent(cc.Sprite);
			 this._myMJArr.push(sprite);
			 sprite.spriteFrame = null;
		 }*/

		/*var realwidth = cc.director.getVisibleSize().width;
		myholds.scaleX *= realwidth/1280;
		myholds.scaleY *= realwidth/1280;  */

		var sideNet = cc.vv.gameNetMgr.seats;

		var sides = ["0", "1", "3", "2"];
		for (var i = 0; i < sideNet.length; i++) {
			var sideChild = gameChild.getChildByName(sides[i]);
			this._hupaiTips.push(sideChild.getChildByName("HuPaiOver"));
			this._hupaiLists.push(sideChild.getChildByName("hupailist"));
			this._playEfxs.push(sideChild.getChildByName("play_efx").getComponent(cc.Animation));
			this._chupaiSprite.push(sideChild.getChildByName("ChuPai"));//.children[1].getComponent(cc.Sprite)

			var opt = sideChild.getChildByName("opt");
			opt.active = false;
			var sprite = opt.getChildByName("pai").getComponent(cc.Sprite);
			var data = {
				node: opt,
				sprite: sprite
			};
			this._opts.push(data);
		}

		var opts = gameChild.getChildByName("ops");
		this._options = opts;
		this.hideOptions();
		this.hideChupai();
	},

	setLiangDao: function () {
		
		var seatData = cc.vv.gameNetMgr.getSelfData();
		this.initKouPaiCard();
		var holds=seatData.holds//现在是自己出牌。提示选择一张牌，再点亮
		var expai = -1;
		if (holds.length == 2 ||
			holds.length == 5 || holds.length == 8 || holds.length == 11 || holds.length == 14) {
			   if(!hupaiCard.data || hupaiCard.data.mjId=="undefined" ){
				   this.OpacityShow(this.node,{text:"请选择一张要打出的牌，再点亮"});
				   return;
			   }
			}
			   
		if (holds.length == 2 ||
			holds.length == 5 || holds.length == 8 || holds.length == 11 || holds.length == 14) {
				if(hupaiCard.data && hupaiCard.data.mjId ){
					expai = hupaiCard.data.mjId;
				}else{
					expai = holds[holds.length-1];
				}
		}
		var tingCard = Tingpai.GeneralTingpaiInfo(holds, expai);
		seatData.tingMap = tingCard.ting_infos;
		this._kouPai = tingCard.kou_infos;

		if (holds.length == 2 ||
			holds.length == 5 || holds.length == 8 || holds.length == 11 || holds.length == 14) {
			   if(hupaiCard.data && hupaiCard.data.mjId!="undefined" ){
				   if(this._kouPai.length==0)//手上没有可以扣的牌，打出选中的牌，亮倒。
				   {
					 cc.vv.net.send("chupai", hupaiCard.data.mjId);
					 hupaiCard.data = null;
				   }
				   
			   }//else{
				  // this.OpacityShow(this.node,{text:"请选择一张要打出的牌，再点亮"});
				 //  return;
			  // }
				
		}
		

		cc.find("Canvas/game/0/ting").active = false;
		console.log(" setLiangDao  seatData.liangDao " + seatData.liangDao);
		if (this._kouPai.length == 0) {
			seatData.liangDao = true;
			cc.vv.net.send('liangDao');
		}
		else {
			cc.find("Canvas/game/KouPai").active = true;
			cc.vv.gameNetMgr.dispatchEvent("koupai", this._kouPai);
			this.initMahjongs();
		}
	},

	hideChupai: function () {
		for (var i = 0; i < this._chupaiSprite.length; ++i) {
			this._chupaiSprite[i].active = false;
		}
	},

	initEventHandlers: function () {
		cc.vv.gameNetMgr.dataEventHandler = this.node;

		//初始化事件监听器
		var self = this;

		this.node.on('game_holds', function (data) {
			self.initMahjongs();
			self.checkQueYiMen();
		});

		this.node.on('game_begin', function (data) {
			self.onGameBeign();
		});

		this.node.on('game_sync', function (data) {
			self.onGameBeign();
		});

		this.node.on('game_chupai', function (data) {
			data = data.detail;
			self.hideChupai();
			self.checkQueYiMen();
			if (data.last != cc.vv.gameNetMgr.seatIndex) {
				self.initMopai(data.last, null);
			}
			if (!cc.vv.replayMgr.isReplay() && data.turn != cc.vv.gameNetMgr.seatIndex) {
				self.initMopai(data.turn, -1);
			}
		});

		this.node.on('game_mopai', function (data) {
			self.hideChupai();
			data = data.detail;
			var pai = data.pai;
			console.log("game_mopai   pai " + pai);

			var localIndex = cc.vv.gameNetMgr.getLocalIndex(data.seatIndex);
			if (localIndex == 0) {

				var parent = cc.find("Canvas/game/0/holds")
				var index = parent.children.length - 1;
				var array = parent.children;
				var sprite = array[index];

				if (sprite == null) {
					console.log("game_mopai err");
				}

				sprite.active = true
				self.setSpriteFrameByMJID2(sprite, pai);
				sprite.mjId = pai;
			}
			else if (cc.vv.replayMgr.isReplay()) {
				self.initMopai(data.seatIndex, pai);
			}
		});

		this.node.on('game_action', function (data) {
			console.log("receive action")
			self.showAction(data.detail);
		});

		this.node.on('hupai', function (data) {//zyh
			var data = data.detail;
			//如果不是玩家自己，则将玩家的牌都放倒
			var seatIndex = data.seatindex;
			var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
			//if(localIndex==2){
			//    return
			//}
			var hupai = self._hupaiTips[localIndex];
			hupai.active = true;
			if (localIndex == 0) {
				self.hideOptions();
			}
			self.hideHuPaiType();
			console.log("seatIndex.tostring() " + seatIndex.toString());
			var seatData = cc.vv.gameNetMgr.seats[seatIndex.toString()];

			seatData.hued = true;
			if (cc.vv.gameNetMgr.conf.type == "xlch") {
				hupai.getChildByName("sprHu").active = true;
				hupai.getChildByName("sprZimo").active = false;
				self.initHupai(localIndex, data.hupai);

				if (data.iszimo) {
					if (localIndex == cc.vv.gameNetMgr.seatIndex) {
						seatData.holds.pop();
						self.initMahjongs();
					}
					else {
						self.initOtherMahjongs(seatData);
					}
				}
			}
			else {
				hupai.getChildByName("sprHu").active = !data.iszimo;
				hupai.getChildByName("sprZimo").active = data.iszimo;//亮牌

				if (!(data.iszimo && localIndex == 0)) {
					//if(cc.vv.replayMgr.isReplay() == false && localIndex != 0){
					//    self.initEmptySprites(seatIndex);                
					//}
					self.initMopai(seatIndex, data.hupai);
				}
			}

			if (cc.vv.replayMgr.isReplay() == true && cc.vv.gameNetMgr.conf.type != "xlch") {
				var opt = self._opts[localIndex];
				opt.node.active = true;
				opt.sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_", data.hupai);
			}

			if (data.iszimo) {
			 //   self.playEfx(localIndex, "play_zimo");
			}
			else {
			 //   self.playEfx(localIndex, "play_hu");
			}
		   // var audioUrl = cc.vv.mahjongmgr.getActionVoice();
		   // cc.vv.audioMgr.playSFX("nv/hu.mp3");
		});

		this.node.on('mj_count', function (data) {
			self._mjcount.string =  ""+cc.vv.gameNetMgr.numOfMJ;
		});

		this.node.on('game_num', function (data) {
			self._gamecount.string = "" + cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames;
		});

		this.node.on('game_over', function (data) {
			//self.gameRoot.active = false;
			//self.prepareRoot.active = true;
			var seats = cc.vv.gameNetMgr.seats;

			for (var i = 0; i < 3; i++) {

				console.log("i" + i);
				var seatData = seats[i];
				console.log("i" + i + "   seatData" + seatData);
				seatData.liangDao = true;
				var localIndex = self.getLocalIndex(seatData.seatindex);
				if (localIndex == 0) {
					self.initMahjongs();
				}
				else {
					self.initOtherMahjongs(seatData);
				}
			}
		});


		this.node.on('game_chupai_notify', function (data) {
			self.hideChupai();
			var seatData = data.detail.seatData;
			if (seatData.seatindex == cc.vv.gameNetMgr.seatIndex) {
				self.initMahjongs();
				self.checkLiang();
			}
			else {
				self.initOtherMahjongs(seatData);
			}
			//if(seatData.liangDao){

			   // setTimeout(self.showChupai,2000);
		   // }else{
				self.showChupai(); 
		   // }

			var seat = cc.vv.gameNetMgr.getSelfData();


			var audioUrl = cc.vv.mahjongmgr.getAudioURLByMJID(data.detail.pai);
			cc.vv.audioMgr.playSFX(audioUrl);
		});

		this.node.on('guo_notify', function (data) {
			self.hideChupai();
			self.hideOptions();
			var seatData = data.detail;
			//如果是自己，则刷新手牌
			if (seatData.seatindex == cc.vv.gameNetMgr.seatIndex) {
				self.initMahjongs();
			}
			cc.vv.audioMgr.playSFX("give.mp3");
		});

		this.node.on('guo_result', function (data) {
			self.hideOptions();
		});

		this.node.on('game_dingque_finish', function (data) {
			cc.find("Canvas/game/0/holds").active = true;
			cc.find("Canvas/game/2/holds").active = true;
			cc.find("Canvas/game/1/holds").active = true;
			cc.find("Canvas/game/3/holds").active = true;
			self.initMahjongs();
		});

		this.node.on('peng_notify', function (data) {
			self.hideChupai();
			var seatData = data.detail;
			if (seatData.seatindex == cc.vv.gameNetMgr.seatIndex) {
				self.initMahjongs();
			}
			else {
				self.initOtherMahjongs(seatData);
			}
			// var localIndex = self.getLocalIndex(seatData.seatindex);   
			var tmp = seatData.seatindex;
			console.log("tmp " + tmp);
			var side = tmp.toString();
			if (side == "2") {
				if (seatData.seatindex == 0) {
					side = "1";
				}
				else { side = "3"; }
			}
			self.playEfx(side, "play_peng");
			 var audioUrl = cc.vv.mahjongmgr.getActionVoice();
			cc.vv.audioMgr.playSFX(audioUrl+"peng.mp3");
			self.hideOptions();
		});

		this.node.on('gang_notify', function (data) {
			self.hideChupai();
			var data = data.detail;
			var seatData = data.seatData;
			var gangtype = data.gangtype;

			var localIndex = self.getLocalIndex(seatData.seatindex);
			if (seatData.seatindex == cc.vv.gameNetMgr.seatIndex) {
				self.initMahjongs();
			}
			else {
				self.initOtherMahjongs(seatData);
			}

			var localIndex = self.getLocalIndex(seatData.seatindex);
			if (gangtype == "wangang") {
				self.playEfx(localIndex, "play_guafeng");
				//cc.vv.audioMgr.playSFX("guafeng.mp3");
			}
			else {
				self.playEfx(localIndex, "play_xiayu");
			  //  var audioUrl = cc.vv.mahjongmgr.getActionVoice();
				//cc.vv.audioMgr.playSFX(audioUrl+"gang");
			}
			var audioUrl = cc.vv.mahjongmgr.getActionVoice();
				cc.vv.audioMgr.playSFX(audioUrl+"gang.mp3");
		});

		this.node.on('game_LiangDao_notify', function (data) {
			console.log("game_LiangDao_notify");
			var localIndex = self.getLocalIndex(data.detail.seatindex);
			cc.log('localIndex--liangdao' + localIndex);
			self.initMahjongs();
			if (localIndex == 0) {
				// return;
			}
			var seats = cc.vv.gameNetMgr.seats;
			var seatData = seats[data.detail.seatindex.toString()];
			if(data.detail.holds!=null){
			  var holds = data.detail.holds;
			}
			else{
			  var longcount = data.detail.index;
			  console,log("longcount"+longcount);
			  var arr=[];
			  for(var i=0;i<4;i++){   
				var v = longcount%100;
				console,log("v"+v);
				longcount = Math.ceil(longcount/Math.pow(100,i));   
				arr.push(v);
			  }
			  seatdata.koudao={index:arr};
			  console,log("arr"+arr);
			  console,log("seatdata.koudao"+seatdata.koudao);
			}
	
			self.showotherHupai(seatData);
			var audioUrl = cc.vv.mahjongmgr.getActionVoice();
			cc.vv.audioMgr.playSFX(audioUrl+"liang.mp3");
			//self.initOtherMahjongs(seatData);
		});

		this.node.on("hangang_notify", function (data) {
			var data = data.detail;
			var localIndex = self.getLocalIndex(data);
			self.playEfx(localIndex, "play_gang");
			cc.vv.audioMgr.playSFX("nv/gang.mp3");
			self.hideOptions();
		});

		this.node.on('dingqueFinish', function (data) {
			cc.find("Canvas/game/0/holds").active = true;
			cc.find("Canvas/game/2/holds").active = true;
			cc.find("Canvas/game/1/holds").active = true;
			cc.find("Canvas/game/3/holds").active = true;
		});
	},
	autoHu:function()
	{
		console.log("this.autoHu3");
		 cc.vv.net.send("hu");
	},
	palyaniHuType:function(type)
	{
		var scale=cc.scaleTo
		var spawn = cc.spawn(cc.moveTo(0.1, cc.p(560, 150)), cc.scaleTo(0.15, 1.2));
	},
	showChupai: function () {
		var pai = cc.vv.gameNetMgr.chupai;
		if (pai >= 0) {
			//
			var localIndex = this.getLocalIndex(cc.vv.gameNetMgr.turn);
			console.log("showChupai localIndex " + localIndex);
			var switchlocalIndex = localIndex;
			if (switchlocalIndex > 1) {
				return;
			}
			console.log("showChupai switchlocalIndex " + switchlocalIndex);
			var sprite = this._chupaiSprite[switchlocalIndex];
			console.log("showChupai sprite " + sprite);
			var MingPai = "M_";
			if (cc.vv.gameNetMgr.liangDao) {
				MingPai = "B_"
			}

			sprite.children[1].getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID1(pai);
			sprite.active = true;
			//sprite.node.active = true;   
		}
	},

	//初始化扣牌提示
	initKouPaiCard: function () {
		var parent_kou = cc.find("Canvas/game/KouPai");
		for (var i = 0; i < 4; ++i) {
			parent_kou.getChildByName("Button" + i).getChildByName("kouxia").active = false;
		}
	},
	//初始化亮倒之后的胡牌提示
	initHuCard: function () {

		for (var i = 0; i < 5; i++) {
			var tmp = i.toString();
			cc.find("Canvas/game/0/HuCard/" + tmp).active = false;
			// cc.find("Canvas/game/1/HuCard/" + tmp).active = false;
			// cc.find("Canvas/game/3/HuCard/" + tmp).active = false;
		}
		cc.find("Canvas/game/0/HuCard/bg").active = false;

		var array = cc.vv.gameNetMgr.seats;
		// var alltingarr = [];
		var i = cc.vv.gameNetMgr.seatIndex;

		// for (var i = 0; i < array.length; i++) {
		if (array[i].liangDao && array[i].holds) {
			var tingCard = Tingpai.GeneralTingpaiInfo(array[i].holds);
			array[i].tingMap = tingCard.ting_infos;
			var tingarr = [];
			for (var k in array[i].tingMap) {
				cc.find("Canvas/game/" + 0 + "/HuCard/" + tmp).active = true;
				var spr = cc.find("Canvas/game/0/HuCard/" + tmp + "/Sprite");
				var spr1 = spr.getComponent(cc.Sprite);
				spr1.spriteFrame = cc.vv.mahjongmgr.getMahjongSpriteByID_ming(i, array[i].tingMap[k]);
				cc.find("Canvas/game/0/HuCard/bg").active = true;

			}
		}
		//  }

	},
	addOption: function (btnName, pai) {
		for (var i = 0; i < this._options.childrenCount; ++i) {
			var child = this._options.children[i];
			if (child.name == "op" && child.active == false) {
				child.active = true;
				var sprite = child.getChildByName("opTarget").getChildByName("Sprite").getComponent(cc.Sprite);
				sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID1(pai);
				var btn = child.getChildByName(btnName);
				btn.active = true;
				btn.pai = pai;
				return;
			}
		}
	},

	hideOptions: function (data) {
		this._options.active = false;
		for (var i = 0; i < this._options.childrenCount; ++i) {
			var child = this._options.children[i];
			if (child.name == "op") {
				child.active = false;
				child.getChildByName("btnPeng").active = false;
				child.getChildByName("btnGang").active = false;
				child.getChildByName("btnHu").active = false;
			}
		}
	},



	showAction: function (data) {
		if (this._options.active) {
			this.hideOptions();
		}
		this._options.getChildByName("btnGuo").active=true;
		if (data && (data.hu || data.gang || data.peng)) {
			this._options.active = true;
			if (data.hu) {
				console.log("this.autoHu1");
				this.addOption("btnHu", data.pai);
			}
			if (data.peng) {
				this.addOption("btnPeng", data.pai);
			}

			if (data.gang) {
				for (var i = 0; i < data.gangpai.length; ++i) {
					var gp = data.gangpai[i];
					this.addOption("btnGang", gp);
				}
			}
		};

		//如果已经亮到，自动胡。2秒之后
		 if(data&&cc.vv.gameNetMgr.getSelfData().liangDao&&data.hu)//亮到。胡
			{
				  console.log("this.autoHu2");
				  this._options.getChildByName("btnGuo").active=false;
					//this.scheduleOnce(this.autoHu,100);
				
			}
	},

	initWanfaLabel: function () {
		var wanfa = cc.find("Canvas/infobar/wanfa").getComponent(cc.Label);
		wanfa.string = cc.vv.gameNetMgr.getWanfa();
	},

	initHupai: function (localIndex, pai) {
		if (cc.vv.gameNetMgr.conf.type == "xlch") {
			var hupailist = this._hupaiLists[localIndex];
			for (var i = 0; i < hupailist.children.length; ++i) {
				var hupainode = hupailist.children[i];
				if (hupainode.active == false) {
					var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
					hupainode.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, pai);
					hupainode.active = true;
					break;
				}
			}
		}
	},

	playEfx: function (index, name) {
		console.log("playEfx index" + index);
		if (index == 3) {
			index = 2;
		}
		console.log("playEfx index" + index);
		this._playEfxs[index].active = true;
		this._playEfxs[index].play(name);
	},

	onGameBeign: function () {

		for (var i = 0; i < this._playEfxs.length; ++i) {
			this._playEfxs[i].node.active = false;
		}

		for (var i = 0; i < this._hupaiLists.length; ++i) {
			for (var j = 0; j < this._hupaiLists[i].childrenCount; ++j) {
				this._hupaiLists[i].children[j].active = false;
			}
		}

		for (var i = 0; i < cc.vv.gameNetMgr.seats.length; ++i) {
			var seatData = cc.vv.gameNetMgr.seats[i];
			console.log("i " + i);
			var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
			if (localIndex >= 3 || localIndex < 0) {
				continue;
			}
			console.log("localIndex " + localIndex);
			var hupai = this._hupaiTips[localIndex];
			seatData.hued = false;
			hupai.active = seatData.hued;
			// if(seatData.hued){
			hupai.getChildByName("sprHu").active = false;
			hupai.getChildByName("sprZimo").active = false;
			//  }

			if (seatData.huinfo) {
				for (var j = 0; j < seatData.huinfo.length; ++j) {
					var info = seatData.huinfo[j];
					if (info.ishupai) {
						this.initHupai(localIndex, info.pai);
					}
				}
			}
		}
		seatData.tingMap = {};
		// cc.find("Canvas/game/0/HuPai").active = false;
		cc.find("Canvas/game/0/ting").active = false;
		//cc.find("Canvas/game/1/HuPai").active = false;
		// cc.find("Canvas/game/3/HuPai").active = false;

		this.hideChupai();
		this.hideOptions();
		this.hideDaoPai();
		this.hideHuPaiType();
		this.initKouPaiCard();
		this.initHuCard();
		var sides = ["1", "3"];
		var gameChild = this.node.getChildByName("game");
		for (var i = 0; i < sides.length; ++i) {
			var sideChild = gameChild.getChildByName(sides[i]);
			var holds = sideChild.getChildByName("holds");
			cc.log("初始化左右两边的手牌-----" + sides[i] + "---" + holds.childrenCount);
			for (var j = 0; j < holds.childrenCount; ++j) {
				var nc = holds.children[j];
				nc.active = true;
				nc.scaleX = 1.0;
				nc.scaleY = 1.0;
				var sprite = nc.getComponent(cc.Sprite);
				sprite.spriteFrame = cc.vv.mahjongmgr.holdsEmpty[i + 1];
			}

		}

		if (cc.vv.gameNetMgr.gamestate == "" && cc.vv.replayMgr.isReplay() == false) {
			return;
		}

		this.gameRoot.active = true;
		this.prepareRoot.active = false;
		this.initMahjongs();
		var seats = cc.vv.gameNetMgr.seats;
		for (var i in seats) {
			var seatData = seats[i];
			var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
			if (localIndex != 0) {
				if (seatData.liangDao) {
					this.showotherHupai(seatData);
				} else
					this.initOtherMahjongs(seatData);

				if (i == cc.vv.gameNetMgr.turn) {
					this.initMopai(i, -1); //别人
				}
				else {
					this.initMopai(i, null);   //自己 
				}
			}
		}
		this.showChupai();
		if (cc.vv.gameNetMgr.curaction != null) {
			this.showAction(cc.vv.gameNetMgr.curaction);
			cc.vv.gameNetMgr.curaction = null;
		}

		this.checkQueYiMen();
	},
	hideDaoPai: function () //隐藏倒牌
	{
		var sides = ["1", "3"];
		var gameChild = this.node.getChildByName("game");
		for (var i = 0; i < sides.length; ++i) {
			var sideChild = gameChild.getChildByName(sides[i]);
			var holds = sideChild.getChildByName("daopai");
			cc.log("----隐藏倒牌-----");
			holds.active = false;
			for (var j = 0; j < holds.childrenCount; ++j) {
			}

		}

	},
	hideHuPaiType: function () //隐藏所胡的牌
	{
		var sides = ["0", "1", "3"];
		var gameChild = this.node.getChildByName("game");
		for (var i = 0; i < sides.length; ++i) {
			var sideChild = gameChild.getChildByName(sides[i]);
			var holds = sideChild.getChildByName("HuCard");
			cc.log("----隐藏所胡的牌-----");
			holds.active = false;
			for (var j = 0; j < holds.childrenCount; ++j) {
			}

		}
	},
	onMJClicked: function (event) {
		console.log("onMJClicked");
		/*
		//如果不是自己的轮子，则忽略
		if(cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex){
			console.log("not your turn." + cc.vv.gameNetMgr.turn);
			return;
		}

		if(this._selectedMJ == null ||this._selectedMJ == event.target){
			return
		}

		cc.vv.net.send("jiance",event.target.mjId);
		this._selectedMJ = event.target;
		*/
		/*
		if(cc.vv.gameNetMgr.isHuanSanZhang){
			this.node.emit("mj_clicked",event.target);
			return;
		}
		 //如果不是自己的轮子，则忽略
		if(cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex){
			console.log("not your turn." + cc.vv.gameNetMgr.turn);
			return;
		}
		for(var i = 0; i < this._myMJArr.length; ++i){
			if(event.target == this._myMJArr[i].node){
				//如果是再次点击，则出牌
				if(event.target == this._selectedMJ){
					this.shoot(this._selectedMJ.mjId); 
					this._selectedMJ.y = 0;
					this._selectedMJ = null;
					return;
				}
				if(this._selectedMJ != null){
					this._selectedMJ.y = 0;
				}
				event.target.y = 15;
				this._selectedMJ = event.target;
				return;
			}
		}
		*/
	},

	//出牌
	shoot: function (mjId) {
		if (mjId == null) {
			return;
		}
		cc.vv.net.send('chupai', mjId);
	},

	getMJIndex: function (side, index) {
		if (side == "1") {
			return 13 - index;
		}
		return index;
	},

	initMopai: function (seatIndex, pai) {
		if (seatIndex == 3) {
			return;
		}
		var recordliang = false;
		if (true == cc.find("Canvas/game/0/ting").active) {
			recordliang = true;
		}

		var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
		//var side = cc.vv.mahjongmgr.getSide(localIndex);
		var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
		var side = localIndex.toString();

		if (localIndex == 0) {

			var parent = cc.find("Canvas/game/0/holds")
			var index = parent.children.length - 1;
			var array = parent.children;
			var sprite = array[index];

			if (sprite == null) {
				console.log("game_mopai err");
			}

			sprite.active = true
			this.setSpriteFrameByMJID2(sprite, pai);
			sprite.mjId = pai;

			if (recordliang == true && cc.vv.gameNetMgr.numOfMJ >= 12) {
				cc.find("Canvas/game/0/ting").active = true;
			} else {
				cc.find("Canvas/game/0/ting").active = false;
			}
			return;
		}

		if (cc.vv.gameNetMgr.numOfMJ < 12) {
			cc.find("Canvas/game/0/ting").active = false;
		}
		var seats = cc.vv.gameNetMgr.seats;
		console.log("cc.vv.gameNetMgr.isTingTiShi " + cc.vv.gameNetMgr.isTingTiShi);

		var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
		//var side = cc.vv.mahjongmgr.getSide(localIndex);
		//var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
		var side = localIndex.toString();
		if (side == "2") {
			side = "3";
		}

		/*if (cc.vv.gameNetMgr.isTingTiShi) {
			var gameChild = this.node.getChildByName("game");
			var sideChild = gameChild.getChildByName("0");
			var ting = sideChild.getChildByName("ting");
			ting.active = true;
		}*/
		this.checkLiang();
		this.initMahjongs();
		//var side = cc.vv.mahjongmgr.getSide(localIndex);
		//var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
		var gameChild = this.node.getChildByName("game");
		var sideChild = gameChild.getChildByName(side);
		var holds = sideChild.getChildByName("holds");
		var lastIndex = this.getMJIndex(side, 13);
		if (side == "3") { lastIndex = 13 }
		var nc = holds.children[lastIndex];
		nc.mjId = pai;
		console.log("pai " + pai + " nc.mjId " + nc.mjId);
		if (side == "0") {
			nc.getChildByName("M_character_3").getComponent(cc.sprite).spriteFrame =
				cc.vv.mahjongmgr.getSpriteFrameByMJID1(pai);
		}
		else {
			nc.active = true;
		}

		nc.scaleX = 1.0;
		nc.scaleY = 1.0;

		if (pai == null) {
			nc.active = false;
		}
	},

	checkLiang: function () {
		var seatData = cc.vv.gameNetMgr.getSelfData();
		if(seatData.liangDao){
			return;
		}
		var l = seatData.holds.length;
		if (l == 14|| l == 2 || l == 5 || l == 8 || l == 11){
			var liang = Tingpai.GeneralTingpaiInfo(seatData.holds);
			if (liang.ting_infos.length > 0) {
				cc.find("Canvas/game/0/ting").active = true;
			}
		}
		else {
			var Tinglist = new Array();
			var liang = Tingpai.GeneralSingleTingpaiInfo(seatData.holds, Tinglist);
			cc.find("Canvas/game/0/ting").active = liang;
		}

	},

	initEmptySprites: function (seatIndex) {
		if (seatIndex == 3) {
			return;
		}
		var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
		//var side = cc.vv.mahjongmgr.getSide(localIndex);
		var side = localIndex.toString();
		var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
		if (seatIndex == 2) {
			if (seatIndex.seatindex == 0) {
				side = "1";
			}
			else { side = "3"; }
		}
		var gameChild = this.node.getChildByName("game");
		var sideChild = gameChild.getChildByName(side);
		var holds = sideChild.getChildByName("holds");
		var spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame(side);
		for (var i = 0; i < holds.childrenCount; ++i) {
			var nc = holds.children[i];
			nc.scaleX = 1.0;
			nc.scaleY = 1.0;

			var sprite = nc.getComponent(cc.Sprite);
			sprite.spriteFrame = spriteFrame;
		}
	},

	initOtherMahjongs: function (seatData) {
		console.log("initOtherMahjongs");
		if (seatData.seatindex == 3) {
			return;
		}
		if (!seatData) {
			return;
		}
		
		var localIndex = this.getLocalIndex(seatData.seatindex);
		var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
		var side = localIndex.toString()
		if (localIndex == 0) {
			return;
		}
		if (localIndex == 2) {
			side = "3";
		}
		var game = this.node.getChildByName("game");
		var sideRoot = game.getChildByName(side);
		var sideHolds = sideRoot.getChildByName("holds");
		var sideHolds1 = sideRoot.getChildByName("daopai");
		sideHolds.active = true;
		var num = 0;
		if(seatData.pengs)
			num = seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length;
		num *= 3;
		for (var i = 0; i < num; ++i) {
			var idx = this.getMJIndex(side, i);
			if (side == "3") { idx = i; }
			sideHolds.children[idx].active = false;
			sideHolds1.children[idx].active = false;
		}
		var YinCang = 0;
		var holds = this.sortHolds(seatData);

		if (holds != null && holds.length > 0) {

			if (seatData.liangDao && seatData.koudao.index) {
				for (var i = 0; i < seatData.koudao.index.length; ++i) {
					for (var j = 0; j < holds.length; j++) {
						if (seatData.koudao.index[i] == holds[j]) {
							YinCang += 1;
							break;
						}
					}
				}
				YinCang *= 3;
			}
			if (seatData.hued) {
				YinCang = 0;
			}

			for (var i = 0; i < holds.length; ++i) {
				var idx = this.getMJIndex(side, i + num);
				if (side == "3") {
					idx = num + i;
				}

				if (seatData.liangDao || seatData.hued) {
					if (YinCang > i) {
						sideHolds1.children[idx].active = false;
						continue;
					} else {
						sideHolds1.children[idx].active = true;
					}
					//var hupai = sideRoot.getChildByName("HuPai");
					//hupai.active = true;
					if (!YinCang) {

					}
					var sprite = sideHolds1.children[idx].getChildByName("handmah_11");
					sideHolds1.active = true;
					sprite.getComponent(cc.Sprite).spriteFrame =
						cc.vv.mahjongmgr.getOtherPlayDaoSpriteFrameByMJID(pre, holds[i], seatData);
					sideHolds.children[idx].active = false;
					console.log("!!!seatData.koudao.length");

				}
			}
			if (holds.length + num == 13) {
				if (side == "1") {
					sideHolds.children[0].active = false;
					sideHolds1.children[0].active = false;

				} else if (side == "3") {
					var lasetIdx = this.getMJIndex(side, 13);
					sideHolds.children[13].active = false;
					sideHolds1.children[13].active = false;
				}

			}
		}
		if (cc.find("Canvas/game/dingque").active) {
			sideHolds.active = false;
		}
	},

	sortHolds: function (seatData) {
		var holds = seatData.holds;
		var koudao = seatData.koudao;
		if (holds == null) {
			return null;
		}
		//如果手上的牌的数目是2,5,8,11,14，表示最后一张牌是刚摸到的牌
		var mopai = null;
		var l = holds.length
		if (l == 2 || l == 5 || l == 8 || l == 11 || l == 14) {
			mopai = holds.pop();
		}
		var dingque = 0;
		console.log("holds" + holds);
		cc.vv.mahjongmgr.sortMJ(holds, dingque, koudao.index);
		console.log("seatData.koudao" + koudao);

		//将摸牌添加到最后
		if (mopai != null) {
			holds.push(mopai);
		}
		console.log("holds" + holds);
		return holds;
	},



	initMahjongs: function () {

		console.log("initMahjongs");

		// var seatData = cc.vv.gameNetMgr.getSelfData();
		//var self_parent1=cc.find("Canvas/game/1/holds");
		// var self_parent3=cc.find("Canvas/game/3/holds");


		var array = cc.vv.gameNetMgr.seats;
		var alltingarr = [];
		//if(){
		for (var i = 0; i < array.length; i++) {
			// if(array[i].liangdao){
			if (array[i].liangDao && i != cc.vv.gameNetMgr.seatIndex) {
				var tingarr = [];
				for (var k in array[i].tingMap) {
					cc.log('array[i].tingMap[k]------' + array[i].tingMap[k]);
					tingarr.push(array[i].tingMap[k]);
				}
				alltingarr = alltingarr.concat(tingarr);
			}
		}
		//  }
		// }
		//alltingarr;
		cc.log('alltingarr------' + alltingarr);
		var seats = cc.vv.gameNetMgr.seats;
		var seatData = seats[cc.vv.gameNetMgr.seatIndex];

		var holds = this.sortHolds(seatData);
		if (holds == null) {
			return;
		}
		//初始化手牌
		var lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length) * 3;
		var self_MJ = cc.find("Canvas/game/0/ZhengMianMJ");
		//var scaleVar = 0.9;
		var YinCang = 0;
		if (seatData.liangDao) {
			cc.find("Canvas/game/0/HuCard").active = true;
			self_MJ = cc.find("Canvas/game/0/DaoPaiMJ");
			// scaleVar = 1;
			YinCang = 0;
			if (seatData.liangDao && seatData.koudao.index) {
				for (var i = 0; i < seatData.koudao.index.length; ++i) {
					for (var j = 0; j < holds.length; j++) {
						if (seatData.koudao.index[i] == holds[j]) {
							YinCang += 1;
							break;
						}
					}
				}
			}

			YinCang *= 3;
		}
		if (seatData.hued) {
			self_MJ = cc.find("Canvas/game/0/DaoPaiMJ");
			cc.find("Canvas/game/0/HuCard").active = false;
			//scaleVar = 1;
			YinCang = 0;
		}
		var tingCard = Tingpai.GeneralTingpaiInfo(holds);
		seatData.tingMap = tingCard.ting_infos;
		this._kouPai = tingCard.kou_infos;

		var self_parent = cc.find("Canvas/game/0/holds");
		self_parent.removeAllChildren();

		for (var i = 0; i < holds.length; i++) {
			if (YinCang > 0 && YinCang > i) {
				self_MJ = cc.find("Canvas/game/0/ZhengMianMJ");
				//scaleVar = 0.9;
			} else if (seatData.liangDao) {
				self_MJ = cc.find("Canvas/game/0/DaoPaiMJ");
				//scaleVar = 1;
			}
			var sprite = cc.instantiate(self_MJ);
			self_parent.addChild(sprite);
			sprite.mjId = holds[i];
			for (var j = 0; j < alltingarr.length; j++) {
				if (holds[i] == alltingarr[j]) {
					cc.log('');
					sprite.getChildByName("MJdi").color = new cc.Color(175, 175, 175);
				}
			}
			if (i == holds.length - 1 && (holds.length == 2 ||
				holds.length == 5 || holds.length == 8 || holds.length == 11 || holds.length == 14)) {
				if (!YinCang) {
					sprite.setPosition(self_MJ.getChildByName("MJdi").width * (i + lackingNum) - 30, -6.8);
				} else {
					sprite.setPosition(self_MJ.getChildByName("MJdi").width * (i + lackingNum) - 20, -6.8);
				}

				// if (seatData.liangDao) {
				//  if (!YinCang && YinCang > i) {
				//  sprite.getChildByName("M_character_3").getComponent(cc.Sprite).spriteFrame =
				//     cc.vv.mahjongmgr.getSpriteFrameByMJID1(holds[i]);
				//} else {
				//  sprite.getChildByName("M_character_3").getComponent(cc.Sprite).spriteFrame =
				//     cc.vv.mahjongmgr.gameOverBymahjongID(holds[i]);
				//  }

				// } /else {
				sprite.getChildByName("M_character_3").getComponent(cc.Sprite).spriteFrame =
					cc.vv.mahjongmgr.getSpriteFrameByMJID1(holds[i]);
				//  }
			}
			else {
				if (!YinCang) {
					sprite.setPosition(self_MJ.getChildByName("MJdi").width * (i + lackingNum) - 40, -6.8);
				} else {
					sprite.setPosition(self_MJ.getChildByName("MJdi").width * (i + lackingNum) - 50, -6.8);
				}
				// sprite.setPosition(self_MJ.getChildByName("MJdi").width * (i + lackingNum) - 50, 0);
				// if (seatData.liangDao) {
				// if (!YinCang && YinCang > i) {
				sprite.getChildByName("M_character_3").getComponent(cc.Sprite).spriteFrame =
					cc.vv.mahjongmgr.getSpriteFrameByMJID1(holds[i]);

				// } else {

				//  sprite.getChildByName("M_character_3").getComponent(cc.Sprite).spriteFrame =
				//    cc.vv.mahjongmgr.gameOverBymahjongID(holds[i]);
			}


			// } else {
			//    sprite.getChildByName("M_character_3").getComponent(cc.Sprite).spriteFrame =
			//    cc.vv.mahjongmgr.getSpriteFrameByMJID1(holds[i]);
			//  }
			// }
			if (holds[i] in tingCard.ting_infos) {
				if (sprite.getChildByName("tingJ") == null) {
					continue;
				}
				sprite.getChildByName("tingJ").active = true
			}
		}
		if (holds.length < 14) {
			var sprite = cc.instantiate(self_MJ);
			self_parent.addChild(sprite);
			sprite.mjId = 1;
			sprite.setPosition(self_MJ.getChildByName("MJdi").width * 13 - 30, -6.8);
			sprite.active = false;
		}
		if (cc.find("Canvas/game/dingque").active) {
			self_parent.active = false;
		}
		//self_parent.active=true;

		/* for(var i = 0; i < holds.length; ++i){
			 var mjid = holds[i];
			 var sprite = this._myMJArr[i];//+ lackingNum
			 sprite.node.mjId = mjid;
			 sprite.node.y = 0;
			 this.setSpriteFrameByMJID(sprite,mjid);
		 }
		 for(var i = 0; i < lackingNum; ++i){
			 var sprite = this._myMJArr[i]; 
			 sprite.node.mjId = null;
			 sprite.spriteFrame = null;
			 sprite.node.active = false;
		 }
		 for(var i = lackingNum + holds.length; i < this._myMJArr.length; ++i){
			 var sprite = this._myMJArr[i]; 
			 sprite.node.mjId = null;
			 sprite.spriteFrame = null;
			 sprite.node.active = false;            
		 }*/
	},

	setSpriteFrameByMJID: function (pre, sprite, mjid) {
		console.log("mjid " + mjid);
		sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_", mjid);
		sprite.node.active = true;
	},
	setSpriteFrameByMJID2: function (sprite, mjid) {
		console.log("mjid " + mjid);
		sprite.getChildByName("M_character_3").getComponent(cc.Sprite).spriteFrame =
			cc.vv.mahjongmgr.getSpriteFrameByMJID1(mjid);
		sprite.active = true;
	},

	//如果玩家手上还有缺的牌没有打，则只能打缺牌
	checkQueYiMen: function () {
		if (cc.vv.gameNetMgr.conf == null || cc.vv.gameNetMgr.conf.type != "xlch" || !cc.vv.gameNetMgr.getSelfData().hued) {
			//遍历检查看是否有未打缺的牌 如果有，则需要将不是定缺的牌设置为不可用
			var dingque = cc.vv.gameNetMgr.dingque;
			//        console.log(dingque)
			var hasQue = false;
			if (cc.vv.gameNetMgr.seatIndex == cc.vv.gameNetMgr.turn) {
				for (var i = 0; i < this._myMJArr.length; ++i) {
					var sprite = this._myMJArr[i];
					//                console.log("sprite.node.mjId:" + sprite.node.mjId);
					if (sprite.node.mjId != null) {
						var type = cc.vv.mahjongmgr.getMahjongType(sprite.node.mjId);
						if (type == dingque) {
							hasQue = true;
							break;
						}
					}
				}
			}

			//        console.log("hasQue:" + hasQue);
			for (var i = 0; i < this._myMJArr.length; ++i) {
				var sprite = this._myMJArr[i];
				if (sprite.node.mjId != null) {
					var type = cc.vv.mahjongmgr.getMahjongType(sprite.node.mjId);
					if (hasQue && type != dingque) {
						sprite.node.getComponent(cc.Button).interactable = false;
					}
					else {
						sprite.node.getComponent(cc.Button).interactable = true;
					}
				}
			}
		}
		else {
			if (cc.vv.gameNetMgr.seatIndex == cc.vv.gameNetMgr.turn) {
				for (var i = 0; i < 14; ++i) {
					var sprite = this._myMJArr[i];
					if (sprite.node.active == true) {
						sprite.node.getComponent(cc.Button).interactable = i == 13;
					}
				}
			}
			else {
				for (var i = 0; i < 14; ++i) {
					var sprite = this._myMJArr[i];
					if (sprite.node.active == true) {
						sprite.node.getComponent(cc.Button).interactable = true;
					}
				}
			}
		}
	},

	getLocalIndex: function (index) {
		var ret = (index - cc.vv.gameNetMgr.seatIndex + 3) % 3;
		//console.log("old:" + index + ",base:" + cc.vv.gameNetMgr.seatIndex + ",new:" + ret);       
		return ret;
	},

	onOptionClicked: function (event) {
		console.log(event.target.pai);
		if (event.target.name == "btnPeng") {
			cc.vv.net.send("peng");
		}
		else if (event.target.name == "btnGang") {
			cc.vv.net.send("gang", event.target.pai);
		}
		else if (event.target.name == "btnHu") {
			//if(this._isschedule)
			//{
			//     this.unschedule(this._isschedule);
	   
		  //  }
		  console.log("autoHu4");
			cc.vv.net.send("hu");
		}
		else if (event.target.name == "btnGuo") {
			cc.vv.net.send("guo");
		}
	},

	// called every frame, uncomment this function to activate update callback
	//update: function (dt) {
	//},

	onDestroy: function () {
		console.log("onDestroy");
		if (cc.vv) {
			cc.vv.gameNetMgr.clear();
		}
	},

	showotherHupai: function (seatData) {
		console.log("showotherHupai");
		if (seatData.liangDao == false) {
			console.log("seatData.liangDao==false");
			return;
		}
		if (seatData.seatindex == 3) {
			return;
		}

		var tingarray = [];
		var tingCard = Tingpai.GeneralSingleTingpaiInfo(seatData.holds, tingarray);
		if (tingarray.length == 0) {
			return;
		}
		seatData.tingMap = tingarray;

		var localseatDataIndex = this.getLocalIndex(seatData.seatindex);
		var side = localseatDataIndex.toString();
		if (localseatDataIndex == 0) {
			console.log("localIndex == 0");
			// return;
		}
		if (localseatDataIndex == 2) {
			side = "3";
		}
		for (var i = 0; i < 5; i++) {
			var tmp = i.toString();
			console.log("Canvas/game/" + side + "/HuCard/" + tmp);

			cc.find("Canvas/game/" + side + "/HuCard/" + tmp).active = false;
		}
		cc.find("Canvas/game/" + side + "/HuCard/bg").active = true;
		cc.find("Canvas/game/" + side + "/HuCard").active = true;
		if (seatData == null) {
			console.log("seat==null");
			return;
		}
		if (seatData.tingMap == null) {
			console.log("seat.tingMap==null");
			return;
		}
		var tingMap = seatData.tingMap;
		//console.log("tingMap.length"+tingMap.length);
		for (var i in tingMap) {
			var tmp = i.toString();
			//tmp=tingMap[tmp];
			console.log("tmp" + tmp);
			console.log("Canvas/game/" + side + "/HuCard/" + tmp + "/Sprite");
			cc.find("Canvas/game/" + side + "/HuCard/" + tmp).active = true;
			var spr = cc.find("Canvas/game/" + side + "/HuCard/" + tmp + "/Sprite");
			var spr1 = spr.getComponent(cc.Sprite);
			spr1.spriteFrame = cc.vv.mahjongmgr.getMahjongSpriteByID_ming(side, tingMap[i]);
		}

		var seats = cc.vv.gameNetMgr.seats;
		for (var i = 0; i < 3; i++) {
			var seat = seats[i];
			var localIndex = this.getLocalIndex(seat.seatindex);
			if (0 == localIndex) {
				this.initMahjongs();
			}
			else {
				this.initOtherMahjongs(seat);
			}
		}
	},
	 OpacityShow:function(parentNode,o){
		if(!this._lab){
			this._lab = new cc.Node().addComponent(cc.Label);
			this._lab.node.parent = parentNode;
			this._lab.node.setPosition(100,100);
			this._lab.node.color = new cc.Color(255, 0, 0);
			this._lab.fontSize = 30;
		}
	   
		this._lab.string = o.text;
		//this._lab.
		this._lab.node.stopAllActions();
		var ani = cc.sequence(
			
			cc.fadeTo(0.25,255),
			cc.delayTime(1),
			cc.fadeTo(0.25,0),
			cc.removeSelf(),
			cc.callFunc(function(){
				this._lab = null;
			},this, 10),
			
			);
	   
		this._lab.node.runAction(cc.sequence(ani));
	},


});
