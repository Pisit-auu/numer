
function pushBcolumn(A, B, column) {
    let newMatrix = Array.from({ length: A.length }, () => Array(A[0].length));
    
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A[0].length; j++) {
            if (j === column) {
                newMatrix[i][j] = B[i];
            } else {
                newMatrix[i][j] = A[i][j];
            }
        }
    }
    return newMatrix;
  }
  export function findet(A,B) { 
    let fdet = [];
    fdet[0] = caldet(A);
    for (let i = 1; i <= A[0].length; i++) {
        let Matrix = pushBcolumn(A, B, i - 1);
        fdet[i] = caldet(Matrix);
    }
    return fdet;
  }


  export function caldet(matrix){
    let A=0;
    let sum;
    let A2=0;
    if(matrix.length == 2){
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }else{
        for(let j=0;j<matrix.length;j++){
        sum=1;
        for( let i=0;i<matrix.length;i++){
            sum*= matrix[i][(i+j)%matrix.length];  
    }
        A+=sum;
     }
            for (let k = 0; k < matrix.length; k++) {
                       sum = 1; 
                       for (let i = 0; i < matrix.length; i++) {
                           sum *= matrix[i][(k - i + matrix.length) % matrix.length];
                       }
                       A2 += sum;
                   }
    }
          return A-A2;
    }     
    export function pushB(L, B) {
        const newArray = new Array(L.length).fill(0).map(() => new Array(L[0].length + 1));
        for (let i = 0; i < newArray.length; i++) {
            for (let j = 0; j < newArray[0].length; j++) {
                if (j < L[0].length) {
                    newArray[i][j] = L[i][j];
                } else {
                    newArray[i][j] = B[i];
                }
            }
        }
        return newArray;
    }
    
    export function findLU(A) {
        const LU = new Array(A.length).fill(0).map(() => new Array(A[0].length));
        for (let j = 0; j < LU[0].length; j++) {
            LU[j][0] = A[j][0];
        }
        for (let i = 1; i < LU[0].length; i++) {
            LU[0][i] = A[0][i] / LU[0][0];
        }
        for (let i = 1; i < LU[0].length; i++) {
            LU[i][1] = A[i][1] - (LU[i][0] * LU[0][1]);
        }
        for (let i = 2; i < LU[0].length; i++) {
            LU[1][i] = (A[1][i] - (LU[1][0] * LU[0][i])) / LU[1][1];
            LU[i][i] = A[i][i];
            for (let j = 0; j < LU[0].length - 1; j++) {
                LU[i][i] -= LU[i][j] * LU[j][i];
            }
        }
        return LU;
    }
    
    export function findL(LU) {
        const L = new Array(LU.length).fill(0).map(() => new Array(LU[0].length).fill(0));
        for (let i = 0; i < L.length; i++) {
            for (let j = 0; j <= i; j++) {
                L[i][j] = LU[i][j];
            }
        }
        return L;
    }
    
    export function findU(LU) {
        const U = new Array(LU.length).fill(0).map(() => new Array(LU[0].length).fill(0));
        for (let i = 0; i < U.length; i++) {
            U[i][i] = 1;
        }
        for (let i = 0; i < U.length - 1; i++) {
            for (let j = 1 + i; j < U.length; j++) {
                U[i][j] = LU[i][j];
            }
        }

        return U;
    }
    
    export function findY(L) {
        const y = new Array(L[0].length);
        const n = L.length;
        for (let i = 0; i < n; i++) {
            y[i] = L[i][n];
            for (let j = 0; j < i; j++) {
                y[i] -= L[i][j] * y[j];
            }
            y[i] /= L[i][i];
        }
        return y;
    }
    export function findX(L) {
        let X = new Array(L[0].length).fill(0);
        
        let n = L.length;
    
        for (let i = n - 1; i >= 0; i--) {
            X[i] = L[i][n];
            for (let j = i + 1; j < n; j++) {
                X[i] -= L[i][j] * X[j];
            }
            X[i] /= L[i][i];
        }
    
        return X;
    }
    export function findLL(A) {
        const n = A.length;
        const LL = Array.from({ length: n }, () => Array(n).fill(0));
    
        for (let i = 0; i < n; i++) {
            LL[i][i] = A[i][i];
            for (let j = 0; j < i; j++) {
                LL[i][i] -= Math.pow(LL[i][j], 2);
            }
            if (LL[i][i] < 0) {
                throw new Error("Matrix A is not positive definite.");
            }
            LL[i][i] = Math.sqrt(LL[i][i]);
    
            for (let j = i + 1; j < n; j++) {
                LL[j][i] = A[j][i];
                for (let k = 0; k < i; k++) {
                    LL[j][i] -= LL[j][k] * LL[i][k];
                }
                LL[j][i] /= LL[i][i];
            }
        }
        return LL;
    }
    export function findLT(LL) {
        if (!LL || LL.length === 0 || !LL[0]) {
            throw new Error("Invalid matrix LL.");
        }
        
        const n = LL.length;
        const LT = Array.from({ length: n }, () => Array(n).fill(0));
    
        for (let i = 0; i < n; i++) {
            LT[i][i] = LL[i][i];
        }
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                LT[i][j] = LL[j][i];
            }
        }
    
        return LT;
    }
   //conjugate
   
   
   export  function bxa(b, a) {
    const m = a.length;         
    const n = a[0].length;      

    if (b.length !== n) {
        throw new Error("ขนาดของเวกเตอร์ b ต้องตรงกับจำนวนคอลัมน์ของแมทริกซ์ a");
    }
    let r = new Array(m).fill(0); 
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            r[i] += a[i][j] * b[j]; 
        }
    }
    return r; 
}
    export function bx1(d, r) {
        let result = 0;
        for (let i = 0; i < d.length; i++) {
            result += d[i] * r[i];
        }
        return result; 
    }

    export function findr(A, B, X) {
        let r = bxa(X, A);
        for (let i = 0; i < r.length; i++) {
            r[i] -= B[i];
        }
        
        return r; 
    }
    export function findd0(r) {
        let d = new Array(r.length);
    
        for (let i = 0; i < r.length; i++) {
            d[i] = r[i]; 
        }
        
        for (let i = 0; i < r.length; i++) {
            d[i] *= -1; 
        }
    
        return d; 
    }
    export function findlamda(d, r, a) {
        let result1 = bx1(d, r);
        let dxa = bxa(d, a);
        let result2 = bx1(d, dxa);
        let result = result1 / result2 * -1;
        return result;
    }
    export function vectorx(x, v) {
        let vector = new Array(x.length);
        for (let i = 0; i < vector.length; i++) {
            vector[i] = x[i] * v;
        }
        return vector;
    }

    export function findxconju(x, lamda, d) {
        let xnew = new Array(x.length);
        let vector = vectorx(d, lamda);
        for (let i = 0; i < xnew.length; i++) {
            xnew[i] = x[i] + vector[i];
        }
        return xnew;
    }
    export function finderror(r) {
        let error = 0;
        for (let i = 0; i < r.length; i++) {
            error += Math.pow(r[i], 2);
        }   
        error = Math.sqrt(error);
        return error;
    }
    export function finda0(r, A, d) {
        let a0 = 0;
        let result1 = bxa(r, A);
        let result = bx1(result1, d);
        result1 = bxa(d, A);
        let result2 = bx1(result1, d);
        a0 = result / result2;
        return a0;
    }

    export function findd(r, a0, d) {
        let dxao = vectorx(d, a0);
        let newr = vectorx(r, -1);
        let dnew = new Array(d.length);
        for (let i = 0; i < d.length; i++) {
            dnew[i] = newr[i] + dxao[i];
        }
        return dnew;
    }
    
    export function eliminate(A) { 
        let steps = []; 
        let n = A.length;
        steps.push(A.map(row => [...row])); 
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (A[i][i] !== 0) {
                    let r = A[j][i] / A[i][i];
                    for (let k = i; k < n + 1; k++) {
                        A[j][k] -= r * A[i][k];     
                    }
                }
                steps.push(A.map(row => [...row])); 
            }
            
        }
        return A;
    }
    export function findXeliminate(A){
        console.log(A)
        let n = A.length;
        let X = [];
        const newx = [];
        const checkresult = [];
        for(let i=n-1;i>=0;i--){
                X[i] = A[i][n];
                if(A[i][i]===0){
                    alert('มีdivision error')
                    return
                }
            for(let k=i+1;k<n;k++){
                X[i]-=A[i][k]*X[k];
            }
            X[i]/=A[i][i];
            newx.push({iteration: i,result:X[i]})
        }
        const temp = []
        for(let i=newx.length-1;i>=0;i--){
            temp.push(newx[i])
        }
        console.log(checkresult)      
        return temp;
    }
    export function insertB(A, B) {
        let newarray = Array.from({ length: A.length }, () => Array(A[0].length + 1));
        

        for (let i = 0; i < A.length; i++) {
            for (let j = 0; j < A[0].length; j++) {
                newarray[i][j] = A[i][j];
            }

            newarray[i][A[0].length] = B[i]; 
        } 
        return newarray;
    }
    import React from 'react';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css'; 

