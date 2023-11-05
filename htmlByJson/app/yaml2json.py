import json
import pathlib
import yaml

_YAML_ROOT = './yaml'
_JSON_ROOT = './json'

p = pathlib.Path(__file__).parent
jrp = p / _JSON_ROOT
yrp = p / _YAML_ROOT
yrl = len(str(yrp))
#print(yrp)
for yp in yrp.glob('**/*.yaml'):
    print('(R)YAML : {}'.format(str(yp)))
    jp = (jrp / str(yp)[yrl + 1:]).with_suffix('.json')
    print('(W)JSON : {}'.format(str(jp)))
    with yp.open(mode='r', encoding='utf-8') as yf:
        yd = yaml.safe_load(yf)
        #print(json.dumps(d, indent=2))
        with jp.open(mode='w', encoding='utf-8') as jf:
            json.dump(yd, jf, indent=2, ensure_ascii=False)

#[EOF]