﻿/**
 * Created by yang on 2016/11/10.
 */

gameclass.exitroom = gameclass.baseui.extend({
    node:null,
    pl_agree:null,
    pl_wait:null,
    ctor: function () {
        this._super();
    },
    show:function(){
        this.node = this.game.uimgr.createnode(res.exitroom, true);
        this.pl_agree = ccui.helper.seekWidgetByName(this.node, "agree");
        this.pl_wait = ccui.helper.seekWidgetByName(this.node, "wait");

        this.addChild(this.node);

        var _this = this;

        gameclass.createbtnpress(this.node, "cancelbtn", function () {
            _this.game.uimgr.closeui("gameclass.exitroom");
            _this.mod_niuniu.nodissmissroom();
        });

        gameclass.createbtnpress(this.node, "okbtn", function () {
            _this.mod_niuniu.dissmissroom();
        });
    },

    setData:function(mod_niuniu, data) {
        //"msgdata":"{\"agree\":[100003],\"time\":300}"}

        //var lst = data.agree
        this.mod_niuniu = mod_niuniu;
        var _this = this;

        var lefttime = ccui.helper.seekWidgetByName(this.node, "leftTime");
        var run = cc.repeatForever(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            var servertime = _this.mod_niuniu.mywebsocket.getcurservertime();
            var _time = data.time - servertime;
            if(_time <= 0){
                _time = 0;
            }
            lefttime.setString(_time + "秒后解散房间");
        })));

        lefttime.runAction(run);

        var personList;
        if(this.mod_niuniu.roominfo){
            personList = this.mod_niuniu.roominfo.person;
        }else{
            personList = this.mod_niuniu.view.personData.person;
        }


        for (var i = 0; i < 5 ; i++){
            var node = ccui.helper.seekWidgetByName(this.node, "p" + (i + 1).toString());
            node.setVisible(i < personList.length);
            if(i >= personList.length) {
                continue;
            }

            var player = personList[i];
            cc.log(player);

            gameclass.mod_base.showtximg(node, player.imgurl, 0, 0, "im_headbg4");
            ccui.helper.seekWidgetByName(node, "name").setString(player.name);
            var state = ccui.helper.seekWidgetByName(node, "stateIcon");
            var find = 0;
            for(var j = 0; j < data.agree.length; j++) {
                if(data.agree[j] == player.uid) {
                    if(j == 0) {
                        find = 2;      //! 申请者
                    } else {
                        find = 1;     //! 同意者
                    }
                }
            }

            if(find == 0) {
                state.setTexture("res/ui/qhqp/12-apply/qh_img_waitting@2x.png");
                // state.setString("(等待中)");
                // state.setColor(cc.color(136, 136, 136));
            } else if(find == 1) {
                state.setTexture("res/ui/qhqp/12-apply/qh_img_agree@2x.png");
                // state.setString("(同意)");
                // state.setColor(cc.color(24, 167, 44));
            } else {
                state.setTexture("res/ui/qhqp/12-apply/qh_img_agree@2x.png");
                // state.setString("(申请解散)");
                // state.setColor(cc.color(231, 72, 30));
            }

            if(player.uid == this.game.modmgr.mod_login.logindata.uid) {
                this.pl_agree.setVisible(find == 0);
                this.pl_wait.setVisible(find != 0);
            }
        }
    }
});