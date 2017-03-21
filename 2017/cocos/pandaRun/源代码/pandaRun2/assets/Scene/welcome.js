cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        tipSettingBoxPrefab:cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {

    },

    gotoPlay: function () {  
        cc.director.loadScene('game');
    },
    
     gotoWelcome: function () {  
        cc.director.loadScene('welcome');
    },
    
      showTipMessageBox: function(message) {
        this.tipSettingNode = cc.instantiate(this.tipSettingBoxPrefab);
        this.node.addChild(this.tipSettingNode);
    },
});
