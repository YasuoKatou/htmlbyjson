class EventConfig extends EventConfigBase {
    #eventMap = {};
    constructor() {
        super();
    }
    setEvent() {
        console.log('start EventConfig.setEvent()');
        // TODO createHtml.pyで自動作成すること
        let tag;
        tag = document.getElementById('national-lang-jpn-101');
        tag.addEventListener('click', this._clickEvent);
        tag = document.getElementById('national-lang-jpn-201');
        tag.addEventListener('click', this._clickEvent);
        tag = document.getElementById('math-1');
        tag.addEventListener('click', this._clickEvent);
        tag = document.getElementById('math-2A');
        tag.addEventListener('click', this._clickEvent);
        tag = document.getElementById('math-2B');
        tag.addEventListener('click', this._clickEvent);
        tag = document.getElementById('math-3');
        tag.addEventListener('click', this._clickEvent);
    }
}