// alert('hello html by json core !!');

class HtmlByJson {

    #configValues = undefined;
    #idManager = undefined;
    #loader = undefined;
    #cssPathList = undefined

    constructor() {
        this.#configValues = {
            css: {default: {layout: {flow: {direction: {horizon: 'HBJ-LAYOUT-H001'
                                                       ,vertical: 'HBJ-LAYOUT-V001'}}}}}
        };
        this.#cssPathList = [];
        this.#idManager = new this.#RandomManager();
        this.#loader = new this.#LoaderManager(this);
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

    start() {
        // alert('HtmlByJson.start');
        this.fireReadConfig(this.configPath, document.body);
    }

    /**
     * 画面定義ファイルのパスを取得
     */
    get configPath() {return './htmlByJson/app/config.json';}

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

    appendStyle(element, attr) {
        if ('css' in attr) {
            element.classList.add(attr.css);
        }
    }

    /**
     * ラベルコンポーネントを作成する
     * @param {*} attr ラベルコンポーネントの属性
     * @returns pタグ
     */
    createBlockLabelElement(attr) {
        let p = document.createElement('p');
        p.appendChild(document.createTextNode(attr['text']));
        return p;
    }

    createLabelElement(attr) {
        let label = document.createElement('label');
        label.appendChild(document.createTextNode(attr['text']));
        this.appendStyle(label, attr);
        return label;
    }

    createDivElement(attr) {
        let div = document.createElement('div');
        if ('css' in attr) {
            div.classList.add(attr.css);
        }
        return div;
    }

    createTextboxElement(attr) {
        let inp = document.createElement('input');
        inp.setAttribute("type", "text");
        if ('placeholder' in inp) {
            if ('placeholder' in attr) {
                inp.placeholder = attr['placeholder'];
            }
        }
        return inp;
    }

    createCheckboxElement(attr) {
        let id = this.#idManager.idBySequence;
        // alert(id);
        let label = this.createLabelElement(attr['label']);
        label.htmlFor = id;
        let cbx = document.createElement('input');
        cbx.setAttribute("type", "checkbox");
        cbx.id = id;
        label.prepend(cbx);     // 視覚をラベルの左に追加
        return label;
    }

    createGroupboxElement(attr) {
        let legend = document.createElement('legend');
        legend.appendChild(document.createTextNode(attr['title']));
        let fieldset = document.createElement('fieldset');
        fieldset.appendChild(legend);
        if ('child' in attr) {
            this.creaeHTML(fieldset, attr.child);
        }
        this.appendStyle(fieldset, attr);
        return fieldset;
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
        // alert(JSON.stringify(data));
        // alert(parent);
        for (let item of data) {
            if ('block-label' in item) {
                parent.appendChild(this.createBlockLabelElement(item['block-label']));
            } else if ('div' in item) {
                parent.appendChild(this.createDivElement(item['div']));
            } else if ('textbox' in item) {
                let wk = item['textbox'];
                if ('label' in wk) {
                    parent.appendChild(this.createLabelElement(wk.label));
                }
                parent.appendChild(this.createTextboxElement(wk));
            } else if ('checkbox' in item) {
                parent.appendChild(this.createCheckboxElement(item['checkbox']));
            } else if ('flow-layout' in item) {
                let key = 'flow-layout';
                let layout = new this.#Layout(this);
                parent.appendChild(layout.getLayout(key, item[key]));
            } else if ('groupbox' in item) {
                parent.appendChild(this.createGroupboxElement(item['groupbox']));
            } else if ('import' in item) {
                this.#loader.loadConfig(item.import, parent);
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

    #Layout = class  {
        #core = undefined;
        constructor(core) {
            this.#core = core;
        }

        getLayout(layoutType, attr) {
            if (layoutType === 'flow-layout') {
                let element = document.createElement('div');
                element.classList.add(this.#core.getFlowLayoutStyle(attr['direction']));
                if ('child' in attr) {
                    this.#core.creaeHTML(element, attr.child);
                }
                return element;
            }
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
            alert('TODO terminated event');
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