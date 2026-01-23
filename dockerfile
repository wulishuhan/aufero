FROM node:16.14.0 AS FRONT
WORKDIR /app
COPY . .
RUN npm install --registry=https://registry.npmmirror.com
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "serve"]

# docker pull registry.cn-shenzhen.aliyuncs.com/algolaser/laser-library:dev-20230708 # 需要登录认证
# docker run -itd -p 8080:8080 --name laser-library-dev algolaser/laser-library:dev-20230708
