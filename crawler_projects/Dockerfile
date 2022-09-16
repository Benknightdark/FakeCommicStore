FROM python:3.10.7-slim-buster
ENV PYMSSQL_BUILD_WITH_BUNDLED_FREETDS=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV TZ=Asia/Taipei
COPY requirements.txt .
RUN python -m pip install -r requirements.txt --upgrade
WORKDIR /app
COPY . /app
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser
ENTRYPOINT ["scrapy"]
