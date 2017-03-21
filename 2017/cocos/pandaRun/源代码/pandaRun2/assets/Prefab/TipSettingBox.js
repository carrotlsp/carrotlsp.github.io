cc.Class({
    extends: cc.Component,

    properties: {
        IDInfoLabel:cc.Label,
        nickNameInfoLabel:cc.Label,
        diamondInfoLabel:cc.Label,
        IPInfoLabel:cc.Label,

        avatarSprite:cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {

    },


    setInfoLabel: function(stringLabel){
        this.infoLabel.string = stringLabel;
    },

    BGButtonClicked:function () {
        this.node.destroy();
    },
});
