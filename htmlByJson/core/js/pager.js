class Pager {
    constructor() {

    }
    initPage() {
        console.info('start initPage.');
    }
}
window.addEventListener('load', (event) => {
    window._pager = new Pager();
    window._pager.initPage()
    let wk = new EventConfig();
    wk.setEvent();
});