class EventConfigBase {
    constructor() {

    }
    _clickEvent(event) {
        let id = 'None';
        if (event && ('target' in event) && ('id' in event.target)) {
            id = event.target.id;
        }
        console.log('start click event id:' + id);
    }
}