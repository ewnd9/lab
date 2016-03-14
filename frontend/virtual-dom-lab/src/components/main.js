import { h } from 'virtual-dom';
import hyperx from 'hyperx';

const hx = hyperx(h);

export default function() {
  return hx`<div>welcome</div>`;
};
