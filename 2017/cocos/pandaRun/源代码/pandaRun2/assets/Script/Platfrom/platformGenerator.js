cc.Class({
    extends: cc.Component,

    properties: {
        platformList:[],
        platformPrefabList:[cc.Prefab],
        platformLayer:cc.Node,

        goldList:[cc.Prefab],
        moveSpeed:1,
        maxSpeed:8,
    },

    // use this for initialization
    onLoad: function () {

    },

    initPlatforms: function (startList) {
        this.platformList = startList;
    },

    generate: function (lastPlatform) {

        var winSize = cc.director.getWinSize();

        let random_num = Math.random() * 4;
        random_num = Math.floor(random_num);

        let platformTemp = cc.instantiate(this.platformPrefabList[random_num]);

        this.platformLayer.addChild(platformTemp);
        this.platformList.push(platformTemp);
        

        platformTemp.x = lastPlatform.x + lastPlatform.width  +  winSize.width * 0.2 + winSize.width * 0.2 * Math.random();

        if(Math.random() > 0.5){
            platformTemp.y = winSize.height / 2 + winSize.height * 0.2 * Math.random() ;
        } else
        {
            platformTemp.y = winSize.height / 2 - winSize.height * 0.2 * Math.random() ;
        }


          //一定的几率平台添加金币
        if (Math.random() >= 0.5) {
            var index = Math.random() * 3;
            index = Math.floor(index);
            var gold_group = cc.instantiate(this.goldList[0]);
            var platform_size = platformTemp.getContentSize();
            gold_group.setPosition(platform_size.width / 2, platform_size.height);
            platformTemp.addChild(gold_group);
        }

        cc.log("产出一个平台,平台数=", this.platformList.length);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        let platform = null;
        let newList = [];
        for(let i = 0 ;i < this.platformList.length ; i++) {
            platform = this.platformList[i];
            platform.x -= this.moveSpeed;

            if (platform.x + platform.width < 0) {
                platform.removeFromParent();
            } else {
                newList.push(platform);
            }
        }

        this.platformList = newList;

        if(!platform)return;

        var winSize = cc.director.getWinSize();
        var platformRight = platform.x + platform.width;

        if (platformRight < winSize.width * 0.8) {
            this.generate(platform)
        }
    },
});
