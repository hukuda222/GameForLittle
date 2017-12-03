const players = [];
const bullets = [];
const gauges = [];
const types = {"easy":1,"hard":2,"double":3};
let nowType = types.easy;
let started = false;

/*一人用なら、0が自分、1が相手*/
const applyKey = playerId => {
    if(nowType === types.double){
        if(playerId === 0)return 2;
        else if(playerId === 1)return 1;
    }
    return playerId;
};


const gameInit = (stage, any) => {
    players.push(new Player(stage, 100, 100, players.length, 225, 100, 100, 1));
    players.push(new Player(stage, 700, 500, players.length, 100, 100, 225, -1));
    gauges.push(new Gauge(stage, 100, 70, 0, 225, 150, 150, 3, 30));
    gauges.push(new Gauge(stage, stage.w - 180, 70, 1, 150, 150, 225, 3, 30));
    nowType = types[any.type];
    started = false;
    const count = new createjs.Text("3", "50px Century Gothic", "Orange");
    count.x = 300;
    count.y = 200;
    createjs.Tween.get(count).to({
        scaleX: 3,
        scaleY: 3
    }, 1000, createjs.Ease.cubicInOut).to({
        scaleX: 1,
        scaleY: 1
    }, 10, createjs.Ease.cubicInOut).call(_ => {
        count.text = "2";
    }).to({
        scaleX: 4,
        scaleY: 4
    }, 1000, createjs.Ease.cubicInOut).to({
        scaleX: 1,
        scaleY: 1
    }, 10, createjs.Ease.cubicInOut).call(_ => {
        count.text = "1";
    }).to({
        scaleX: 5,
        scaleY: 5
    }, 1050, createjs.Ease.cubicInOut).call(_ => {
        stage.removeChild(count);
        started = true;
    });
    stage.addChild(count);
    createjs.Sound.play("count");
};

const gameEnd = stage => {
    players.splice(0, players.length);
    bullets.splice(0, bullets.length);
    gauges.splice(0, gauges.length);
};
const gameLoop = stage => {
    if(started){
        if(nowType===types.hard){
            const input2p = obj.predict.test(players,bullets,obj.key,100,stage,2);
            if(input2p && obj.key[1]==0) obj.key[1] = 1 ;
            else if(!input2p && obj.key[1]==2) obj.key[1] = 0;
        }
        else if(nowType===types.easy){
            const input2p = Math.random()>0.99;
            if(input2p && obj.key[1]==0) obj.key[1] = 1 ;
            else if(!input2p && obj.key[1]==2) obj.key[1] = 0;
        }

        players.forEach((p, index) => {
            if(obj.key[applyKey(index)] === 1) {
                p.charge = 0;
                p.shot(stage, bullets, 1);
            } else if(obj.key[applyKey(index)] === 2) {
                p.container.rotation += 3 * p.turn;
                p.charge += 1;
                if(p.container.v > 0.5) p.container.v -= 0.5;
                else p.container.v = 0;
            } else if(p.charge >= 40 && obj.key[applyKey(index)] === 0) {
                if(p.charge >= 60) p.charge = 60;
                p.shot(stage, bullets, p.charge / 40);
                p.charge = 0;
            }
            p.move(stage);
        });
        hit_all(players);
        bullets.forEach((b, i) => {
            if(b.delete) {
                bullets.splice(i, 1);
            } else if(b !== undefined) {
                b.move(stage);
                b.hit(players,gauges);
            }
        });
        players.some(p => {
            if(p.container.hp <= 0) {
                Manager.change("end", {
                    win: (p.id + 1) % 2
                });
                return true;
            }
        });
    }
    stage.update();
};
