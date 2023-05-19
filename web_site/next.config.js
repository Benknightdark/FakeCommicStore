/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'img.comicun.com', 'www.jjmhw.cc','i.giphy.com','cdn-msp.18comic.org','cdn-msp.18comic.vip',
    'media3.giphy.com','www.comicimgs.com'],
  },
  swcMinify: true,
  output: 'standalone',
  transpilePackages: ["swr"]
}
