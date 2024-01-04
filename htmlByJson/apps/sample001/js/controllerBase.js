class ControllerBase {
    #_pager;
    constructor(pager) {
        this.#_pager = pager;
    }
    preparePageChange(activePageId, event) {
        let page = document.getElementById(activePageId);
        let wk = page.getElementsByClassName('subject-header-style');
        Array.from(wk).forEach(element => {
            element.dataset.subject = "【" + event.target.innerText + "】";
        });
    }
    selectSubject(activePageId) {
        this.#_pager.changePage(activePageId);
    }
}