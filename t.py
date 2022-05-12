from tkinter import Image
import cloudscraper
from PIL import Image
from io import BytesIO

url='http://www.jjmhw.cc/static/upload/book/592/24615/843792.jpg?index=79&rootFolderName=%E8%88%9E%E8%B9%88%E7%B3%BB%E5%AD%B8%E5%A7%8A%E5%80%91&subFolderName=%E7%AC%AC1%E8%A9%B1-%E8%88%9E%E8%B9%88%E7%B3%BB%E5%94%AF%E4%B8%80%E5%B8%B6%E6%8A%8A%E7%9A%84&id=3'
cc=cloudscraper.create_scraper(
    browser='firefox', delay=30)
cc.adapters.DEFAULT_RETRIES =1000

r =cc.get(url)
i = Image.open(BytesIO(r.content))
temp_title = f'1.jpg'
i.save(temp_title)