import { evaluate } from 'mathjs';

export function findx(fx, x0) {
  const scope = { x: x0 };
  return evaluate(fx, scope); 
}



export function roundToSignificantDecimals(num) {
  try{
    if (Number.isInteger(num)) return num;
  let str = num.toString();
  let decimalPart = str.split('.')[1];
  let significantDecimals = decimalPart.length;

  for (let i = decimalPart.length - 1; i >= 0; i--) {
    if (decimalPart[i] !== '0') {
      significantDecimals = i + 1;
      break;
    }
  }
 
  
  return parseFloat(num);
  }catch (error){
    console.error('Error fetching data:', error);
    alert('เกิดข้อผิดพลาด')
  }
}
