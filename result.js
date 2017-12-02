const resultInit = (stage, any) => {
    const back = new createjs.Shape();
    back.graphics.beginFill("#EEEEEE").rect(0,0,stage.w,stage.h);
    const winColorString = any.win == 0 ? "あか" : "あお"
    const winColor = any.win == 0 ? "Red" : "Blue"
    const text = new createjs.Text(winColorString + "のかち！", "100px Century Gothic", winColor);
    text.x=stage.w/2-200;
    text.y=stage.h/3;
    const text2 = new createjs.Text("スペースキーをおすと、メニューにもどるよ", "30px Century Gothic", "Black");
    text2.x=stage.w/2-250;
    text2.y=stage.h*3/4;
    stage.addChild(back);
    stage.addChild(text);
    stage.addChild(text2);
};

const resultTick = stage => {
    stage.update();
    if(obj.key[0] === 1) {
        Manager.change("menu");
    }
};
