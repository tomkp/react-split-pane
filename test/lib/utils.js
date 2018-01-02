import { render } from 'react-dom';

export const renderComponent = jsx => {
  const testDiv = document.createElement('div');
  testDiv.setAttribute(
    'style',
    'margin:0; height: 600px; width: 600px; background: yellow;'
  );
  document.body.setAttribute(
    'style',
    'margin:0; padding: 0;'
  );
  document.body.appendChild(testDiv);
  return render(jsx, testDiv);
};



export const calculatePointsBetween = (from, to) => {
  let x0 = from.clientX;
  let y0 = from.clientY;
  let x1 = to.clientX;
  let y1 = to.clientY;

  let coordinates = [];
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = (x0 < x1) ? 1 : -1;
  let sy = (y0 < y1) ? 1 : -1;
  let err = dx - dy;

  coordinates.push({ x: x0, y: y0 });

  while (!((x0 === x1) && (y0 === y1))) {
    let e2 = err << 1;

    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }

    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }

    coordinates.push({ clientX: x0, clientY: y0 });
  }

  return coordinates;
};


export const getCentre = dimensions => {
  return {
    x: (dimensions.left + ((dimensions.right - dimensions.left) / 2)),
    y: (dimensions.top + ((dimensions.bottom - dimensions.top) / 2))
  };
};
