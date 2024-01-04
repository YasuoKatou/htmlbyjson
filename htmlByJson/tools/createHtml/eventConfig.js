/**
 * アプリケーションのイベントを設定するテンプレートクラス
 */
/** start */
/**
 * createHtml.pyにより自動生成されたクラス.
 */
class EventConfig extends EventConfigBase {
    #eventMap = {};
    constructor() {
        super();
        /** set event classes */
    }
    _setClickEvent(eventType, events, clsList, pager) {
        let obj;
        for (let item of events) {
            let tag = document.getElementById(item['id']);
            let className = item['class'];
            if (className in clsList) {
                obj = clsList[className];
            } else {
                console.info('create ' + className);
                let F = Function('return (' + className + ')')();
                obj = new F(pager);
                clsList[className] = obj;
            }
            let m = Reflect.get(obj, item['method']);
            tag.addEventListener(eventType, m.call(obj));
        }
        return clsList;
    }
    setEvent(pager) {
        console.log('start EventConfig.setEvent()');
        let clsList = {};
        for (let eventType in this.#eventMap) {
            console.info('event type : ' + eventType);
            if (eventType === 'click') {
                clsList = this._setClickEvent(eventType, this.#eventMap[eventType], clsList, pager);
            }
        }
    }
}
/** end */