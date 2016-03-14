import { h } from 'virtual-dom';
import hyperx from 'hyperx';

const hx = hyperx(h);

export default function() {
  return hx`<div>
    <div>such universal javascript!</div>
    <div>very client server</div>
  </div>`;
};
