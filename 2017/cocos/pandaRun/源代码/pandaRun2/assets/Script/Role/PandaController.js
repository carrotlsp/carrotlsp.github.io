cc.Class({
    extends: cc.Component,

    properties: {
        speed:cc.v2(0, 0),
        addSpeed: 600,
        maxSpeed: cc.v2(500, 1000),
        gravity: -1000,
        jumpSpeed: 500,
        collisionX: 0,
        collisionY: 0,
        direction: 0, //控制的方向，只有左右
        jumping: false,
        jumpCount: 0, //跳跃次数
        drag: 1000,
        prePosition:cc.v2(0,0), //上一帧的坐标
        player: null, // 动画播放器

        // //外部组件
        uiLayer: cc.Node,
        uiLayerComonent: null,

        //result
        resultView:cc.Node,
    },

    // use this for initialization
    onLoad: function () {

        //=======================碰撞检测系统==========================
        let manager = cc.director.getCollisionManager();
        //默认碰撞检测系统是禁用的，如果需要使用则需要以下方法开启碰撞检测系统
        manager.enabled = true;
        //默认碰撞检测系统的 debug 绘制是禁用的，如果需要使用则需要以下方法开启 debug 绘制
        //    manager.enabledDebugDraw = true;
        //如果还希望显示碰撞组件的包围盒，那么可以通过以下接口来进行设置
        // manager.enabledDrawBoundingBox = true;



        //=======================按键事件==========================
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.onKeyPressed.bind(this),
            onKeyReleased: this.onKeyReleased.bind(this)
        }, this.node);

        //=======================other==========================
        this.player = this.node.getComponent(cc.Animation);

       this.prePosition.x = this.node.x;
       this.prePosition.y = this.node.y; //UI组件
        this.uiLayerComonent = this.uiLayer.getComponent("uiLayer");
    },

    //======================= update ==========================
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
         /**
         * Y轴变化
         *  */ 
        if (this.collisionY === 0) //没任何碰撞，计算重力
        {
            this.speed.y += this.gravity * dt;
            if (Math.abs(this.speed.y) > this.maxSpeed.y) 
            {
                this.speed.y = this.speed.y > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
        } 

        if (this.direction === 0) {
            //停下的时候，计算摩擦力 
            if (this.speed.x > 0) {
                this.speed.x -= this.drag * dt;
                if (this.speed.x <= 0) this.speed.x = 0;
            } else if (this.speed.x < 0) {
                this.speed.x += this.drag * dt;
                if (this.speed.x >= 0) this.speed.x = 0;
            }
        } else {
            //左右速度行走,如果反方向，速度用更大的摩擦力，令方向更快改变

            var trueDir = this.speed.x > 0 ? 1 : -1;
            if (this.speed.x == 0) trueDir = 0;
            var speed = (trueDir == this.direction ? this.addSpeed : 3000);

            this.speed.x += (this.direction > 0 ? 1 : -1) * speed * dt;
            if (Math.abs(this.speed.x) > this.maxSpeed.x) {
                this.speed.x = this.speed.x > 0 ? this.maxSpeed.x : -this.maxSpeed.x;
            }
        }

        //左右有碰撞,X立刻停下
        if (this.speed.x * this.collisionX > 0) {
            this.speed.x = 0;
        }

        this.prePosition.x = this.node.x;
        this.prePosition.y = this.node.y;

        this.node.x += this.speed.x * dt;
        this.node.y += this.speed.y * dt;
    },
    //=======================按键事件==========================
     onKeyPressed: function (keyCode, event) {
        switch (keyCode) {
            case cc.KEY.d:
                this.direction = 1;
                if (!this.jumping) this.player.play("runAnimation");    
                break;
            case cc.KEY.a:
                this.direction = -1;
                if (!this.jumping) this.player.play("runAnimation");   

                break;
            case cc.KEY.j:
                if (!this.jumping || this.jumpCount < 2) {
                    this.jumping = true;
                    this.speed.y = this.jumpSpeed;

                    this.jumpCount++;
                    this.jumpCount < 2 ? this.player.play("jumpAnimation") : this.player.play("twoJumpAnimation");
                }
                break;
        }
    },

    onKeyReleased: function (keyCode, event) {
         switch (keyCode) {
            case cc.KEY.d:
                if (this.direction == 1) {
                    this.direction = 0;
                }
                break;
            case cc.KEY.a:
                if (this.direction == -1) {
                    this.direction = 0;
                }
                break;
         }
    },
    //=======================碰撞检测系统==========================

   collisionGoldEnter: function (other, self) {
        other.node.removeFromParent();

        this.uiLayerComonent.addGold();
    },
    

    collisionPlatformEnter: function (other, self) {
        var selfAabb = self.world.aabb.clone();
        var otherAabb = other.world.aabb;
        var preAabb = self.world.preAabb;

        selfAabb.x = preAabb.x;
        selfAabb.y = preAabb.y;

        //检查X是否发生碰撞
        selfAabb.x = self.world.aabb.x;
        if (cc.Intersection.rectRect(selfAabb, otherAabb)) {
            if (this.speed.x < 0 && selfAabb.xMax > otherAabb.xMax) {
                this.node.x = otherAabb.xMax;
                this.collisionX = -1;
            } else if (this.speed.x > 0 && selfAabb.xMin < otherAabb.xMin) {
                this.node.x = otherAabb.xMin - selfAabb.width;
                this.collisionX = 1;
            }

            this.speed.x = 0;
            return;
        }

        //检查Y是否发生碰撞
        selfAabb.y = self.world.aabb.y;
        if (cc.Intersection.rectRect(selfAabb, otherAabb)) {
            if (this.speed.y < 0 && selfAabb.yMax > otherAabb.yMax) {
                this.node.y = otherAabb.yMax;
                this.jumping = false;
                this.player.play("runAnimation");
                this.jumpCount = 0;
                this.collisionY = -1;
            } else if (this.speed.y > 0 && selfAabb.yMin < otherAabb.yMin) {
                cc.log("检查Y是否发生碰撞else");
                this.node.y = otherAabb.yMin - selfAabb.height;
                this.collisionY = 1;
            }

            this.speed.y = 0;
        }
    },

    /**
     * 当碰撞调用
     * @param  {Collider} other 产生碰撞的另一个碰撞组件
     * @param  {Collider} self  产生碰撞的自身的碰撞组件
     */
    onCollisionEnter: function (other, self) {
        console.log('on collision enter');
        cc.log("coll tag = " + other.tag);

    
       if (other.tag == 1) {
           this.collisionGoldEnter(other, self);
       } else if(other.tag == 2){
           this.resultView.active = true;
       }
       else{
           this.collisionPlatformEnter(other, self);
       }
    },

    onCollisionStay: function (other, self) {
        // console.log('on collision stay');

        if (other.tag != 0) return;
        if (this.collisionY === -1) {
            var offset = cc.v2(other.world.aabb.x - other.world.preAabb.x, 0);

            // var temp = cc.affineTransformClone(self.world.transform);
            // temp.tx = temp.ty = 0;

            // offset = cc.pointApplyAffineTransform(offset, temp);
            this.node.x += offset.x;
        }
    },
    onCollisionExit: function (other, self) {
        console.log('on collision exit');
        if (other.tag != 0) return;
        
        this.collisionX = 0;
        this.collisionY = 0;
        this.jumping = true;
        this.jumpCount = 1;
        this.player.play("jumpAnimation");
    },

});
