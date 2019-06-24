import * as p5 from 'p5';

export class GraphNode {
  public p: p5;
  public name;
  public x: number;
  public y: number;
  isPath = false;

  constructor(name: string, x: number, y: number) {
    this.name = name;
    this.x = x;
    this.y = y;
  }

  drow() {
    this.p.push();
    if (this.isPath) {
      this.p.fill('#00ad1d');
    }
    this.p.circle(this.x, this.y, 50);
    this.p.pop();
    this.p.text(this.name, this.x, this.y + 2);
  }

  attachP5(p: p5) {
    this.p = p;
  }
}
