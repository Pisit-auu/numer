import React from 'react';
import { BlockMath } from 'react-katex';

const ArrayDisplay = ({ matrix }) => {

  const matrixToLaTeX = (matrix) => {
    const rows = matrix.map(row => Array.isArray(row) ? row.join(' & ') : row).join(' \\\\ ');
    return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
  };

  return (
    <BlockMath math={matrixToLaTeX(matrix)} />
  );
};

export default ArrayDisplay;