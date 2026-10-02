# Numerical Methods — เครื่องคำนวณเชิงตัวเลขที่แสดงขั้นตอน

เว็บแอปคำนวณ **Numerical Methods ครบ 25 เมธอดใน 6 กลุ่มปัญหา** พัฒนาด้วย Next.js, Prisma และ PostgreSQL

ต่างจากเครื่องคิดเลขออนไลน์ทั่วไปตรงที่ **ไม่ได้ให้แค่คำตอบสุดท้าย** ทุกเมธอดแสดงตารางการวนซ้ำ (iteration table) ทีละรอบพร้อมค่าความคลาดเคลื่อน และกราฟของฟังก์ชันหรือจุดข้อมูล ผู้ใช้จึงเทียบกับการคำนวณมือของตัวเองได้ทีละบรรทัด และโจทย์ที่เคยคำนวณจะถูกบันทึกลงฐานข้อมูลให้เรียกกลับมาใช้ซ้ำได้

ออกแบบมาสำหรับนักศึกษาวิชา Numerical Methods ใช้ทำการบ้าน ทวนสอบคำตอบ และนำเสนอผลงาน

---

## สารบัญ

- [ฟีเจอร์](#ฟีเจอร์)
- [เมธอดที่รองรับ](#เมธอดที่รองรับ)
- [Tech Stack](#tech-stack)
- [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
- [โครงสร้างฐานข้อมูล](#โครงสร้างฐานข้อมูล)
- [เริ่มต้นใช้งาน](#เริ่มต้นใช้งาน)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [วิธีใช้งาน](#วิธีใช้งาน)
- [API](#api)
- [การ Deploy](#การ-deploy)
- [ระบบดีไซน์](#ระบบดีไซน์)
- [การเพิ่มเมธอดใหม่](#การเพิ่มเมธอดใหม่)

---

## ฟีเจอร์

- **25 เมธอด 6 กลุ่มปัญหา** ครอบคลุมเนื้อหาวิชา Numerical Methods
- **ตารางการวนซ้ำ** แสดงค่าทุกรอบพร้อม error ตรวจสอบได้ทีละบรรทัด
- **แสดงขั้นตอนเมทริกซ์** สำหรับเมธอดระบบสมการเชิงเส้น
- **กราฟแบบโต้ตอบ** (Plotly) ซูมและเลื่อนดูได้ แสดงฟังก์ชัน จุดราก และจุดข้อมูล
- **พิมพ์สมการเป็นข้อความ** รูปแบบ mathjs เช่น `x^3 - x - 2`, `exp(x) - 3*x`, `sin(x)` และแสดงผลสวยงามด้วย KaTeX
- **บันทึกประวัติโจทย์** ลง PostgreSQL แยกตามกลุ่มปัญหา เลือกโจทย์เก่ากลับมาคำนวณซ้ำ หรือลบทิ้งได้
- **Command Palette** กด `Ctrl + K` (หรือ `⌘ + K` บน macOS) เพื่อค้นหาและกระโดดไปเมธอดใดก็ได้
- **โหมดมืด / สว่าง / ตามระบบ**
- **รองรับมือถือ** สำหรับเปิดโชว์ผลงาน
- **API Docs** ด้วย Swagger UI ที่ `/api-doc`
- **UI ภาษาไทย** ส่วนชื่อเมธอดและศัพท์เทคนิค (iteration, tolerance, f(x)) คงเป็นภาษาอังกฤษตามที่ใช้ในชั้นเรียน

---

## เมธอดที่รองรับ

### 1. Root of Equation — การหารากของสมการ (`/root/*`)
หาค่า x ที่ทำให้ f(x) = 0

| เมธอด | เส้นทาง | หลักการ |
|-------|---------|---------|
| Graphical | `/root/graphical` | กวาดค่าทีละช่วงแล้วอ่านจุดตัดแกน x จากกราฟ |
| Bisection | `/root/bisection` | แบ่งครึ่งช่วงที่คร่อมรากไปเรื่อย ๆ จนแคบพอ |
| False Position | `/root/falseposition` | ลากเส้นตรงผ่านปลายช่วงแล้วใช้จุดตัดเป็นค่าถัดไป |
| One-Point Iteration | `/root/onepoint` | จัดสมการเป็น x = g(x) แล้ววนซ้ำจนค่านิ่ง |
| Newton-Raphson | `/root/newton` | ใช้ความชันที่จุดปัจจุบันพุ่งไปหาราก ลู่เข้าเร็วที่สุด |
| Secant | `/root/secant` | ใช้เส้นตัดจากสองจุดล่าสุดแทนอนุพันธ์ |

### 2. Linear Algebra — ระบบสมการเชิงเส้น (`/linear/*`)
แก้ระบบ [A]{x} = {B}

| เมธอด | เส้นทาง | หลักการ |
|-------|---------|---------|
| Cramer's Rule | `/linear/cramer` | หาคำตอบจากอัตราส่วนดีเทอร์มิแนนต์ |
| Gauss Elimination | `/linear/eliminate` | กำจัดตัวแปรลงเป็นสามเหลี่ยมบนแล้วแทนค่าย้อนกลับ |
| Gauss-Jordan | `/linear/jordan` | กำจัดต่อจนได้เมทริกซ์เอกลักษณ์ อ่านคำตอบตรง ๆ |
| Matrix Inverse | `/linear/inverse` | หาเมทริกซ์ผกผันแล้วคูณกับ {B} |
| LU Decomposition | `/linear/lu` | แยก [A] เป็น [L][U] แล้วแก้สองขั้น |
| Cholesky | `/linear/cholesky` | แยกเมทริกซ์สมมาตรบวกแน่นอนเป็น [L][L]ᵀ |
| Jacobi | `/linear/jacobi` | วนซ้ำโดยใช้ค่าจากรอบก่อนหน้าทั้งชุด |
| Gauss-Seidel | `/linear/seidel` | วนซ้ำโดยใช้ค่าที่เพิ่งอัปเดตทันที ลู่เข้าเร็วกว่า Jacobi |
| Conjugate Gradient | `/linear/conjugate` | ไล่ตามทิศทางสังยุคจนลู่เข้าใน n รอบ |

### 3. Interpolation — การประมาณค่าในช่วง (`/inter/*`)

| เมธอด | เส้นทาง | หลักการ |
|-------|---------|---------|
| Newton's Divided Difference | `/inter/newton` | สร้างพหุนามจากตารางผลต่างส่วน |
| Lagrange | `/inter/lagrange` | ถ่วงน้ำหนักทุกจุดด้วยพหุนามฐาน |
| Spline | `/inter/spline` | ต่อพหุนามสั้น ๆ ทีละช่วงให้เรียบต่อเนื่อง |

### 4. Regression — การถดถอยและประมาณค่านอกช่วง (`/extrapolation/*`)

| เมธอด | เส้นทาง | หลักการ |
|-------|---------|---------|
| Simple Regression | `/extrapolation/simple` | ฟิตพหุนามดีกรี m บนตัวแปรต้นเดียว |
| Multiple Regression | `/extrapolation/multiple` | ฟิตเชิงเส้นบนตัวแปรต้นหลายตัวพร้อมกัน |

### 5. Integration — การหาปริพันธ์เชิงตัวเลข (`/integration/*`)
หาพื้นที่ใต้กราฟจาก a ถึง b

| เมธอด | เส้นทาง | หลักการ |
|-------|---------|---------|
| Trapezoidal Rule | `/integration/trapezoidal` | ประมาณพื้นที่ด้วยสี่เหลี่ยมคางหมูรูปเดียว |
| Composite Trapezoidal | `/integration/composite` | ซอยช่วงเป็น n ส่วนแล้วรวมคางหมูทุกชิ้น |
| Simpson Rule | `/integration/simpson` | ใช้พาราโบลาแทนเส้นตรง แม่นกว่าที่ n เท่ากัน |
| Composite Simpson | `/integration/compositesimpson` | ซอยช่วงคู่แล้วรวมพาราโบลาทุกคู่ช่วง |

### 6. Differentiation — การหาอนุพันธ์เชิงตัวเลข (`/differentiation/*`)

| เมธอด | เส้นทาง | หลักการ |
|-------|---------|---------|
| Divided Difference | `/differentiation/divided` | เทียบสูตรไปหน้า ถอยหลัง และกึ่งกลาง พร้อมค่าความคลาดเคลื่อน |

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + React 18 |
| ภาษา | JavaScript (JSX) และ TypeScript บางส่วน |
| Styling | Tailwind CSS 3 |
| คำนวณ | [mathjs](https://mathjs.org/) สำหรับแปลงและประเมินค่าสมการ |
| แสดงสมการ | KaTeX + react-katex |
| กราฟ | Plotly (react-plotly.js), Chart.js |
| ORM / Database | Prisma 5 + PostgreSQL (ใช้ Neon ใน production) |
| API Docs | next-swagger-doc + swagger-ui-react |
| HTTP Client | Axios |
| Deploy | Docker, GitHub Actions → Docker Hub |

---

## โครงสร้างโปรเจกต์

```
numer/
├── prisma/
│   ├── schema.prisma               # Schema ฐานข้อมูล (ตารางละกลุ่มปัญหา)
│   └── migrations/
├── public/numerical.png            # โลโก้
├── src/app/
│   ├── page.jsx                    # หน้าแรก: รายการกลุ่มปัญหาและเมธอดทั้งหมด
│   ├── layout.tsx                  # Root layout (header, ธีม, ฟอนต์)
│   ├── root/<method>/              # หน้าแต่ละเมธอดของ Root of Equation
│   ├── linear/<method>/            # Linear Algebra
│   ├── inter/<method>/             # Interpolation
│   ├── extrapolation/<method>/     # Regression
│   ├── integration/<method>/       # Integration
│   ├── differentiation/divided/    # Differentiation
│   ├── api-doc/                    # หน้า Swagger UI
│   ├── api/                        # Route Handlers: บันทึก/ดึง/ลบประวัติโจทย์
│   ├── lib/
│   │   ├── methods.js              # ทะเบียนเมธอดทั้งหมด (single source of truth)
│   │   └── swagger.jsx             # สร้าง OpenAPI spec จากคอมเมนต์ @swagger
│   └── components/
│       ├── MethodShell.jsx         # โครงหน้าเมธอด (หัวข้อ, breadcrumb)
│       ├── RootMethodPage.jsx      # เทมเพลตหน้าเมธอดกลุ่ม Root
│       ├── LinearMethodPage.jsx    # เทมเพลตกลุ่ม Linear
│       ├── PointsMethodPage.jsx    # เทมเพลตกลุ่มที่รับจุดข้อมูล (Interpolation/Regression)
│       ├── IntegrationMethodPage.jsx
│       ├── MathGraph.jsx           # กราฟ Plotly
│       ├── CommandPalette.jsx      # ค้นหาเมธอด (Ctrl + K)
│       ├── ThemeToggle.jsx         # สลับโหมดมืด/สว่าง/ตามระบบ
│       └── ui/                     # IterationTable, MatrixInput, MatrixSteps, PointsInput, ResultCard ฯลฯ
├── Dockerfile                      # Multi-stage build บน node:22-alpine
├── docker-compose.yml
├── .github/workflows/deploy.yaml   # Build และ push Docker image เมื่อ push ขึ้น main
├── PRODUCT.md                      # บริบทผู้ใช้และเป้าหมายของผลิตภัณฑ์
└── DESIGN.md                       # ระบบดีไซน์
```

---

## โครงสร้างฐานข้อมูล

ทุกตารางเก็บ "โจทย์" ที่ผู้ใช้เคยคำนวณ เพื่อเรียกกลับมาใช้ซ้ำ (ไม่ได้เก็บผลลัพธ์) ทุกตารางมีฟิลด์ `proublem` (ชื่อ/คำอธิบายโจทย์) และ `Date` (วันที่บันทึก)

| Model | กลุ่มปัญหา | ฟิลด์ข้อมูลโจทย์ |
|-------|-----------|------------------|
| `root` | Root of Equation | `name` (สมการ f(x), unique), `xl`, `xr` |
| `linear` | Linear Algebra | `size`, `A` (JSON, unique), `B`, `x0` |
| `inter` | Interpolation | `point`, `X` (JSON, unique), `Y`, `x0` |
| `simple` | Simple Regression | `point`, `xvalue`, `m` (ดีกรี), `X` (JSON, unique), `Y` |
| `multiple` | Multiple Regression | `point`, `xvalue`, `X` (JSON, unique), `Y`, `xi` |
| `integration` | Integration | `fx` (unique), `a`, `b`, `n` |
| `diff` | Differentiation | `fx` (unique), `x`, `h` |
| `Equation` | (ตารางเดิม) | `name` (unique) |

> ฟิลด์ที่เป็น unique ทำให้โจทย์ซ้ำกันบันทึกได้ครั้งเดียว

---

## เริ่มต้นใช้งาน

### สิ่งที่ต้องมี
- **Node.js 22** ขึ้นไป (Next.js 16 ต้องใช้ ≥ 20.9 และ swagger-client ต้องใช้ ≥ 22)
- **PostgreSQL** (ติดตั้งเอง หรือใช้บริการเช่น Neon / Supabase)

### ขั้นตอน

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/Pisit-auu/numer.git
cd numer

# 2. ติดตั้ง dependencies
npm install

# 3. สร้างไฟล์ .env (ดูหัวข้อ Environment Variables)

# 4. สร้าง Prisma Client และตารางในฐานข้อมูล
npx prisma generate
npx prisma migrate deploy

# 5. รัน development server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

> ฟีเจอร์คำนวณทั้งหมดทำงานในเบราว์เซอร์ ฐานข้อมูลใช้แค่สำหรับบันทึกและเรียกคืนประวัติโจทย์

---

## Environment Variables

สร้างไฟล์ `.env` ที่ root ของโปรเจกต์ (ไฟล์นี้อยู่ใน `.gitignore` แล้ว ห้าม commit):

```env
# Connection string ของ PostgreSQL (ถ้าใช้ pooler เช่น Neon ให้ใส่ URL แบบ pooled)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/numer?sslmode=require"
# Connection ตรงสำหรับ prisma migrate (ถ้าไม่ได้ใช้ pooler ใส่ค่าเดียวกับ DATABASE_URL)
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/numer?sslmode=require"
```

| ตัวแปร | จำเป็น | คำอธิบาย |
|--------|:------:|----------|
| `DATABASE_URL` | ✅ | Connection string ที่แอปใช้ |
| `DIRECT_URL` | ✅ | Connection ตรงสำหรับ Prisma migrate |

> ใช้ `.env` ไฟล์เดียวได้ทั้ง Next.js, Prisma CLI (`migrate`, `studio`) และ `docker compose` (อ่านผ่าน `env_file`)

---

## Scripts

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `npm run dev` | รัน development server |
| `npm run build` | `prisma generate` แล้ว build สำหรับ production |
| `npm run start` | รัน production server (ต้อง build ก่อน) |
| `npm run lint` | ตรวจโค้ดด้วย ESLint |
| `npx prisma studio` | เปิด GUI ดู/แก้ข้อมูลในฐานข้อมูล |

---

## วิธีใช้งาน

1. **เลือกเมธอด** จากหน้าแรก แถบเมนู หรือกด `Ctrl + K` แล้วพิมพ์ชื่อเมธอด
2. **กรอกโจทย์**
   - กลุ่ม Root: สมการ f(x) เช่น `x^4 - 13`, ค่า XL / XR (หรือค่าเริ่มต้น X0) และ tolerance (ค่าเริ่มต้น `0.000001`)
   - กลุ่ม Linear: ขนาดเมทริกซ์ n แล้วกรอก [A], {B} และ {x0} สำหรับเมธอดวนซ้ำ
   - กลุ่ม Interpolation / Regression: จำนวนจุด แล้วกรอกค่า X, Y และค่าที่ต้องการประมาณ
   - กลุ่ม Integration: f(x), ขอบเขต a, b และจำนวนช่วง n
   - กลุ่ม Differentiation: f(x), ค่า x และระยะ h
3. **กดคำนวณ** ระบบจะแสดงคำตอบ ตารางการวนซ้ำ และกราฟ พร้อมบันทึกโจทย์ลงประวัติ
4. **เรียกโจทย์เก่า** เลือกจากรายการประวัติของกลุ่มนั้น หรือลบรายการที่ไม่ใช้แล้ว

### รูปแบบสมการ (mathjs)

| ต้องการ | พิมพ์ |
|---------|-------|
| x² | `x^2` |
| √x | `sqrt(x)` |
| eˣ | `exp(x)` |
| ln x | `log(x)` |
| sin, cos, tan | `sin(x)`, `cos(x)`, `tan(x)` |
| π | `pi` |

---

## API

ทุก endpoint อยู่ใต้ `/api` รับ/ส่ง JSON และเปิด CORS ไว้ ดูรายละเอียดและทดลองเรียกได้ที่ **`/api-doc`** (Swagger UI สร้างจากคอมเมนต์ `@swagger` ใน route)

| กลุ่ม | รายการ / บันทึก | อ่าน / ลบรายการเดียว |
|-------|-----------------|---------------------|
| Root of Equation | `GET` / `POST` `/api/root` | `GET` / `DELETE` `/api/root/{id}` |
| Linear Algebra | `GET` / `POST` `/api/linear` | `GET` / `DELETE` `/api/linear/{id}` |
| Interpolation | `GET` / `POST` `/api/inter` | `GET` / `DELETE` `/api/inter/{id}` |
| Simple Regression | `GET` / `POST` `/api/simple` | `GET` / `DELETE` `/api/simple/{id}` |
| Multiple Regression | `GET` / `POST` `/api/multiple` | `GET` / `DELETE` `/api/multiple/{id}` |
| Integration | `GET` / `POST` `/api/integrate` | `GET` / `DELETE` `/api/integrate/{id}` |
| Differentiation | `GET` / `POST` `/api/diff` | `GET` / `DELETE` `/api/diff/{id}` |
| Equation (เดิม) | `GET` / `POST` `/api/equation` | `DELETE` `/api/equation/{id}` |

ตัวอย่าง: บันทึกโจทย์หาราก

```bash
curl -X POST http://localhost:3000/api/root \
  -H "Content-Type: application/json" \
  -d '{"name":"x^4 - 13","proublem":"หาราก 4 ของ 13","xl":1.5,"xr":2,"Date":"2/10/2569"}'
```

> API ไม่มีระบบยืนยันตัวตน ใครก็บันทึกหรือลบประวัติได้ เหมาะกับการใช้ในชั้นเรียนหรือเดโม ถ้าเปิดสู่สาธารณะควรเพิ่มการป้องกันก่อน

---

## การ Deploy

### Docker

`Dockerfile` เป็น multi-stage build บน `node:22-alpine` (ติดตั้ง OpenSSL ให้ Prisma) รันด้วยผู้ใช้ `node` ที่พอร์ต 3000 และ `.dockerignore` กันไม่ให้ไฟล์ `.env` ติดเข้าไปใน image

```bash
docker build -t numer .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e DIRECT_URL="postgresql://..." \
  numer
```

ค่า `DATABASE_URL` / `DIRECT_URL` ต้องส่งตอนรัน container (ด้วย `-e`, `--env-file` หรือระบบ secret ของแพลตฟอร์ม) ไม่ฝังลงใน image

### Docker Compose

`docker-compose.yml` มี 2 service: `app` (ตัวเว็บ พอร์ต 3000) และ `prisma` (Prisma Studio พอร์ต 5555) ทั้งสองอ่านค่าจากไฟล์ `.env`

```bash
docker compose up -d --build
```

### GitHub Actions

`.github/workflows/deploy.yaml` จะ build และ push image `pisitauu/numer:latest` ขึ้น Docker Hub ทุกครั้งที่ push ขึ้น `main` ต้องตั้ง repository secrets: `DOCKER_USERNAME`, `DOCKER_PASSWORD`

### Vercel

deploy บน Vercel ได้โดยตรง: import repo, ตั้ง `DATABASE_URL` และ `DIRECT_URL` ใน Environment Variables แล้วกด Deploy (คำสั่ง `npm run build` จะรัน `prisma generate` ให้เอง)

---

## ระบบดีไซน์

- แนวทาง **modern product UI** ระดับเดียวกับ GitHub / Vercel / shadcn/ui: สะอาด เป็นกลาง คุ้นตา
- รองรับโหมดมืดและสว่างเต็มรูปแบบ (ปุ่มสลับที่ header: สว่าง / มืด / ตามระบบ)
- ตัวเลขในตารางใช้ฟอนต์ monospace ให้อ่านเทียบเป็นคอลัมน์ได้ง่าย
- รายละเอียด token สี ตัวอักษร และหลักการออกแบบอยู่ใน [`DESIGN.md`](DESIGN.md)
- บริบทผู้ใช้และเป้าหมายของผลิตภัณฑ์อยู่ใน [`PRODUCT.md`](PRODUCT.md)

---

## การเพิ่มเมธอดใหม่

1. ลงทะเบียนเมธอดใน `src/app/lib/methods.js` (ใส่ `slug`, `name`, `desc` ในกลุ่มที่ต้องการ) แถบเมนู Command Palette หน้าแรก และ breadcrumb จะอ่านจากไฟล์นี้อัตโนมัติ
2. สร้างหน้า `src/app/<family>/<slug>/page.jsx` โดยใช้เทมเพลตของกลุ่มนั้น เช่น `RootMethodPage` แล้วส่งฟังก์ชัน `solve` ที่คืนผลลัพธ์และแถวของตารางการวนซ้ำ
3. ถ้าเป็นกลุ่มปัญหาใหม่ ให้เพิ่ม model ใน `prisma/schema.prisma`, สร้าง migration และเพิ่ม route ใน `src/app/api/`
