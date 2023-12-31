/**
 * createHtml.pyにより自動生成されたクラス.
 */
class EventConfig extends EventConfigBase {
    #eventMap = {};
    constructor() {
        super();
        this.#eventMap['click'] = [];
        this.#eventMap['click'].push({'id': 'national-lang-jpn-101', 'class': 'NationalLangJpnController', 'method': 'naviClicked'});
        this.#eventMap['click'].push({'id': 'national-lang-jpn-201', 'class': 'NationalLangJpnController', 'method': 'naviClicked'});
        this.#eventMap['click'].push({'id': 'math-1', 'class': 'MathController', 'method': 'naviClicked'});
        this.#eventMap['click'].push({'id': 'math-2A', 'class': 'MathController', 'method': 'naviClicked'});
        this.#eventMap['click'].push({'id': 'math-2B', 'class': 'MathController', 'method': 'naviClicked'});
        this.#eventMap['click'].push({'id': 'math-3', 'class': 'MathController', 'method': 'naviClicked'});
    }
    _setClickEvent(eventType, events, clsList) {
        let obj;
        for (let item of events) {
            let tag = document.getElementById(item['id']);
            let className = item['class'];
            if (className in clsList) {
                obj = clsList[className];
            } else {
                console.info('create ' + className);
                let F = Function('return (' + className + ')')();
                obj = new F();
                clsList[className] = obj;
            }
            let m = Reflect.get(obj, item['method']);
            tag.addEventListener(eventType, m.call(obj));
        }
        return clsList;
    }
    setEvent() {
        console.log('start EventConfig.setEvent()');
        let clsList = {};
        for (let eventType in this.#eventMap) {
            console.info('event type : ' + eventType);
            if (eventType === 'click') {
                clsList = this._setClickEvent(eventType, this.#eventMap[eventType], clsList);
            }
        }
    }
}
