class Player{
    constructor(stage,x,y,id,r,g,b,turn) {
        this.container = new createjs.Container();
        this.container.x = x;
        this.container.y = y;
        this.container.v = 0;
        this.container.a = 0;
        this.container.theta = 0;
        this.container.e = 0.2;
        this.container.mu = 0.05;
        this.container.rotation = 30;
        this.charge = 0;
        this.turn = turn;
        stage.addChild(this.container);

        this.id = id;
        this.container.id = id;

        this.ball = new createjs.Shape();
        this.muzzle = new createjs.Shape();
        this.barrier = new createjs.Shape();
        this.mr = 10;
        this.r = 50;
        this.container.hp = 3;
        this.container.maxhp = 3;
        this.ball.color = [r,g,b];

        this.ball.graphics.beginFill("#"+this.ball.color[0].toString(16)+this.ball.color[1].toString(16)+this.ball.color[2].toString(16)).drawCircle(0, 0, this.r);
        this.muzzle.graphics.beginFill("Black").drawEllipse(-this.mr, -40, this.mr*2,this.mr);
        const makeBrrierColor = c => c>100 ? 225 :150;
        this.barrier.graphics.beginFill("#"+makeBrrierColor(this.ball.color[0]).toString(16)+makeBrrierColor(this.ball.color[1]).toString(16)+makeBrrierColor(this.ball.color[2]).toString(16)).drawCircle(0, 0, this.r+20);
        this.barrier.muteki = 0;

        Object.defineProperty(this.barrier,"alpha",{get: function () {
            return this.muteki>0 ? 0.4 :0.0;
        }});
        this.ball.x=0;
        this.ball.y=0;
        this.ball.cache(this.ball.x-this.r, this.ball.y-this.r, this.r*2, this.r*2);
        this.ball.ap = 40;//AP、移動に使う

        this.container.addChild(this.ball);
        this.container.addChild(this.muzzle);
        this.container.addChild(this.barrier);
        this.container.r = this.r;

        const charge = new createjs.SpriteSheet({
                            images: [images["charge"+(id+1)]], // アニメーション画像を指定
                            frames: {'width':230,'height':230}, // 1コマのサイズを指定
                            animations: {
                                run:[0,40,false,1],
                                first:[40,40,false,1]
                            }
                        });
        this.ch = new createjs.Sprite(charge,'first');

        this.ch.x=-this.r*2-15;
        this.ch.y=-this.r*3;
        this.container.addChild(this.ch);
    }
    move(stage){
        this.container.rotation = (this.container.rotation+3*this.turn)%360;
        if(this.ball.ap < 40)this.ball.ap += 1;
        else this.ball.ap = 40;
        if(this.barrier.muteki > 0)this.barrier.muteki -= 1;
        else this.barrier.muteki = 0;
        //動かなさそうなら無視
        if(this.container.a > 0.5 || this.container.v > 0.5){
            //加速度分だけ速度を増やす
            this.container.v += this.container.a;
            //加速度を減らす
            if(this.container.a>0)this.container.a-=1;
            else this.container.a = 0;
            //摩擦係数を反映
            this.container.v -= this.container.mu;
            //バウンド処理
            if((this.container.x-this.r <=0 && Math.cos(this.container.theta/180*Math.PI)<=0) ||
                (this.container.x+this.r >= stage.w && Math.cos(this.container.theta/180*Math.PI)>=0)){
                    this.container.theta = (180-this.container.theta)%360;
            }
            if((this.container.y-this.r<=0 && Math.sin(this.container.theta/180*Math.PI)<=0) ||
                (this.container.y+this.r>=stage.h && Math.sin(this.container.theta/180*Math.PI)>=0)){
                    this.container.theta = (-this.container.theta)%360;
            }
            //動かす
            this.container.x += Math.cos(this.container.theta/180*Math.PI)*this.container.v;
            this.container.y += Math.sin(this.container.theta/180*Math.PI)*this.container.v;
        }
    }
    shot(stage,bullets,size){
        //APが40あれば打つ
        if(this.ball.ap>=40){
            this.ball.ap -= 40;
            this.container.a = 5;
            this.container.theta = (this.container.rotation+90)%360;//create.jsのrotationの仕様が、90°から反時計回りなので合ってる
            if(!stage.dummy)this.ch.gotoAndPlay("run");
            bullets.push(new Bullet(stage,this.container,size));
        }
    }
    damage(gauges){
        createjs.Sound.play("shock");
        gauges[this.id].damage(this.container.hp)
    }
}
