# Fake Commic Store
> 分散式爬蟲
> x
> 漫畫下載器
## Features
- 使用Redis Scrapy設計下載漫畫排程
## 系統啟動方式
- 先在根目錄建立名為`commics`的資料夾
- docker-compose up -d

## Scale Container
```
docker-compose  up   --scale chapter-crawler=50 -d 
docker-compose  up   --scale comic-crawler=50 -d 
```