# Sử dụng image Node.js để build React
FROM node:18 AS build

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép file package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ code frontend
COPY . .

# Build ứng dụng React
RUN npm run build

# Sử dụng Nginx để phục vụ file tĩnh
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Mở cổng 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]