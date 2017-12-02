class Bullet {
    constructor(stage, p, size) {
        this.p = p.id;
        const ball = new createjs.SpriteSheet({
            images: [images["mainbeem" + (p.id + 1)]], // アニメーション画像を指定
            frames: {
                'width': 230,
                'height': 230
            }, // 1コマのサイズを指定
            animations: {
                run: [0, 4, 'go', 0.5],
                bound: [3, 4, 'go', 0.5],
                go: [5, 5]
            }
        });

        this.ball = new createjs.Sprite(ball, 'run');
        this.ball.width = 200*size;
        this.ball.height = 200*size;
        this.ball.scaleX = size;
        this.ball.scaleY = size;

        this.ball.x = p.x - (p.r * Math.cos(p.rotation * Math.PI / 180)) + (2 * p.r * Math.sin(p.rotation * Math.PI / 180));
        this.ball.y = p.y - (p.r * Math.sin(p.rotation * Math.PI / 180)) - (2 * p.r * Math.cos(p.rotation * Math.PI / 180));
        this.ball.v = 0;
        this.ball.a = 0;
        this.ball.regX = 50;
        this.ball.regY = 50;
        this.delete = false;
        this.ball.theta = p.rotation - 90; //create.jsのrotationの仕様が、90°から反時計回りなので合ってる
        Object.defineProperty(this.ball, 'rotation', {
            get: function () {
                return(this.theta + 90) % 360;
            }
        });
        this.ball.a = 4;
        this.alpha = 1.0;
        this.bound = 3*size;
        this.b1 = new createjs.Shape();
        this.b1.graphics.beginFill("Blue").drawCircle(0, 0, 30);
        this.b1.x = 0;
        this.b1.y = 0;
        //stage.addChild(this.b1);
        this.b2 = new createjs.Shape();
        this.b2.graphics.beginFill("Green").drawCircle(0, 0, 30);
        this.b2.x = 0;
        this.b2.y = 0;
        //stage.addChild(this.b2);
        if(stage.dummy!==true){
            createjs.Sound.play("beamse");
            stage.addChild(this.ball);
        }
    }
    move(stage) {
        //加速度分だけ速度を増やす
        this.ball.v += this.ball.a;
        //加速度を減らす
        if(this.ball.a > 0) this.ball.a -= 0.5;
        else this.ball.a = 0;
        const a = -Math.cos(this.ball.theta / 180 * Math.PI) * this.ball.height;
        const b = -Math.sin(this.ball.theta / 180 * Math.PI) * this.ball.height;
        const x1 = this.ball.x + Math.cos((this.ball.theta + 90) / 180 * Math.PI) * (this.ball.width - 75) / 2 - 0.3 * a;
        const y1 = this.ball.y + Math.sin((this.ball.theta + 90) / 180 * Math.PI) * (this.ball.width - 75) / 2 - 0.3 * b;
        //バウンド
        if((this.ball.x <= 0 + Math.abs(this.ball.width * Math.cos(this.ball.theta / 180 * Math.PI)) / 2) && (Math.cos(this.ball.theta / 180 * Math.PI) <= 0)) {
            this.bound--;
            if(this.bound >= 0) {
                this.ball.gotoAndPlay("bound");
                this.ball.x = 0;
                this.ball.y = y1 + b*(-x1/a);
                this.ball.theta = (180 - this.ball.theta) % 360;
            }
        }
        if((this.ball.x >= stage.w - Math.abs(this.ball.width * Math.cos(this.ball.theta / 180 * Math.PI)) / 2) && (Math.cos(this.ball.theta / 180 * Math.PI) >= 0)) {
            this.bound--;
            if(this.bound >= 0) {
                this.ball.gotoAndPlay("bound");
                this.ball.x = stage.w;
                this.ball.y = y1 + b*((-x1+stage.w)/a);
                this.ball.theta = (180 - this.ball.theta) % 360;
            }
        }
        if((this.ball.y <= 0 + Math.abs(this.ball.height * Math.sin(this.ball.theta / 180 * Math.PI)) / 2) && (Math.sin(this.ball.theta / 180 * Math.PI) <= 0)) {
            this.bound--;
            if(this.bound >= 0) {
                this.ball.gotoAndPlay("bound");
                this.ball.y = 0;
                this.ball.x = x1 + a*(-y1/b);
                this.ball.theta = (-this.ball.theta) % 360;
            }
        }
        if((this.ball.y >= stage.h - Math.abs(this.ball.height * Math.sin(this.ball.theta / 180 * Math.PI)) / 2) && (Math.sin(this.ball.theta / 180 * Math.PI) >= 0)) {
            this.bound--;
            if(this.bound >= 0) {
                this.ball.gotoAndPlay("bound");
                this.ball.y = stage.h;
                this.ball.x = x1 + a*((-y1+stage.h)/b);
                this.ball.theta = (-this.ball.theta) % 360;
            }
        }
        //動かす
        this.ball.x += Math.cos(this.ball.theta / 180 * Math.PI) * this.ball.v;
        this.ball.y += Math.sin(this.ball.theta / 180 * Math.PI) * this.ball.v;
        this.ball.theta = (this.ball.theta + 360) % 360;
        if(this.ball.y < -this.ball.height * 2 || this.ball.y > stage.h + this.ball.height * 2 || this.ball.x < -this.ball.width * 2 || this.ball.x > stage.w + this.ball.width * 2) {
            if(stage.dummy!==true)stage.removeChild(this.ball);
            this.delete = true;
        }
    }
    hit(players,gauges) {
        players.forEach(p => {
            const cos = obj => Math.cos(obj.v * obj.theta);
            const sin = obj => Math.sin(obj.v * obj.theta);
            //const rev = theta => (theta<90)||(theta>180&&theta<270);//なんかうまくいかないので
            const px = p.container.x;
            const py = p.container.y;
            const a = -Math.cos(this.ball.theta / 180 * Math.PI) * this.ball.height;
            const b = -Math.sin(this.ball.theta / 180 * Math.PI) * this.ball.height;
            const x1 = this.ball.x + Math.cos((this.ball.theta + 90) / 180 * Math.PI) * (this.ball.width - 75) / 2 - 0.3 * a;
            const y1 = this.ball.y + Math.sin((this.ball.theta + 90) / 180 * Math.PI) * (this.ball.width - 75) / 2 - 0.3 * b;
            this.b1.x = x1;
            this.b1.y = y1;
            this.b2.x = x1 + a;
            this.b2.y = y1 + b;
            const t = -((a * (x1 - px)) + (b * (y1 - py))) / ((a * a) + (b * b));
            if(t <= 1 && t >= 0) {
                const dist = Math.sqrt(Math.pow((-b * (x1 - px)) + (a * (y1 - py)), 2) / ((a * a) + (b * b)));
                if(dist < 45) {
                    //プレイヤーを弾く
                    p.container.theta = (180 * Math.atan2(cos(p.container) + cos(this.ball), sin(p.container) + sin(this.ball)) / Math.PI);
                    p.container.v = 10;
                    if(this.p !== p.id && p.barrier.muteki <= 0) {
                        p.container.hp -= 1;
                        p.barrier.muteki = 100;
                        if(gauges!==undefined)p.damage(gauges);
                    }
                }
            }
        });
    }
}
