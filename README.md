# Fake Commic Store
> 分散式爬蟲
> x
> 漫畫下載器
## Features
- 使用Redis Scrapy設計下載漫畫排程
## 系統啟動方式
1. docker-compose up -d
2. 使用瀏覽器打開 http://localhost:3000
## Scale Container
```
docker-compose  up   --scale chapter-crawler=50 -d 
docker-compose  up   --scale comic-crawler=50 -d 
```

## prepare to do
``` bash
### 展開陣列資料
db.commic_url
.aggregate( [ { $unwind : "$data" } ] )
.sort({_id:-1})
.limit(100)
```
