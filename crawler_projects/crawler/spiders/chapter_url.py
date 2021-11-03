import logging
import re
import sys
import scrapy
from scrapy_redis.spiders import RedisSpider
from bs4 import BeautifulSoup
import httpx
from PIL import Image
from io import BytesIO
import os
import traceback
from datetime import datetime
from urllib.parse import unquote
import uuid
from urllib.parse import urlparse
from urllib.parse import parse_qs

class ChapterUrlSpider(RedisSpider):
    name = 'chapter_url'
    custom_settings = {
        'ROBOTSTXT_OBEY': True
    }
    transport = httpx.HTTPTransport(retries=500)

    def parse(self, response):

        status = True,
        error_msg = ''
        temp_title = ''
        try:
            parsed_url = urlparse(response.url)
            root_url = response.url.split('?')[0]
            rootFolderName = parse_qs(parsed_url.query)['rootFolderName'][0]
            subFolderName = parse_qs(parsed_url.query)['subFolderName'][0]
            index = parse_qs(parsed_url.query)['index'][0]
            commic_res = response.text
            commic_root = BeautifulSoup(commic_res, 'lxml')
            folder_name = f"./commics/{rootFolderName}/{subFolderName}"
            if os.path.isdir(folder_name) == False:
                os.makedirs(folder_name)
            commic_image_url = commic_root.find('img', id='ComicPic')['src']
            r = httpx.Client(timeout=None, transport=self.transport).get(
                commic_image_url)
            i = Image.open(BytesIO(r.content))
            temp_title=f'{folder_name}/{index}.jpg'
            i.save(temp_title)
        except Exception as e:
            status = False
            error_class = e.__class__.__name__  # 取得錯誤類型
            detail = e.args[0]  # 取得詳細內容
            cl, exc, tb = sys.exc_info()  # 取得Call Stack
            lastCallStack = traceback.extract_tb(tb)[-1]  # 取得Call Stack的最後一筆資料
            fileName = lastCallStack[0]  # 取得發生的檔案名稱
            lineNum = lastCallStack[1]  # 取得發生的行號
            funcName = lastCallStack[2]  # 取得發生的函數名稱
            error_msg_log = "File \"{}\", line {}, in {}: [{}] {}".format(
                fileName, lineNum, funcName, error_class, detail)
            logging.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
            logging.error(error_msg_log)
            error_msg = f"{fileName} => {lineNum} => =>{detail}"
            logging.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
        finally:
            now = datetime.now()
            dt_string = now.strftime("%Y/%m/%d %H:%M:%S")
            return {'id': str(uuid.uuid4()),'finishedTime': dt_string,'status': status, 'title': temp_title, 'chapterUrl': response.url, 'error_msg': error_msg}

