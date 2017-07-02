#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
# from urllib.request import urlopen
import urllib
import sys


def getHtml(url):
    page = urllib.urlopen(url)
    html = page.read()
    # de_html = html.decode('utf-8')
    # return de_html[de_html.find('bang_box bang_03'):de_html.find('bang_box bang_04')]
    return html


def getImg(html):
    # reg = r'src="(.+?\.mp3)"'
    reg = r'http.+?\.m4a'
    imgre = re.compile(reg)
    imglist = re.findall(imgre, html)
    fo = open(sys.argv[1] + '/allAudios.js', 'w+')
    fo.write('window.audios = ["' + '","'.join(imglist) + '"]')
    fo.close()
    return imglist

html = getHtml("http://mp3.sogou.com/")
# html = getHtml("http://www.cyzone.cn/a/20170625/312280.html?utm_source=tuicool&utm_medium=referral")

# print(html)
# print('==============')
print(getImg(html))
