cc.Class({
    extends: cc.Component,

    properties: {

        platform_generator: null,
        platform_default_0: cc.Node,
        platform_default_1: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        var platform_generator_node = cc.find("platformGenerator")
        this.platform_generator = platform_generator_node.getComponent("platformGenerator");
        this.platform_generator.initPlatforms([this.platform_default_0, this.platform_default_1]);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
