// alert('hello html by json core !!');

class HtmlByJson {

    #configValues = undefined;
    #idManager = undefined;
    #loader = undefined;
    #cssPathList = undefined
    #tagCreators = undefined

    constructor() {
        this.#configValues = {
            css: {default: {layout: {flow: {direction: {horizon: 'HBJ-LAYOUT-H001'
                                                       ,vertical: 'HBJ-LAYOUT-V001'}}}}}
        };
        this.#cssPathList = [];
        this.#idManager = new this.#RandomManager();
        this.#loader = new this.#LoaderManager(this);
        this._initTagCreators();
        
        document.addEventListener('HBJ_ReadConfig', function(event) {
            // alert('event : HBJ_ReadConfig');
            let option = event.detail;
            option.self.readConfig(option.configPath, option.parent);
        });
        document.addEventListener('HBJ_ViewByConfig', function(event) {
            // alert('event : HBJ_ViewByConfig : ' + event.detail.self.constructor.name);
            // alert('event : HBJ_ViewByConfig : ' + JSON.stringify(event.detail.json));
            // alert('event : HBJ_ViewByConfig : ' + event.detail.parent);
            let option = event.detail;
            option.self.doCreateHTML(option.parent, option.json);
        });
    }

    get nextId() { return this.#idManager.idBySequence; }

    #TagCreatorBase = class {
        #owner = undefined
        constructor(owner) {
            this.#owner = owner
        }
        setCss(tag, attr) {
            if ('css' in attr) {
                tag.classList.add(attr.css);
            }
        }
        createTextNode(s) {
            return document.createTextNode(s);
        }
        appendChild(parent, tag) { parent.appendChild(tag); }
    }

    #BlockLabelCreator = class {
        constructor(owner) { this.owner = owner; }
        createTag(parent, attr) {
            let p = document.createElement('p');
            p.appendChild(this.createTextNode(attr['text']));
            this.setCss(p, attr);
            this.appendChild(parent, p);
            return p;
        }
    }
    #ButtonCreator = class {
        constructor(owner) { this.owner = owner; }
        createTag(parent, attr) {
            let btn = document.createElement('button');
            if ('caption' in attr) {
                btn.innerHTML = attr.caption;
            }
            this.setCss(btn, attr);
            this.appendChild(parent, btn);
            return btn;
        }
    }
    #CheckboxCreator = class {
        constructor(owner) { this.owner = owner; }
        createTag(parent, attr) {
            let id = this.owner.#idManager.idBySequence;
            // alert(id);
            let label = this.createLabel(undefined, attr['label']);
            label.htmlFor = id;
            let cbx = document.createElement('input');
            cbx.setAttribute('type', 'checkbox');
            this.setCss(cbx, attr)
            cbx.id = id;
            label.prepend(cbx);     // 四角形をラベルの左に追加
            this.appendChild(parent, label);
            return label;
        }
    }
    #DivCreator = class {
        constructor(owner) { this.owner = owner; }
        createTag(parent, attr) {
            let div = document.createElement('div');
            this.setCss(div, attr);
            this.appendChild(parent, div);
            return div;
        }
    }
    #FlowlayoutCreator = class {
        constructor(owner) { this.owner = owner; }
        createTag(parent, attr) {
            let element = document.createElement('div');
            element.classList.add(this.owner.getFlowLayoutStyle(attr['direction']));
            this.setCss(element, attr);
            this.appendChild(parent, element);
            return element;
        }
    }
    #GroupboxCreator = class {
        constructor(owner) { this.owner = owner; }
        createTag(parent, attr) {
            let legend = document.createElement('legend');
            legend.appendChild(this.createTextNode(attr['title']));
            let fieldset = document.createElement('fieldset');
            fieldset.appendChild(legend);
            this.setCss(fieldset, attr);
            this.appendChild(parent, fieldset);
            return fieldset;
        }
    }
    #LabelCreator = class {
        constructor(owner) { this.owner = owner; }
        createTag(parent, attr) {
            let label = document.createElement('label');
            label.appendChild(document.createTextNode(attr['text']));
            this.setCss(label, attr);
            if (parent) {
                this.appendChild(parent, label);
            }
            return label;
        }
    }
    #PasswordCreator = class {
        constructor(owner) { this.owner = owner; }
        createTag(parent, attr) {
            if ('label' in attr) {
                this.createLabel(parent, attr.label);
            }
            let inp = document.createElement('input');
            inp.setAttribute("type", "password");
            this.setCss(inp, attr);
            if ('placeholder' in inp) {
                if ('placeholder' in attr) {
                    inp.placeholder = attr['placeholder'];
                }
            }
            this.appendChild(parent, inp);
            return inp;
        }
    }
    #TextboxCreator = class {
        constructor(owner) { this.owner = owner; }
        createTag(parent, attr) {
            if ('label' in attr) {
                this.createLabel(parent, attr.label);
            }
            let inp = document.createElement('input');
            inp.setAttribute("type", "text");
            this.setCss(inp, attr);
            if ('placeholder' in inp) {
                if ('placeholder' in attr) {
                    inp.placeholder = attr['placeholder'];
                }
            }
            this.appendChild(parent, inp);
            return inp;
        }
    }
    _initTagCreators() {
        this.#tagCreators = {};

        Object.setPrototypeOf(this.#BlockLabelCreator.prototype, this.#TagCreatorBase.prototype);
        this.#tagCreators['block-label'] = new this.#BlockLabelCreator(this);

        Object.setPrototypeOf(this.#ButtonCreator.prototype, this.#TagCreatorBase.prototype);
        this.#tagCreators['button'] = new this.#ButtonCreator(this);

        Object.setPrototypeOf(this.#CheckboxCreator.prototype, this.#TagCreatorBase.prototype);
        this.#CheckboxCreator.prototype.createLabel = this.#LabelCreator.prototype.createTag;
        this.#tagCreators['checkbox'] = new this.#CheckboxCreator(this);

        Object.setPrototypeOf(this.#DivCreator.prototype, this.#TagCreatorBase.prototype);
        this.#tagCreators['div'] = new this.#DivCreator(this);

        Object.setPrototypeOf(this.#FlowlayoutCreator.prototype, this.#TagCreatorBase.prototype);
        this.#tagCreators['flow-layout'] = new this.#FlowlayoutCreator(this);

        Object.setPrototypeOf(this.#GroupboxCreator.prototype, this.#TagCreatorBase.prototype);
        this.#tagCreators['groupbox'] = new this.#GroupboxCreator(this);

        Object.setPrototypeOf(this.#LabelCreator.prototype, this.#TagCreatorBase.prototype);
        this.#tagCreators['label'] = new this.#LabelCreator(this);

        Object.setPrototypeOf(this.#PasswordCreator.prototype, this.#TagCreatorBase.prototype);
        this.#PasswordCreator.prototype.createLabel = this.#LabelCreator.prototype.createTag;
        this.#tagCreators['password'] = new this.#PasswordCreator(this);

        Object.setPrototypeOf(this.#TextboxCreator.prototype, this.#TagCreatorBase.prototype);
        this.#TextboxCreator.prototype.createLabel = this.#LabelCreator.prototype.createTag;
        this.#tagCreators['textbox'] = new this.#TextboxCreator(this);
    }

    start() {
        // alert('HtmlByJson.start');
        this.fireReadConfig(this.configPath, document.body);
    }

    /**
     * 画面定義ファイルのパスを取得
     */
    get configPath() {return './htmlByJson/app/json/config.json';}

    set config(value) {
        // TODO クラス変数の値を上書きすること
    }

    getFlowLayoutStyle(direction) {
        // alert(JSON.stringify(this.#configValues));
        return this.#configValues.css.default.layout.flow.direction[direction];
    }

    /**
     * スタイルシートを読み込む
     * @param {*} list 
     */
    loadCss(list) {
        let headTag = document.head;
        for (let path of list) {
            if (this.#cssPathList.includes(path)) {
                console.info('css path [' + path + '] exists.');
                continue;
            }
            let css = document.createElement('link');
            css.setAttribute('rel', 'stylesheet');
            css.setAttribute('type', 'text/css');
            css.setAttribute('href', path);
            headTag.appendChild(css)
            this.#cssPathList.push(path);
        }
    }

    doCreateHTML(parent, data) {
        // alert('HtmlByJson.doCreateHTML');
        if ('css' in data) {
            this.loadCss(data.css);
        }
        if ('config' in data) {
            this.config = data.config;
        }
        if ('child' in data) {
            this.creaeHTML(parent, data.child);
        } else {
            this.creaeHTML(parent, data);
        }
        try {
            this.#loader.terminatedLoadConfig(parent);
        } catch(error) {
            alert('HtmlByJson.doCreateHTML : ' + error);
        }
    }

    creaeHTML(parent, data) {
        for (let item of data) {
            let key = Object.keys(item)[0];
            let attr = item[key];
            if (key in this.#tagCreators) {
                let element = this.#tagCreators[key].createTag(parent, attr);
                if ('child' in attr) {
                    this.creaeHTML(element, attr.child);
                }
            } else if (key === 'import') {
                this.#loader.loadConfig(attr, parent);
            } else {
                alert(key + ' is not supported.');
            }
        }
    }

    #RandomManager = class {
        #MAX_ID_RANDAM_DIGIT = undefined;
        #MAX_ID_RANDAM_BASE = undefined;
        #idList = undefined;
        #idMax = undefined;
        #PREFIX = undefined;
        constructor() {
            this.#MAX_ID_RANDAM_DIGIT = 5;
            this.#MAX_ID_RANDAM_BASE = (this.#MAX_ID_RANDAM_DIGIT - 1) * 10;
            this.#idMax = -1;
            this.#idList = [];
            this.#PREFIX = 'ID-';
        }

        get idByRandom() {
            let intVal = Math.floor(Math.random() * this.#MAX_ID_RANDAM_BASE);
            if (intVal in this.#idList) {
                this.#idMax = this.#idMax + 1;
                intVal = this.#idMax;
            } else  if (this.#idMax < intVal) {
                this.#idMax = intVal;
            }
            this.#idList.push(intVal);
            return this.#PREFIX + ('0'.repeat(this.#MAX_ID_RANDAM_DIGIT) + intVal).slice(-this.#MAX_ID_RANDAM_DIGIT);
        }

        get idBySequence() {
            this.#idMax = this.#idMax + 1;
            return this.#PREFIX + ('0'.repeat(this.#MAX_ID_RANDAM_DIGIT) + this.#idMax).slice(-this.#MAX_ID_RANDAM_DIGIT);
        }
    };

    fireReadConfig(path, parent) {
        document.dispatchEvent(
            new CustomEvent('HBJ_ReadConfig', {
                detail: {
                    configPath: path,
                    parent: parent,
                    self: this
                }
            })
        );
    }

    readConfig(path, parent) {
        try {
            // alert('HtmlByJson.readConfig : ' + path);
            console.info('HtmlByJson.readConfig : ' + path)
            this.#loader.loadConfig(path, parent);
        } catch(error) {
            alert('at HtmlByJson.readConfig : ' + error);
        }
    }

    #LoaderManager = class {
        core = undefined;
        loaderList = undefined;

        constructor(core) {
            this.core = core;
            this.loaderList = [];
        }

        loadConfig(path, parent) {
            let loader = null;
            for (let item of this.loaderList) {
                if (item.configPath === path) {
                    loader = item;
                    break;
                }
            }
            if (loader === null) {
                loader = new this.#ViewConfigLoader(this.core, path);
            }
            this.loaderList.push(loader);
            try {
                loader.doRead(parent);
            } catch(error) {
                alert('at LoaderManager.loadConfig : ' + error);
            }
        }

        terminatedLoadConfig(parent) {
            for (let item of this.loaderList) {
                if (item.terminated(parent)) {
                    break;
                }
            }
            for (let item of this.loaderList) {
                if (item.waitLoad()) {
                    return;
                }
            }
            console.info('TODO terminated event');
        }

        #ViewConfigLoader = class {
            core = undefined;
            path = undefined;
            parentList = undefined;
            readStatus = undefined;
            constructor(core, path) {
                this.core = core;
                this.path = path;
                this.parentList = [];
                this.readStatus = -2;
            }
            get configPath() {return this.path}
            readJson(self, data) {
                self.readStatus = 0;
                // alert('#ViewConfigLoader.readJson : ' + JSON.stringify(data));
                document.dispatchEvent(
                    new CustomEvent('HBJ_ViewByConfig', {
                        detail: {
                            json: data,
                            parent: this.parentList[0],
                            self: this.core
                        }
                    })
                );
            }
            readError(self, reason) {
                self.readStatus = 1;
                alert(reason);
            }
            doRead(parent) {
                if (this.readStatus === -2) {
                    this.readStatus = -1;
                    this.parentList.push(parent);
                    fetch(this.path)
                        .then(res => {
                            // alert(res.status + ':' + res.statusText);
                            if (res.ok) {
                                return res.json();
                            } else {
                                let message = this.path + ' '  + res.statusText;
                                console.error(message);
                                throw new Error(message);
                            }
                        })
                        .then(data => {
                            this.readJson(this, data);
                        })
                        .catch(error => {
                            console.error(error);
                            this.readError(this, error);
                        });
                }
            }

            terminated(parent) {
                if (this.parentList.includes(parent)) {
                    this.parentList.shift();
                    return true;
                }
                return false;
            }

            waitLoad() {
                if (this.readStatus > 0) {  // error
                    return false;
                } else if (this.readStatus < 0) {   // reading
                    return true;
                }
                if (this.parentList.length > 0) {   // terminated
                    return true;
                }
                return false;
            }
        };
    };
}
// alert('start !!');

try {
    let _obj = new HtmlByJson();
    _obj.start();
} catch(error) {
    alert('HtmlByJson error in constructor : ' + error)
}
// [EOF]