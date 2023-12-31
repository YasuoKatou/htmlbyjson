class MathController {
    _naviClicked(event) {
        let id = 'None';
        if (event && ('target' in event) && ('id' in event.target)) {
            id = event.target.id;
        }
        console.info('start click event id:' + id + '(' + this.constructor.name + ')');
    }
    naviClicked() {
        const self = this;
        return function(event) {
            setTimeout(function() {
                self._naviClicked(event);
            }, 0);
        }
    }
}