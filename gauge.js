class Gauge{
    constructor(stage,x,y,id,r,g,b,n,rad){
        this.id = id;//playerのidと一緒
        this.ball = [];
        for (let i=0;i<n;i++){
            this.ball.push(new createjs.Shape());
            this.ball[i].x=x+i*(rad*2+10);
            this.ball[i].y=y;
            this.ball[i].graphics.beginStroke("#000").beginFill("#"+r.toString(16)+g.toString(16)+b.toString(16)).drawCircle(0, 0, rad);
            this.ball[i].alpha = 0.7;
            stage.addChild(this.ball[i]);
        }
    }
    damage(hp){
        this.ball.forEach((e,i)=>{
            if(i>=hp){
                this.ball[i].alpha = 0;
            }
        });
    }
}
