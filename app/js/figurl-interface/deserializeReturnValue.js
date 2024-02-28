// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deserializeReturnValue = (x) => {
  if (!x) return x;
  else if (typeof x === 'object') {
    if (Array.isArray(x)) {
      return x.map((a) => deserializeReturnValue(a));
    } else if (x._type === 'ndarray') {
      const shape = x.shape;
      const dtype = x.dtype;
      const data_b64 = x.data_b64;
      const dataBuffer = _base64ToArrayBuffer(data_b64);
      switch (dtype) {
        case 'float32':
          return applyShape(new Float32Array(dataBuffer), shape);
        case 'int32':
          return applyShape(new Int32Array(dataBuffer), shape);
        case 'int16':
          return applyShape(new Int16Array(dataBuffer), shape);
        case 'int8':
          return applyShape(new Int8Array(dataBuffer), shape);
        case 'uint32':
          return applyShape(new Uint32Array(dataBuffer), shape);
        case 'uint16':
          return applyShape(new Uint16Array(dataBuffer), shape);
        case 'uint8':
          return applyShape(new Uint8Array(dataBuffer), shape);
        default:
          throw Error(`Datatype not yet implemented for ndarray: ${dtype}`);
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ret = {};
      for (const k in x) {
        ret[k] = deserializeReturnValue(x[k]);
      }
      return ret;
    }
  } else return x;
};

const applyShape = (
  x,
  shape
) => {
  if (shape.length === 1) {
    if (shape[0] !== x.length) throw Error('Unexpected length of array');
    return Array.from(x);
  } else if (shape.length === 2) {
    const n1 = shape[0];
    const n2 = shape[1];
    if (n1 * n2 !== x.length) throw Error('Unexpected length of array');
    const ret = [];
    for (let i1 = 0; i1 < n1; i1++) {
      ret.push(Array.from(x.slice(i1 * n2, (i1 + 1) * n2)));
    }
    return ret;
  } else if (shape.length === 3) {
    const n1 = shape[0];
    const n2 = shape[1];
    const n3 = shape[2];
    if (n1 * n2 * n3 !== x.length) throw Error('Unexpected length of array');
    const ret = [];
    for (let i1 = 0; i1 < n1; i1++) {
      const A = [];
      for (let i2 = 0; i2 < n2; i2++) {
        A.push(Array.from(x.slice(i1 * n2 * n3 + i2 * n3, i1 * n2 * n3 + (i2 + 1) * n3)));
      }
      ret.push(A);
    }
    return ret;
  } else if (shape.length === 4) {
    const n1 = shape[0];
    const n2 = shape[1];
    const n3 = shape[2];
    const n4 = shape[3];
    if (n1 * n2 * n3 * n4 !== x.length) throw Error('Unexpected length of array');
    const ret = [];
    for (let i1 = 0; i1 < n1; i1++) {
      const A = [];
      for (let i2 = 0; i2 < n2; i2++) {
        const B = [];
        for (let i3 = 0; i3 < n3; i3++) {
          B.push(
            Array.from(
              x.slice(i1 * n2 * n3 * n4 + i2 * n3 * n4 + i3 * n4, i1 * n2 * n3 * n4 + i2 * n3 * n4 + (i3 + 1) * n4)
            )
          );
        }
        A.push(B);
      }
      ret.push(A);
    }
    return ret;
  } else if (shape.length === 5) {
    const n1 = shape[0];
    const n2 = shape[1];
    const n3 = shape[2];
    const n4 = shape[3];
    const n5 = shape[4];
    if (n1 * n2 * n3 * n4 * n5 !== x.length) throw Error('Unexpected length of array');
    const request = [];
    for (let i1 = 0; i1 < n1; i1++) {
      const A = [];
      for (let i2 = 0; i2 < n2; i2++) {
        const B = [];
        for (let i3 = 0; i3 < n3; i3++) {
          const C = [];
          for (let i4 = 0; i4 < n4; i4++) {
            C.push(
              Array.from(
                x.slice(
                  i1 * n2 * n3 * n4 * n5 + i2 * n3 * n4 * n5 + i3 * n4 * n5 + i4 * n5,
                  i1 * n2 * n3 * n4 * n5 + i2 * n3 * n4 * n5 + i3 * n4 * n5 + (i4 + 1) * n5
                )
              )
            );
          }
          B.push(C);
        }
        A.push(B);
      }
      ret.push(A);
    }
    return ret;
  } else {
    throw Error('Not yet implemented');
  }
};

const _base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

export default deserializeReturnValue;
