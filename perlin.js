class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
}



class Matrix {
  constructor(rows, cols, defaultValue) {
    this.data = Array(rows).fill(null).map(() => Array(cols).fill(defaultValue));
  }

  addEntry(row, col, value) {
    this.data[row][col] = value;
  }
}
function basicDistMat(n) {
  return new Matrix(n, n, new Vector(0, 0, 0));
}

function normalizeDist(p) {
  return new Vector(p.x / Math.sqrt(2), p.y / Math.sqrt(2), p.z / Math.sqrt(2));
}

function distanceMatrix(mat, size, x, y) {
  const distanceMatrixHelper = (mat, x, y, xHold, yHold) => {
    if (y - yHold >= size) return mat;
    if (x - xHold >= size) return distanceMatrixHelper(mat, xHold, y + 1, xHold, yHold);

    mat.addEntry(y - yHold, x - xHold, normalizeDist(new Vector(x, y, 0)));
    return distanceMatrixHelper(mat, x + 1, y, xHold, yHold);
  }

  return distanceMatrixHelper(mat, x, y, x, y);
}

function smooth(n) {
  return 6 * Math.pow(n, 5) - 15 * Math.pow(n, 4) + 10 * Math.pow(n, 3);
}

function interpolate(ul, ur, ll, lr, fx, fy) {
  const smoothX = smooth(fx);
  const smoothY = smooth(fy);

  const i1 = (ur - ul) * smoothX + ul;
  const i2 = (lr - ll) * smoothX + ll;

  return (i1 - i2) * smoothY + i2;
}

function dotGradDist(random, distanceVector) {
  const gradients = [
    new Vector(1, 1, 0),
    new Vector(-1, 1, 0),
    new Vector(1, -1, 0),
    new Vector(-1, -1, 0)
  ];

  return distanceVector.dot(gradients[random % gradients.length]);
}

function gradientOfPixelFbm(freq, randomValues, pixelPos) {
  x_float = pixelPos.getX();
  y_float = pixelPos.getY();
  x_pos = Math.abs(x_float);
  y_pos = Math.abs(y_float);

  // Top Left
  g1 = randomValues[x_pos % 256]
  g1_final = randomValues[((g1 + yPos + 1) % 256) % 4]

  // Top Right
  g2 = randomValues[(x_pos + 1) % 256]
  g2_final = randomValues[((g2 + y_pos + 1) % 256) % 4]

  // Bottom Left
  g3 = randomValues[x_pos % 256]
  g3_final = randomValues[((g3 + y_pos) % 256) % 4]

  // Bottom Right
  g4 = randomValues[(x_pos + 1) % 256]
  g4_final = randomValues[((g4 + y_pos) % 256) % 4]

  // Prepare to interpolate
  frac_x = x_float - Math.floor(x_float)
  frac_y = y_float - Math.floor(y_float)
  d1 = dotGradDist(g1_final, (frac_x, frac_y - 1, 0))
  d2 = dotGradDist(g2_final, (frac_x - 1, fracy - 1, 0))
  d3 = dotGradDist(g3_final, (frac_x, frac_y, 0))
  d4 = dotGradDist(g4_final, (frac_x - 1, frac_y, 0))
  interpolate(d1, d2, d3, d4, frac_x, frac_y)
}
