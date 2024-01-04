class MathController extends ControllerBase {
    #_MY_PAGE_ID = 'math-page';
    constructor(pager) {
        super(pager);
    }
    _selectSubject(event) {
        let id = 'None';
        if (event && ('target' in event) && ('id' in event.target)) {
            id = event.target.id;
        }
        console.info('start click event id:' + id + '(' + this.constructor.name + ')');
        super.preparePageChange(this.#_MY_PAGE_ID, event);
        super.selectSubject(this.#_MY_PAGE_ID);
    }
    naviClicked() {
        const self = this;
        return function(event) {
            setTimeout(function() {
                self._selectSubject(event);
            }, 0);
        }
    }
}