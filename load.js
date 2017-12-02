const loadInit = _ => {
    // LoadQueueのインスタンス作成
    // 引数にfalseを指定するとXHRを使わずtagによる読み込みを行います
    const queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);

    // 読み込むファイルの登録。
    const manifest = [
        {"src":"./src/mainbeem1.png","id":"mainbeem1"},
        {"src":"./src/mainbeem2.png","id":"mainbeem2"},
        {"src":"./src/charge1.png","id":"charge1"},
        {"src":"./src/charge2.png","id":"charge2"},
        {"src":"./src/beem.mp3","id":"beamse"},
        {"src":"./src/shock.mp3","id":"shock"},
        {"src":"./src/click.mp3","id":"click"},
        {"src":"./src/countdown.mp3","id":"count"}
    ];

    // ファイルが1つ読込完了すると呼ばれる。引数にファイルの読込結果を含むオブジェクトが渡される
    const handleFileLoad = (event) =>{
        const item = event.item;
        if(item.type === createjs.LoadQueue.IMAGE){
            images[item.id] = event.result;
        }
    }

    // ファイルがすべて読込完了すると呼ばれる
    const handleComplete = (event) =>{
        init();
    }
    // ファイルが1つ読込完了するたびにfileloadイベントが発生
    // fileloadイベントにメソッドを割り当てる
    queue.addEventListener("fileload",handleFileLoad);
    // 全ファイルの読み込みが終わった時completeイベントが発生する
    queue.addEventListener("complete",handleComplete);
    // manifestの読込
    queue.loadManifest(manifest,true);

}
