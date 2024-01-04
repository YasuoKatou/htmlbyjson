class Pager {
    constructor() {

    }
    initPage() {
        console.info('start initPage.');
    }
    changePage(activePageId) {
        document.querySelectorAll('.wrap-page').forEach(element => {
            if (element.id === activePageId) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    }
}
window.addEventListener('load', (event) => {
    let p = new Pager();
    p.initPage()
    let wk = new EventConfig();
    wk.setEvent(p);
});