/**
 * Single source of truth for the method directory.
 * Every nav surface — sidebar, command palette, home index, breadcrumbs — reads
 * from here, so a new method is registered once.
 *
 * Method names stay in English because that is how they are named in class;
 * descriptions are Thai because that is the reading language.
 */

export const families = [
  {
    slug: 'root',
    name: 'Root of Equation',
    nameTh: 'การหารากของสมการ',
    desc: 'หาค่า x ที่ทำให้ f(x) = 0',
    api: 'root',
    methods: [
      { slug: 'graphical', name: 'Graphical', desc: 'กวาดค่าทีละช่วงแล้วอ่านจุดตัดแกน x จากกราฟ' },
      { slug: 'bisection', name: 'Bisection', desc: 'แบ่งครึ่งช่วงที่คร่อมรากไปเรื่อย ๆ จนแคบพอ' },
      { slug: 'falseposition', name: 'False Position', desc: 'ลากเส้นตรงผ่านปลายช่วงแล้วใช้จุดตัดเป็นค่าถัดไป' },
      { slug: 'onepoint', name: 'One-Point Iteration', desc: 'จัดสมการเป็น x = g(x) แล้ววนซ้ำจนค่านิ่ง' },
      { slug: 'newton', name: 'Newton-Raphson', desc: 'ใช้ความชันที่จุดปัจจุบันพุ่งไปหาราก ลู่เข้าเร็วที่สุด' },
      { slug: 'secant', name: 'Secant', desc: 'ใช้เส้นตัดจากสองจุดล่าสุดแทนอนุพันธ์' },
    ],
  },
  {
    slug: 'linear',
    name: 'Linear Algebra',
    nameTh: 'ระบบสมการเชิงเส้น',
    desc: 'แก้ระบบ [A]{x} = {B}',
    api: 'linear',
    methods: [
      { slug: 'cramer', name: "Cramer's Rule", desc: 'หาคำตอบจากอัตราส่วนดีเทอร์มิแนนต์' },
      { slug: 'eliminate', name: 'Gauss Elimination', desc: 'กำจัดตัวแปรลงเป็นสามเหลี่ยมบนแล้วแทนค่าย้อนกลับ' },
      { slug: 'jordan', name: 'Gauss-Jordan', desc: 'กำจัดต่อจนได้เมทริกซ์เอกลักษณ์ อ่านคำตอบตรง ๆ' },
      { slug: 'inverse', name: 'Matrix Inverse', desc: 'หาเมทริกซ์ผกผันแล้วคูณกับ {B}' },
      { slug: 'lu', name: 'LU Decomposition', desc: 'แยก [A] เป็น [L][U] แล้วแก้สองขั้น' },
      { slug: 'cholesky', name: 'Cholesky', desc: 'แยกเมทริกซ์สมมาตรบวกแน่นอนเป็น [L][L]ᵀ' },
      { slug: 'jacobi', name: 'Jacobi', desc: 'วนซ้ำโดยใช้ค่าจากรอบก่อนหน้าทั้งชุด' },
      { slug: 'seidel', name: 'Gauss-Seidel', desc: 'วนซ้ำโดยใช้ค่าที่เพิ่งอัปเดตทันที ลู่เข้าเร็วกว่า Jacobi' },
      { slug: 'conjugate', name: 'Conjugate Gradient', desc: 'ไล่ตามทิศทางสังยุคจนลู่เข้าใน n รอบ' },
    ],
  },
  {
    slug: 'inter',
    name: 'Interpolation',
    nameTh: 'การประมาณค่าในช่วง',
    desc: 'ประมาณค่าระหว่างจุดข้อมูลที่มี',
    api: 'inter',
    methods: [
      { slug: 'newton', name: "Newton's Divided Difference", desc: 'สร้างพหุนามจากตารางผลต่างส่วน' },
      { slug: 'lagrange', name: 'Lagrange', desc: 'ถ่วงน้ำหนักทุกจุดด้วยพหุนามฐาน' },
      { slug: 'spline', name: 'Spline', desc: 'ต่อพหุนามสั้น ๆ ทีละช่วงให้เรียบต่อเนื่อง' },
    ],
  },
  {
    slug: 'extrapolation',
    name: 'Regression',
    nameTh: 'การถดถอยและประมาณค่านอกช่วง',
    desc: 'หาเส้นที่พอดีที่สุดกับกลุ่มข้อมูล',
    api: 'simple',
    methods: [
      { slug: 'simple', name: 'Simple Regression', desc: 'ฟิตพหุนามดีกรี m บนตัวแปรต้นเดียว' },
      { slug: 'multiple', name: 'Multiple Regression', desc: 'ฟิตเชิงเส้นบนตัวแปรต้นหลายตัวพร้อมกัน' },
    ],
  },
  {
    slug: 'integration',
    name: 'Integration',
    nameTh: 'การหาปริพันธ์เชิงตัวเลข',
    desc: 'หาพื้นที่ใต้กราฟจาก a ถึง b',
    api: 'integrate',
    methods: [
      { slug: 'trapezoidal', name: 'Trapezoidal Rule', desc: 'ประมาณพื้นที่ด้วยสี่เหลี่ยมคางหมูรูปเดียว' },
      { slug: 'composite', name: 'Composite Trapezoidal', desc: 'ซอยช่วงเป็น n ส่วนแล้วรวมคางหมูทุกชิ้น' },
      { slug: 'simpson', name: 'Simpson Rule', desc: 'ใช้พาราโบลาแทนเส้นตรง แม่นกว่าที่ n เท่ากัน' },
      { slug: 'compositesimpson', name: 'Composite Simpson', desc: 'ซอยช่วงคู่แล้วรวมพาราโบลาทุกคู่ช่วง' },
    ],
  },
  {
    slug: 'differentiation',
    name: 'Differentiation',
    nameTh: 'การหาอนุพันธ์เชิงตัวเลข',
    desc: 'ประมาณอนุพันธ์จากผลต่างจำกัด',
    api: 'diff',
    methods: [
      { slug: 'divided', name: 'Divided Difference', desc: 'เทียบสูตรไปหน้า ถอยหลัง และกึ่งกลาง พร้อมค่าความคลาดเคลื่อน' },
    ],
  },
];

export const totalMethods = families.reduce((n, f) => n + f.methods.length, 0);

/** Flat list, each entry carrying its family and href. */
export const allMethods = families.flatMap((family) =>
  family.methods.map((method) => ({
    ...method,
    href: `/${family.slug}/${method.slug}`,
    familySlug: family.slug,
    familyName: family.name,
    familyNameTh: family.nameTh,
  }))
);

export function findFamily(slug) {
  return families.find((f) => f.slug === slug) || null;
}

export function findMethod(familySlug, methodSlug) {
  return allMethods.find((m) => m.familySlug === familySlug && m.slug === methodSlug) || null;
}
