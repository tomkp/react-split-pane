import { render, unmountComponentAtNode } from 'react-dom';

let testDiv;

export const renderComponent = (jsx, dimensions) => {
  const { width = 800, height = 800} = dimensions;

  if (!testDiv) {
    testDiv = document.createElement('div');
    document.body.appendChild(testDiv);
  }

  testDiv.setAttribute(
    'style',
    `margin:0; height: ${height}px; width: ${width}px; background: yellow;`
  );
  document.body.setAttribute(
    'style',
    'margin:0; padding: 0;'
  );

  return render(jsx, testDiv);
};

export const unmountComponent = () => {
  unmountComponentAtNode(testDiv);
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

  coordinates.push({ clientX: x0, clientY: y0 });

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
