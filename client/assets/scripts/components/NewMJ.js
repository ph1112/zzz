
var moudle_exports = require("Module_exports");
var pos = null;
var BIG_Y = 100;
var iii = 0;
cc.Class({
    extends: cc.Component,
    properties:
    {
        MianZhi: cc.Sprite,
        Upheight: 20,
        mjId: 0,
    },

    onLoad: function () {
        var yxhSprite = this.node;
        this.mjId = iii++;
        var self = this;
        console.log('onLoad');
        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            target: this,

            showHupai: function (isTrue, mjId, playId) {
                console.log("showHupai  25");
                for (var i = 0; i < 5; i++) {
                    var tmp = i.toString();
                    cc.find("Canvas/game/0/HuCard/" + tmp).active = false;
                }
                cc.find("Canvas/game/0/HuCard/bg").active = isTrue;
                cc.find("Canvas/game/0/HuCard").active = isTrue;
                if (mjId < 0 || mjId > 36) {
                    return;
                }
                if (mjId == null) {
                    console.log("mjId==null  " + mjId);
                    return;
                }
                var seat = cc.vv.gameNetMgr.getSelfData();
                if (seat == null) {
                    console.log("seat==null  " + mjId);
                    return;
                }
                if (seat.tingMap == null) {
                    console.log("seat.tingMap==null  " + mjId);
                    return;
                }
                var tingMap = seat.tingMap[mjId];
                 cc.find("Canvas/game/0/HuCard/bg").active = isTrue;
                for (var i = 0; i < tingMap.length; i++) {
                    var tmp = i.toString();
                    cc.find("Canvas/game/0/HuCard/" + tmp).active = isTrue;
                    var spr = cc.find("Canvas/game/0/HuCard/" + tmp + "/Sprite");
                    var spr1 = spr.getComponent(cc.Sprite);
                    spr1.spriteFrame = cc.vv.mahjongmgr.getMahjongSpriteByID_ming(0, tingMap[i]);
                }

            },

            chuPaiMJ: function (target, seatindex) {
                //如果不是自己的轮子，则忽略
                if ((cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex) || (moudle_exports.data==null)) {
                    return;
                }

                cc.find("Canvas/game/0/HuCard").active = false;
                target.setPosition(cc.p(560, 100));
                var spawn = cc.spawn(cc.moveTo(0.1, cc.p(560, 150)), cc.scaleTo(0.15, 0.6));
                var remove = cc.callFunc(function (target) {
                    target.runAction(cc.removeSelf());
                    cc.vv.net.send("chupai", target.mjId);
                    console.log('---------------------------------OK');
                }, target);
                moudle_exports.data = null;
                var sequence = cc.sequence(cc.delayTime(0.3), spawn, remove);
                target.runAction(sequence);

            },

            onTouchBegan: function (touch, event) {
                //如果不是自己的轮子，则忽略
                if (cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex) {
                    return;
                }
                var array = cc.vv.gameNetMgr.seats;
                var alltingarr = [];
                for (var i = 0; i < array.length; i++) {
                    if (array[i].liangDao && i != cc.vv.gameNetMgr.seatIndex) {
                        var tingarr = [];
                        for (var k in array[i].tingMap) {
                            tingarr.push(array[i].tingMap[k]);
                        }
                        alltingarr = alltingarr.concat(tingarr);
                    }
                }
                var target = yxhSprite;
                var toNodePos = touch.getLocation();
                pos = target.getPosition();

                for (var j = 0; j < alltingarr.length; j++) {
                    if (target.mjId == alltingarr[j]) {
                        // cc.log('');
                        // sprite.getChildByName("MJdi").color = new cc.Color(175, 175, 175);
                        //self.OpacityShow(cc.find("Canvas/game"),{text:"别人胡的牌不能打"});//cc.director.getScene()
                        return false;
                    }
                }
                var size = target.getChildByName("MJdi").getContentSize();
                var rc = target.getChildByName("MJdi").getBoundingBoxToWorld();
                 if (!(cc.rectContainsPoint(rc, toNodePos))) {
                    return false;
                }
                //显示胡的牌
                if (target.getChildByName("tingJ") == null) {
                    return;
                }
                if (target.getChildByName("tingJ").active == true) {
                    this.showHupai(true, target.mjId, 0);
                    cc.find("Canvas/game/0/ting").active = true;
                    console.log("active==true");
                }
                else {
                    this.showHupai(false, null, 0);
                    cc.find("Canvas/game/0/ting").active = false;
                    console.log("active==false");
                }


               
                if (target == moudle_exports.data)//把牌打出去
                {
                    this.chuPaiMJ(target, cc.vv.gameNetMgr.turn);
                    return true;
                }
                if (moudle_exports.data != null) {
                    var array = target.getParent().children;

                    for (var i = 0; i < target.getParent().childrenCount; ++i) {
                        if (array[i] == moudle_exports.data) {
                            array[i].setPositionY(0);
                        }
                    }
                }
                target.setPositionY(target.getPosition().y + 20);
                moudle_exports.data = target;
                return true;
            },
            onTouchMoved: function (touch, event) {
                if(moudle_exports.data == yxhSprite){
                    var target = moudle_exports.data;//event.getCurrentTarget();
                    var delta = touch.getDelta();
                    target.x = target.getPositionX();
                    target.y = target.getPositionY();
                    target.x += delta.x;
                    target.y += delta.y;
                    ////delta.y;
                    console.log("onTouchMoved")
                    target.setPosition(cc.p(target.x, target.y));
                }
            },
            onTouchEnded: function (touch, event) {
                if(moudle_exports.data == yxhSprite){
                    console.log("onTouchEnded")
                    var target = moudle_exports.data;//event.getCurrentTarget();
                    var delta = touch.getLocation();
                    var ofx = touch.getDelta();
                    if (target.getPositionY() - pos.y < BIG_Y && target.getPositionY() - pos.y > 20) {
                        target.setPositionX(pos.x);
                        target.y = 20;
                        target.setPositionY(20);
                        moudle_exports.data = null;
                    }
                    if (target.getPositionY() - pos.y < 20) {
                        target.setPositionX(pos.x);
                        target.setPositionY(0);
                        target.y = 0;
                        moudle_exports.data = null;
                    }
                    if (target.getPositionY() - pos.y >= BIG_Y) {//出牌{   
                        this.chuPaiMJ(target, cc.vv.gameNetMgr.turn);
                    }
                }
            },
        };
        cc.eventManager.addListener(listener, yxhSprite);
    },
    OpacityShow: function (parentNode, o) {
        if (!this._lab) {
            this._lab = new cc.Node().addComponent(cc.Label);
            this._lab.node.parent = parentNode;
            this._lab.node.setPosition(0, 0);
            this._lab.node.color = new cc.Color(255, 0, 0);
            this._lab.fontSize = 30;
        }

        this._lab.string = o.text;
        //this._lab.
        this._lab.node.stopAllActions();
        var ani = cc.sequence(

            cc.fadeTo(0.25, 255),
            cc.delayTime(1),
            cc.fadeTo(0.25, 0),
            cc.removeSelf(),
            cc.callFunc(function () {
                this._lab = null;
            }, this, 10),

        );

        this._lab.node.runAction(cc.sequence(ani));
    },
});