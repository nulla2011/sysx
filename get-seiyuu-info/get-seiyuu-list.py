from requests_html import HTMLSession
import time
import csv

SEIYUU_URL = "https://zh.moegirl.org.cn/Template:%E5%A3%B0%E4%BC%98%E5%87%BA%E7%94%9F%E5%B9%B4%E4%BB%A3%E7%B4%A2%E5%BC%95"


def hasLettersAndDot(string):
    for char in string:
        if char.encode('UTF-8').isalpha():
            return True
        if char == "·":
            return True
    return False


if __name__ == "__main__":
    seiyuuList = []
    session = HTMLSession()
    r = session.get(SEIYUU_URL)
    nameList60 = r.html.find(
        ".navbox .nowraplinks.mw-collapsible tr:nth-child(9) .nowraplinks.mw-collapsible .navbox-list p:nth-child(1) a"
    )
    nameList70 = r.html.find(
        ".navbox .nowraplinks.mw-collapsible tr:nth-child(11) .nowraplinks.mw-collapsible .navbox-list p:nth-child(1) a"
    )
    nameList80 = r.html.find(
        ".navbox .nowraplinks.mw-collapsible tr:nth-child(13) .nowraplinks.mw-collapsible .navbox-list p:nth-child(1) a"
    )
    nameList90 = r.html.find(
        ".navbox .nowraplinks.mw-collapsible tr:nth-child(15) .nowraplinks.mw-collapsible .navbox-list p:nth-child(1) a"
    )
    nameList00 = r.html.find(
        ".navbox .nowraplinks.mw-collapsible tr:nth-child(17) .nowraplinks.mw-collapsible .navbox-list p:nth-child(1) a"
    )
    nameListNu = r.html.find(
        ".navbox .nowraplinks.mw-collapsible tr:nth-child(21) .nowraplinks.mw-collapsible .navbox-list p:nth-child(1) a"
    )
    for name in [*nameList60, *nameList70, *nameList80, *nameList90, *nameList00, *nameListNu]:
        #if not hasLettersAndDot(name.text):  #去掉含英文的名字和带点的外文名字
        if not (name.attrs.get('class')):  #去掉没页面的
            seiyuuList.append([name.text, (list(name.absolute_links))[0]])
    with open(f'seiyuu-list_{time.strftime("%y%m%d", time.localtime()) }.csv', 'w', encoding='utf-8', newline='') as c:
        w = csv.writer(c)
        w.writerows(seiyuuList)
