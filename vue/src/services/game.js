import Api from 'library/api'
import Browser from 'library/Browser'

class _GameApi extends Api {
    constructor() {
        super();
    }
    //获取游戏信息
    getGameInfo(id, success, fail) {
        this.get("/game/homeInfo",{game_id:id,sid:Browser.getSid()}, success, fail)
    }
}
const GameApi = new _GameApi()
export default GameApi
