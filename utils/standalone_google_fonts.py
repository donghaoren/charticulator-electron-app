import requests
import base64
import re

URL = "https://fonts.googleapis.com/css?family=Lato:300,300i,400,400i,700,700i%7CInconsolata:400,700"


def download_url_to_dataurl(url):
    resp = requests.get(url)
    b64 = base64.b64encode(resp.content)
    mime = resp.headers['content-type']
    return "url(data:%s;base64,%s)" % (mime, b64)


css = requests.get(URL).text
regex = re.compile(r'url\((.*?)\)')
css = regex.sub(lambda m: download_url_to_dataurl(m.group(1)), css)

with open("resources/fonts.css", "w") as f:
    f.write(css)
