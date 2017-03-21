cc.Class({
    extends: cc.Component,

    properties: {
        farBGNodeArray:[cc.Node],
        nearBGNodeArray:[cc.Node],

        farSpeed:1,
        nearSpeed:1,
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.bgMove(this.farBGNodeArray , this.farSpeed);
        this.bgMove(this.nearBGNodeArray , this.nearSpeed);
    },

    //bg移动
    bgMove: function (bgNodeArray ,speed) {
        let firstBg = bgNodeArray[0];
        let secondBg = bgNodeArray[1];

        firstBg.setPosition(firstBg.x - speed,firstBg.y);
        secondBg.setPosition(secondBg.x - speed,secondBg.y);

        //bg重新排序
        if(firstBg.x + firstBg.width <= 0 ){
            firstBg.setPosition(secondBg.x + secondBg.width,firstBg.y);
        }
        if(secondBg.x + secondBg.width <= 0 ){
            secondBg.setPosition(firstBg.x + firstBg.width,secondBg.y);
        }
    },

});
