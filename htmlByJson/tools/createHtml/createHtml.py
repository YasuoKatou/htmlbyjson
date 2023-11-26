from bs4 import BeautifulSoup
import functools
import os
import pathlib
import yaml

'''
起動時のパラメータ
'''
_template_html_path = './htmlByJson/tools/createHtml/template.html'
#_out_html_path      = './test001.html'
#_out_html_path      = './login001.html'
_out_html_path      = './sample001.html'
_config_path        = './htmlByJson/app/yaml/config.yaml'

class HtmlDocument:
    def __init__(self, template_html_path):
        cwd = pathlib.Path(os.getcwd())
        p = pathlib.Path(cwd / template_html_path)
        with p.open(mode='r', encoding='utf-8') as htmlFile:
            html = htmlFile.read()
        self._soup = BeautifulSoup(html, 'html.parser')
        #print(soup)

    def save(self, out_html_path):
        cwd = pathlib.Path(os.getcwd())
        p = pathlib.Path(cwd / out_html_path)
        with p.open(mode='w', encoding='utf-8') as htmlFile:
            htmlFile.write(self._soup.prettify())

    def createElement(self, element_name, **attr):
        return self._soup.new_tag(element_name, **attr)

    @property
    def head(self):
        #head = self._soup.find('head')
        #print(head)
        return self._soup.find('head')

    @property
    def body(self):
        return self._soup.find('body')

class CreateHtml:
    def __init__(self, html_document):
        self._document = html_document
        self._cssPathList = []
        self._configValues = {
            'css': {
                'default': {
                    'layout': {
                        'flow': {
                            'direction': {
                                'horizon': 'HBJ-LAYOUT-H001',
                                'vertical': 'HBJ-LAYOUT-V001',
                            }
                        }
                    }
                }
            }
        }
        self._tagId = 0

    @property
    def nexId(self) :
        self._tagId += 1
        return 'ID-{:06}'.format(self._tagId)

    def appendCss(self, list):
        head = self._document.head
        for item in list:
            if item in self._cssPathList:
                continue
            link = self._document.createElement('link',
                rel = 'stylesheet', type = 'text/css', href = item)
            head.append(link)

    def _readYaml(self, path):
        cwd = pathlib.Path(os.getcwd())
        p = cwd / path
        with p.open(mode='r', encoding='utf-8') as yf:
            yd = yaml.safe_load(yf)
        return yd

    def _childs(f):
        @functools.wraps(f)
        def _wrapper(*args, **keywords):
            v = f(*args, **keywords)
            item = args[2]
            if 'child' in item:
                args[0]._create(v, item['child'])
            return v
        return _wrapper

    def _import(self, parent, item):
        yd = self._readYaml(item)
        if 'css' in yd:
            self.appendCss(yd['css'])
        if 'child' in yd:
            self._create(parent, yd['child'])

    def _setAttr(self, element, attr):
        if 'id' in attr:
            element['id'] = attr['id']
        if 'css' in attr:
            css = attr['css']
            if isinstance(css, str):
                element['class'] = css
            elif isinstance(css, list):
                element['class'] = css.join(' ')

    def _createBlockLabel(self, parent, item):
        p = self._document.createElement('p')
        p.string = item['text']
        self._setAttr(p, item)
        parent.append(p)

    def _createButton(self, parent, item):
        btn = self._document.createElement('button')
        if 'caption' in item:
            btn.string = item['caption']
        self._setAttr(btn, item)
        parent.append(btn)

    def _createCheckbox(self, parent, item):
        id = self.nexId
        cbx = self._document.createElement('input', type='checkbox')
        self._setAttr(cbx, item)
        cbx['id'] = id
        parent.append(cbx)

        if 'label' in item:
            label_item = item['label']
            label = self._document.createElement('label')
            self._setAttr(label, label_item)
            if 'text' in label_item:
                label.string = label_item['text']
            label['for'] = id
            parent.append(label)

    @_childs
    def _createFlowlayout(self, parent, item):
        div = self._document.createElement('div')
        self._setAttr(div, item)
        default_css = self._configValues['css']['default']['layout']['flow']['direction'][item['direction']]
        if 'class' in div.attrs:
            div['class'] += ' {}'.format(default_css)
        else:
            div['class'] = default_css
        parent.append(div)
        return div

    @_childs
    def _createDiv(self, parent, item):
        div = self._document.createElement('div')
        self._setAttr(div, item)
        parent.append(div)
        return div

    @_childs
    def _createGroupbox(self, parent, item):
        legend = self._document.createElement('legend')
        if 'title' in item:
            legend.string = item['title']
        fieldset = self._document.createElement('fieldset')
        fieldset.append(legend)
        self._setAttr(fieldset, item)
        parent.append(fieldset)
        return fieldset

    def _createLabel(self, parent, item):
        label = self._document.createElement('label')
        if 'text' in item:
            label.string = item['text']
        self._setAttr(label, item)
        parent.append(label)
        return label

    def _createTextbox(self, parent, item, input_type):
        if 'label' in item:
            self._createLabel(parent, item['label'])
        inp = self._document.createElement('input', type=input_type)
        self._setAttr(inp, item)
        if 'placeholder' in item:
            inp['placeholder'] = item['placeholder']
        parent.append(inp)

    def _create(self, parent, child):
        for item in child:
            if 'import' in item:
                self._import(parent, item['import'])
            elif 'block-label' in item:
                self._createBlockLabel(parent, item['block-label'])
            elif 'button' in item:
                self._createButton(parent, item['button'])
            elif 'checkbox' in item:
                self._createCheckbox(parent, item['checkbox'])
            elif 'div' in item:
                self._createDiv(parent, item['div'])
            elif 'flow-layout' in item:
                self._createFlowlayout(parent, item['flow-layout'])
            elif 'groupbox' in item:
                self._createGroupbox(parent, item['groupbox'])
            elif 'password' in item:
                self._createTextbox(parent, item['password'], 'password')
            elif 'textbox' in item:
                self._createTextbox(parent, item['textbox'], 'text')

    def create(self, config_path=None, yaml=None):
        yd = self._readYaml(config_path)
        parent = None
        if 'root' in yd:
            parent = self._document.body
        if 'css' in yd:
            self.appendCss(yd['css'])
        if 'child' in yd:
            self._create(parent, yd['child'])

    def save(self, out_html_path):
        self._document.save(out_html_path)


if __name__ == '__main__':
    #path = os.getcwd()
    #print(path)
    document = HtmlDocument(_template_html_path)
    creator = CreateHtml(document)
    creator.create(_config_path)
    creator.save(_out_html_path)

#[EOF]