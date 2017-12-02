const hit_all = (players) => {
    players.forEach((p1, index1, players_off) => {
        players_off.slice(index1).forEach((p2, index2) => {
            if(p1 !== p2) {
                const distance = Math.sqrt(Math.pow(p1.container.x - p2.container.x, 2) + Math.pow(p1.container.y - p2.container.y, 2));
                if(distance < p2.r + p1.r) {
                    const overlap = p2.r + p1.r - distance;
                    const v = new Vec(p2.container.x - p1.container.x, p2.container.y - p1.container.y); //x,yのベクトル
                    const aNormUint = v.mul(1 / distance); //正規化、2円の法線ベクトル(p1->p2)
                    const bNormUint = aNormUint.mul(-1); //上の*(-1)
                    //重なった部分を押しもどす
                    p2.container.x += aNormUint.x * overlap / 2;
                    p2.container.y += aNormUint.y * overlap / 2;
                    p1.container.x += bNormUint.x * overlap / 2;
                    p1.container.y += bNormUint.y * overlap / 2;
                    //90°回転させた、法線ベクトル
                    const aTangUint = new Vec(aNormUint.y * -1, aNormUint.x * 1);
                    const bTangUint = new Vec(bNormUint.y * -1, bNormUint.x * 1);
                    p2.vec = new Vec(p2.container.v * Math.cos(p2.container.theta * Math.PI / 180), p2.container.v * Math.sin(p2.container.theta * Math.PI / 180));
                    p1.vec = new Vec(p1.container.v * Math.cos(p1.container.theta * Math.PI / 180), p1.container.v * Math.sin(p1.container.theta * Math.PI / 180));
                    const aNorm = aNormUint.mul(aNormUint.dot(p2.vec));
                    const aTang = aTangUint.mul(aTangUint.dot(p2.vec));
                    const bNorm = bNormUint.mul(bNormUint.dot(p1.vec));
                    const bTang = bTangUint.mul(bTangUint.dot(p1.vec));
                    const p2_x = bNorm.x + aTang.x;
                    const p2_y = bNorm.y + aTang.y;
                    if(Math.sqrt((p2_x * p2_x) + (p2_y * p2_y)) - p2.container.v > 0) {
                        //p2.container.hp-=Math.sqrt((p2_x*p2_x)+(p2_y*p2_y))-p2.container.v;
                    }
                    p2.container.v = Math.sqrt((p2_x * p2_x) + (p2_y * p2_y));
                    p2.container.a = 0;
                    p2.container.theta = Math.atan2(p2_x, p2_y) * 180 / Math.PI;
                    const p1_x = aNorm.x + bTang.x;
                    const p1_y = aNorm.y + bTang.y;
                    if(Math.sqrt((p1_x * p1_x) + (p1_y * p1_y)) - p1.container.v > 0) {
                        //p1.container.hp-=Math.sqrt((p1_x*p1_x)+(p1_y*p1_y))-p1.container.v;
                    }
                    p1.container.v = Math.sqrt((p1_x * p1_x) + (p1_y * p1_y));
                    p1.container.a = 0;
                    p1.container.theta = Math.atan2(p1_x, p1_y) * 180 / Math.PI;
                }
            }
        })
    });
};
