import os
import json


def main():
    thisdir = os.path.dirname(os.path.abspath(__file__))
    data_dir = thisdir + '/../public/DATA'
    obj = {
        'objects': {}
    }
    for f in os.listdir(data_dir):
        if f.endswith('.json'):
            with open(data_dir + '/' + f, 'r') as fin:
                content = json.load(fin)
                f_without_json_extension = f[:-len('.json')]
                obj['objects'][f_without_json_extension] = content
    with open(thisdir + '/../public/figurl_data.json', 'w') as fout:
        json.dump(obj, fout, indent=4)


if __name__ == '__main__':
    main()
