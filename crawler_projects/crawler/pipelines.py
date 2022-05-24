# # Define your item pipelines here
# #
# # Don't forget to add your pipeline to the ITEM_PIPELINES setting
# # See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html
import json

from itemadapter import ItemAdapter

class JsonWriterPipeline:

    def open_spider(self, spider):
        self.file = open('items.jl', 'w')

    def close_spider(self, spider):
        self.file.close()

    def process_item(self, item, spider):
        print('-----------------------------------')
        print('update JSOn-----------------')
        print('-----------------------------------')
        line = json.dumps(ItemAdapter(item).asdict()) + "\n"
        self.file.write(line)
        return item

# # useful for handling different item types with a single interface
# import os
# import logging
# import httpx
# from bs4 import BeautifulSoup
# from PIL import Image
# from io import BytesIO
# import grequests
# import re
# import sys
# import traceback


# class CrawlerPipeline:
#     transport = httpx.HTTPTransport(retries=10)

#     def get_commic_image(self, content, folder_name):
#         try:
#             commic_root = BeautifulSoup(content, 'lxml')
#             commic_image_url = commic_root.find('img', id='ComicPic')['src']
#             commic_page = commic_root.find(
#                 'a', attrs={'class': 'c_p k_pag'}).text.replace('第', '').replace('頁', '')
#             r = httpx.Client(timeout=None, transport=self.transport).get(
#                 commic_image_url)
#             i = Image.open(BytesIO(r.content))
#             print(commic_page)
#             print('=================')
#             i.save(f'{folder_name}/{commic_page}.jpg')
#         except:
#             pass

#     def process_item(self, item, spider):
#         status = True,
#         error_msg = ''
#         try:
#             temp_title = re.sub(r'[^\w]', '', item['title'])
#             folder_name = f"./commics/{item['commic_title']}/{temp_title}"
#             if os.path.isdir(folder_name) == False:
#                 os.makedirs(folder_name)
#             logging.info(item['title'])
#             commic_req = httpx.Client(
#                 timeout=None, transport=self.transport).get(item['link'])
#             commic_res = commic_req.text
#             commic_root = BeautifulSoup(commic_res, 'lxml')
#             max_page = len(commic_root.find(
#                 'select', attrs={"name": 'select1'}))
#             commic_image_url = commic_root.find('img', id='ComicPic')['src']
#             r = httpx.Client(timeout=None, transport=self.transport).get(
#                 commic_image_url)
#             i = Image.open(BytesIO(r.content))
#             i.save(f'{folder_name}/0.jpg')

#             start_page = 2
#             range_index = range(start_page, int(max_page)+1)
#             commic_image_links = []
#             for ri in range_index:
#                 commic_image_links.append(f"{item['link']}-p-{ri}")
#             reqs = (grequests.get(link, timeout=5000)
#                     for link in commic_image_links)
#             response = grequests.imap(reqs, grequests.Pool(30))
#             for r in response:
#                 self.get_commic_image(r.content, folder_name)
#         except Exception as e:
#             status = False
#             error_class = e.__class__.__name__  # 取得錯誤類型
#             detail = e.args[0]  # 取得詳細內容
#             cl, exc, tb = sys.exc_info()  # 取得Call Stack
#             lastCallStack = traceback.extract_tb(tb)[-1]  # 取得Call Stack的最後一筆資料
#             fileName = lastCallStack[0]  # 取得發生的檔案名稱
#             lineNum = lastCallStack[1]  # 取得發生的行號
#             funcName = lastCallStack[2]  # 取得發生的函數名稱
#             error_msg = "File \"{}\", line {}, in {}: [{}] {}".format(
#                 fileName, lineNum, funcName, error_class, detail)
#             logging.error(error_msg)
#         finally:
#             return {'status': status, 'data': item, 'error_msg': error_msg}


# class MessagePipeline:
#     def process_item(self, item, spider):
#         logging.info(
#             '=-----------------------------------MessagePipeline-----------------------------------------')
#         logging.info(item)
#         logging.info(
#             '=-----------------------------------MessagePipeline-----------------------------------------')
#         return item
