const titleInit = (stage) => {
    /*const back = new createjs.Shape();
    back.graphics.beginFill("Gray").rect(0,0,stage.w,stage.h);
    stage.addChild(back);*/
    const text = new createjs.Text("ビーム撃つやつ(仮)", "80px Century Gothic", "White");
    text.x=30;
    text.y=stage.h/4;
    const text2 = new createjs.Text("ひとりでやるならスペースキーでビームをうてるよ", "30px Century Gothic", "White");
    const text3 = new createjs.Text("ふたりでやるならZキーとMキーでビームがうてるよ", "30px Century Gothic", "White");
    const text4 = new createjs.Text("スペースキーではじまるよ", "30px Century Gothic", "White");
    text2.x=90;
    text2.y=400;
    text3.x=90;
    text3.y=450;
    text4.x=90;
    text4.y=500;
    stage.addChild(text);
    stage.addChild(text2);
    stage.addChild(text3);
    stage.addChild(text4);
};

const titleTick = stage => {
    stage.update();
    if(obj.key[0]===1)Manager.change("menu");
};
