const box = document.querySelector('.sphere') as HTMLDivElement | null,
  ew = box ? box.offsetWidth : null,
  eh = box ? box.offsetHeight : null,
  prefixes = ['-o-', '-ms-', '-moz-', '-webkit-', ''];
let mx = 0,
  my = 0,
  mxOffset = 0,
  myOffset = 0,
  ex = 0,
  ey = 0,
  vx = 0,
  vy = 0,
  ww = window.innerWidth,
  wh = window.innerHeight,
  tracking = false;

function prefixCss(elem: HTMLDivElement, prop: String, val: String) {
  prefixes.forEach(prefix => (elem.style[prefix + prop] = val));
}

function setElemCoords(x: number, y: number) {
  prefixCss(
    box,
    'transform',
    'translate3d( ' + x.toString() + 'px, ' + y.toString() + 'px, 0)'
  );
  box.setAttribute('data-x', x.toString());
  box.setAttribute('data-y', y.toString());
  ex = x;
  ey = y;
}

function checkBounds() {
  if (ex + ew > ww) {
    if (tracking) {
      vx = 0;
    } else {
      vx = -vx * 0.7;
      vy *= 0.99;
    }
    ex = ww - ew;
  }

  if (ex < 0) {
    if (tracking) {
      vx = 0;
    } else {
      vx = -vx * 0.7;
      vy *= 0.99;
    }
    ex = 0;
  }

  if (ey + eh > wh) {
    if (tracking) {
      vy = 0;
    } else {
      vx *= 0.99;
      vy = -vy * 0.7;
    }
    ey = wh - eh;
  }

  if (ey < 0) {
    if (tracking) {
      vy = 0;
    } else {
      vx *= 0.99;
      vy = -vy * 0.7;
    }
    ey = 0;
  }
}

function mousedowncb() {
  tracking = true;
  setElemCoords(ex, ey);
  mxOffset = mx - ex;
  myOffset = my - ey;
}

function mouseupcb() {
  tracking = false;
}

function mousemovecb(e: MouseEvent) {
  mx = e.clientX;
  my = e.clientY;
}

function resizecb() {
  ww = window.innerWidth;
  wh = window.innerHeight;
}

function loop() {
  requestAnimationFrame(loop);
  if (tracking) {
    vx = (mx - mxOffset - ex) / 2;
    vy = (my - myOffset - ey) / 2;
  }
  vy += 0.9;
  vx *= 0.99;
  vy *= 0.99;
  ex += vx;
  ey += vy;
  checkBounds();
  setElemCoords(ex, ey);
}

function touchmovecb(e: TouchEvent) {
  mx = e.touches[0].clientX;
  my = e.touches[0].clientY;
}

// bind events
box.addEventListener('mousedown', mousedowncb, false);
window.addEventListener('mouseup', mouseupcb, false);
window.addEventListener('mousemove', mousemovecb, false);
window.addEventListener('resize', resizecb, false);

box.addEventListener('touchstart', mousedowncb, false);
window.addEventListener('touchend', mouseupcb, false);
window.addEventListener('touchmove', touchmovecb, false);

// set initial properties for element
setElemCoords(ex, ey);

loop();
