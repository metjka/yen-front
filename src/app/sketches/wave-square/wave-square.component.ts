import {Component, OnInit} from '@angular/core';
import * as p5 from 'p5';

@Component({
  selector: 'app-wave-square',
  templateUrl: './wave-square.component.html',
  styleUrls: ['./wave-square.component.css']
})
export class WaveSquareComponent implements OnInit {
  private p5: p5;

  constructor() {
  }

  ngOnInit() {
    this.createCanvas();
  }

  private createCanvas() {
    this.p5 = new p5(this.drawing);
  }


  private drawing = (p: p5) => {
    const objects: Array<Square> = [];

    p.setup = () => {
      p.createCanvas(400, 400).parent('canvas');
      p.noStroke();
      p.background('#000000');
      p.angleMode(p.DEGREES);
      p.rectMode(p.CENTER);

      const count = 15;
      const padding = 13;
      const q = (400 / count);
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          objects.push(new Square(p, (i * q) + padding, (j * q) + padding));
        }
      }

    };
    p.draw = () => {
      p.background('#ff4a4f');
      objects.forEach(item => {
        item.draw();
      });
    };
  }

}


export class Square {
  private degree;
  private size;
  private color;
  private clockwise = true;

  constructor(private p: p5, private x: number, private y: number) {
    this.degree = 0;
    this.size = 20;
    this.color = '#d62323';

  }

  draw() {
    this.p.fill(this.color);
    this.p.push();
    this.p.translate(this.x, this.y);
    this.p.rotate(this.degree);
    this.p.square(0, 0, this.size);
    this.p.pop();

    if (this.clockwise) {
      this.degree = this.degree + 2;
    } else {
      this.degree = this.degree - 2;
    }

    if (this.degree > 90) {
      this.clockwise = !this.clockwise;
    }
    if (this.degree < 0) {
      this.clockwise = !this.clockwise;
    }
    // if (this.p.frameCount % 20) {
    //   this.size = this.size - this.p.random(0, 2);
    //   if (this.size < 10) {
    // this.size = this.p.random(20, 30);
    // }
    // }
  }
}
