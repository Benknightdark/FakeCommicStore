import logging
from scrapy import signals
from scrapy.exceptions import NotConfigured
from pymongo import MongoClient
import os
from datetime import datetime

logger = logging.getLogger(__name__)


class SpiderOpenCloseLogging:

    def __init__(self, item_count):
        self.item_count = item_count
        self.items_scraped = 0

    @classmethod
    def from_crawler(cls, crawler):
        # first check if the extension should be enabled and raise
        # NotConfigured otherwise
        if not crawler.settings.getbool('MYEXT_ENABLED'):
            raise NotConfigured

        # get the number of items from settings
        item_count = crawler.settings.getint('MYEXT_ITEMCOUNT', 1000)

        # instantiate the extension object
        ext = cls(item_count)

        # connect the extension object to signals
        crawler.signals.connect(
            ext.spider_opened, signal=signals.spider_opened)
        crawler.signals.connect(
            ext.spider_closed, signal=signals.spider_closed)
        crawler.signals.connect(ext.item_scraped, signal=signals.item_scraped)

        # return the extension object
        return ext

    def spider_opened(self, spider):
        logger.info("opened spider %s", spider.name)

    def spider_closed(self, spider):
        logger.info("closed spider %s", spider.name)

    def item_scraped(self, item, spider):
        logger.info(
            'come from  item_scraped=======================================')
        logger.info("--scraped item--")
        self.items_scraped += 1
        logger.info(item)
        db_uri = os.getenv('MONGODB_URL')
        db_client = MongoClient(db_uri)['crawler-log']
        now = datetime.now()
        timestamp = datetime.timestamp(now)
        db = db_client[spider.name]
        db.insert_one(item)
        # if self.items_scraped % self.item_count == 0:
        #     logger.info("scraped %d items", self.items_scraped)
