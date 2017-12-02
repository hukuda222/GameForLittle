class Predict{
    constructor(){
        this.dummyplayers = [];
        this.dummybullets = [];
        this.dummykey = [];
        this.dummystage = {};
        this.dummystage.w = 800;
        this.dummystage.h = 600;
        this.dummystage.dummy = true;
        this.hp = [];
    }

    init(players,bullets,key,stage){
        this.dummyplayers.splice(0, this.dummyplayers.length);
        this.dummybullets.splice(0, this.dummybullets.length);
        this.hp.splice(0, this.hp.length);
        this.dummykey.splice(0, this.dummykey.length);

        players.forEach((p,i)=>{
            const clone=_.cloneDeep(players[i]);
            this.dummyplayers.push($.extend(true,Object.create(Player.prototype),clone));
            this.hp.push(clone.container.hp);
        });
        bullets.forEach((b,i)=>{
            this.dummybullets.push($.extend(true,Object.create(Bullet.prototype),_.cloneDeep(bullets[i])));
        });
        key.forEach(k=>{
            this.dummykey.push(k);
        });
    }

    test(players,bullets,key,n,stage,m){
        const data=[[],[]];
        this.init(players,bullets,key,stage);
        for (let j=0;j<m;j++){
            this.init(players,bullets,key,stage);
            let score = 0;
            let count=0;
            if(j<m/2){score = this.tick([false,true])*n;}
            else {score = this.tick([false,false])*n;}
            for(let k=1;k<n;k++){
                score += this.tick([false,false])*(n-k);
                if(this.dummyplayers[0].hp<=0 || this.dummyplayers[1].hp<=0)k=n;
            }
            //console.log(count);
            if(j<m/2){data[0].push(score);}
            else {data[1].push(score);}
        }
        const d0 = data[0].reduce( ( pre, curr, i )=> {return pre + curr;}, 0 ) / data[0].length;
        const d1 = data[1].reduce( ( pre, curr, i )=> {return pre + curr;}, 0 ) / data[1].length;
        return d0>d1
    }
    tick(input){
        let score = 0;
        this.dummykey.forEach((k,i)=>{
            if(input[i] && k==0) this.dummykey[i] = 1 ;
            else if(!input[i] && k==2) this.dummykey[i] = 0;
        });
        this.dummyplayers.forEach((p, i) => {
            if(this.dummykey[i] === 1) {
                p.charge = 0;
                p.shot(this.dummystage, this.dummybullets, 1);
            } else if(this.dummykey[i] === 2) {
                p.container.rotation += 3 * p.turn;
                p.charge += 1;
                if(p.container.v > 0.5) p.container.v -= 0.5;
                else p.container.v = 0;
            } else if(p.charge >= 40 && this.dummykey[i] === 0) {
                if(p.charge >= 60) p.charge = 60;
                p.shot(this.dummystage, this.dummybullets, p.charge / 40);
                p.charge = 0;
            }
            p.move(this.dummystage);
        });
        hit_all(this.dummyplayers);
        this.dummybullets.forEach((b, i) => {
            if(b.delete) {
                this.dummybullets.splice(i, 1);
            } else if(b !== undefined) {
                b.move(this.dummystage);
                b.hit(this.dummyplayers);
            }
        });
        this.dummyplayers.forEach((p,i) => {
            if(p.container.hp < this.hp[i]) {
                if(p.id === 0){score += 1;}
                else {score -= 1;}
            }
            if(p.container.hp <= 0) {
                if(p.id === 0){score += 1;}
                else {score -= 1;}
            }
            this.hp[i]=p.container.hp;
        });
        return score;
    }
}
