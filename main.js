'use strict';

const obj={};
const images={};
const Manager = new SceneManager();
obj.key = [0,0,0];

createjs.Ticker.setFPS(30);

const keyHandle = event => {
    //状態、1:押したけど、まだtick回してない、2:押してtick回した、0:押してない
    //0:1人用,1:二人用の1P,2:二人用の2P
    const keys=[32,77,90];
    keys.forEach((key,index)=>{
        if(event.keyCode === key && event.type === "keydown" && obj.key[index] === 0)obj.key[index] = 1;
        else if(event.keyCode === key && event.type === "keyup" && obj.key[index] === 2)obj.key[index] = 0;
    });
};

const init = _ => {
    obj.key = [0,0,0];
    Manager.add(new Scene("title",titleInit,titleTick,_=>{}));
    Manager.add(new Scene("menu",menuInit,menuTick,_=>{}));
    Manager.add(new Scene("game",gameInit,gameLoop,gameEnd));
    Manager.add(new Scene("end",resultInit,resultTick,_=>{}));
    Manager.set("title");
    window.addEventListener("keydown", keyHandle);
    window.addEventListener("keyup", keyHandle);
    createjs.Ticker.addEventListener("tick", tick);
    obj.predict = new Predict();
};

const tick = _ => {
    Manager.tick();
    obj.key.forEach((i,index)=>{
        if(i === 1)obj.key[index] = 2;
    });
};
