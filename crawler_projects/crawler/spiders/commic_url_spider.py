from scrapy_redis.spiders import RedisSpider
from bs4 import BeautifulSoup
import os
import logging
from urllib.parse import urlparse
from urllib.parse import parse_qs
import redis
import os


class CommicUrlSpider(RedisSpider):
    name = 'commic_url'
    custom_settings = {
        'ROBOTSTXT_OBEY': False
    }

    def parse(self, response):
        redis_client = redis.Redis(host=os.getenv(
            'REDIS_CONNECTION_STRING'), port=os.getenv('REDIS_CONNECTION_PORT'), db=0)
        parsed_url = urlparse(response.url)
        root_url = response.url.split('?')[0]
        root_folder_name = parse_qs(parsed_url.query)['rootFolderName'][0]
        sub_folder_name = parse_qs(parsed_url.query)['subFolderName'][0]
        channel_id = parse_qs(parsed_url.query)['id'][0]
        commic_res = response.text
        commic_root = BeautifulSoup(commic_res, 'lxml')
        new_url_array = []
        if channel_id == "1":
            max_page = commic_root.find(
                'select', attrs={"name": 'select1'})
            max_page_option_value = max_page.find_all('option')
            
            for v in max_page_option_value:
                new_url = f"{root_url}-p-{v['value']}?index={v['value']}&rootFolderName={root_folder_name}&subFolderName={sub_folder_name}"
                logging.info(new_url)
                new_url_array.append(new_url)
                redis_client.lpush('chapter_url:start_urls', new_url)
        if channel_id=="2":
            image_el=commic_root.find_all('div',attrs={'class':'center scramble-page'})
            i=1
            for im in image_el:
                src=im.find('img')['src']
                new_url=f"{im.find('img')['src']}?index={v['value']}&rootFolderName={root_folder_name}&subFolderName={sub_folder_name}"
                new_url_array.append(new_url)
                redis_client.lpush('chapter_url:start_urls', new_url)
                i=i+1
                print(new_url)
            pass
        return {'data': new_url_array}
