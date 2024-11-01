# ใช้ Node.js เป็น base image
FROM node:18

# ตั้ง working directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโค้ดทั้งหมด
COPY . .

# รันคำสั่ง build
RUN npm run build

# เปิดพอร์ตที่ใช้งาน
EXPOSE 3000

# รันแอปพลิเคชัน
CMD ["npm", "start"]
