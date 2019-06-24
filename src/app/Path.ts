import {GraphNode} from './GraphNode';
import * as p5 from 'p5';

export class Path {
  public x1: GraphNode;
  public x2: GraphNode;
  public value;
  public p: p5;
  public centerY: number;
  public centerX: number;
  isPath = false;

  constructor(from: GraphNode, to: GraphNode, value: number) {
    this.isPath = false;
    this.x1 = from;
    this.x2 = to;
    this.value = value;
    this.centerY = (this.x1.y + this.x2.y) / 2;
    this.centerX = (this.x2.x + this.x1.x) / 2;
  }

  attachP5(p5Instance) {
    this.p = p5Instance;
  }

  drow() {
    this.p.angleMode(this.p.RADIANS);
    const offset = 30;

    this.p.push();
    if (this.isPath) {
      this.p.stroke('#ed0008');
    }
    this.p.line(this.x1.x, this.x1.y, this.x2.x, this.x2.y);
    this.p.pop();
    this.p.push();
    const angle = this.p.atan2(this.x1.y - this.x2.y, this.x1.x - this.x2.x);
    this.p.translate(this.centerX, this.centerY);
    this.p.rotate(angle - this.p.HALF_PI);
    this.p.angleMode(this.p.DEGREES);
    if (this.isPath) {
      this.p.fill('#ed0008');
    }
    this.p.triangle(-offset * 0.5, offset * 0.5, offset * 0.5, offset * 0.5, 0, -offset / 2);
    this.p.pop();
    this.p.textSize(16);
    this.p.text(this.value, this.centerX + 2, this.centerY + 3);
    this.p.textSize(35);
  }

}
