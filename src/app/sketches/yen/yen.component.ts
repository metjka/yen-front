import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import * as p5 from 'p5';
import {HttpClient} from '@angular/common/http';
import {Path} from './path';
import {GraphNode} from './graph-node';


@Component({
  selector: 'app-yen',
  templateUrl: './yen.component.html',
  styleUrls: ['./yen.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YenComponent implements OnInit {
  title = 'yen-front';

  p5: p5;
  isResponseLoaded = false;
  response = [];
  isGraphLoaded = false;
  isAttachedP5 = false;

  newFrom = '';
  newTo = '';

  from = 'C';
  to = 'H';

  newValue = '';
  graph = [
    ['C', 'D', 3],
    ['C', 'E', 2],
    ['E', 'D', 1],
    ['E', 'G', 3],
    ['E', 'F', 2],
    ['D', 'F', 4],
    ['F', 'G', 2],
    ['F', 'H', 1],
    ['G', 'H', 2]
  ];

  private graphNodes: GraphNode[];

  private paths: Path[];

  showGraph() {
    return this.graph;
  }

  modelChanged(position: number, number: number, value: string) {
    this.graph[position][number] = +value;
    this.cdRef.markForCheck();
    console.log(this.graph);
  }

  constructor(protected http: HttpClient, protected cdRef: ChangeDetectorRef) {
    this.isGraphLoaded = true;
    this.solveGraph();
  }

  solveGraph() {
    const graphString = this.graphToString(this.graph);
    this.isGraphLoaded = false;
    this.isAttachedP5 = false;
    if (!this.from.length || !this.to.length) {
      return;
    }
    // tslint:disable-next-line:max-line-length
    this.http.post(`http://localhost:8080/yen?from=${this.from.toUpperCase()}&to=${this.to.toUpperCase()}`,
      graphString, {responseType: 'json'})
      .subscribe((value: any) => {
        this.response = value;
        this.parseGraph(this.graph);
        this.isResponseLoaded = true;
        this.isGraphLoaded = true;
        console.log(value);
        this.cdRef.markForCheck();
      }, err => console.log(err));
  }

  ngOnInit(): void {
    this.parseGraph(this.graph);
    this.createCanvas();
  }

  getResult() {
    if (this.isResponseLoaded) {
      console.log(this.response);
      return this.response.map((line: {edges: any[], totalCost: number}) => {
        let kek = '';
        line.edges.forEach(edge => {
          kek = kek + edge.fromNode + '-';
        });
        const last = line.edges[line.edges.length - 1];
        return kek + last.toNode + ', total cost:' + line.totalCost;
      });
    }
  }

  parseGraph(graph) {
    const nodes = new Set();
    const paths: Path[] = [];
    graph
      .forEach((value) => {
        const [from, to, pathValue] = value;
        nodes.add(from);
        nodes.add(to);
      });

    const nodesAsArray = Array.from(nodes);
    const angel = 360 / nodesAsArray.length;

    p5.prototype.angleMode(p5.prototype.DEGREES);
    this.graphNodes = nodesAsArray.map((node, index) => {
      const x = (150 * p5.prototype.cos(angel * (index))) + 250;
      const y = (150 * p5.prototype.sin(angel * (index))) + 250;
      return new GraphNode(node, x, y);
    });

    graph
      .forEach((value) => {
        const [from, to, pathValue] = value;
        const fromNode = this.graphNodes.find(node => node.name === from);
        const toNode = this.graphNodes.find(node => node.name === to);
        paths.push(new Path(fromNode, toNode, +pathValue));
      });
    this.paths = paths;
    console.log(this.graphNodes);
    console.log(paths);
  }

  private createCanvas() {
    this.p5 = new p5(this.drawing);
  }

  private drawing = (p: p5) => {
    p.setup = () => {
      p.createCanvas(500, 500).parent('canvas');
      p.angleMode(p.DEGREES);
    };
    p.draw = () => {
      p.background(100);
      p.textAlign(p.CENTER, p.CENTER);
      if (this.isGraphLoaded) {
        if (!this.isAttachedP5) {
          this.paths.forEach((path: Path) => path.attachP5(p));
          this.graphNodes.forEach((node: GraphNode) => node.attachP5(p));
          this.isAttachedP5 = true;
        }

        if (this.isResponseLoaded && this.response.length) {
          const bestPath = this.response[0].edges;
          const goldenPathElements: any[] = bestPath.map(edge => edge.fromNode);
          goldenPathElements.push(bestPath[bestPath.length - 1].toNode);
          this.paths = this.paths.map(value => {
            let foundBestPath = false;
            for (const road of bestPath) {
              if (value.x1.name === road.fromNode && value.x2.name === road.toNode) {
                foundBestPath = true;
                break;
              }
            }
            value.isPath = foundBestPath;
            return value;
          });
          this.graphNodes = this.graphNodes.map((value, index) => {
            if (goldenPathElements.some(value1 => value1 === value.name)) {
              value.isPath = true;
            }

            return value;
          });
        }

        this.paths.forEach((path: Path) => path.drow());
        this.graphNodes.forEach((node: GraphNode) => node.drow());
      }
    };
  }

  private graphToString(graph: (string | number)[][]) {
    return this.graph.map(value => {
      const [from, to, pathValue] = value;
      return `${from} ${to} ${pathValue}`;
    }).join('\n');
  }

  addConnection() {
    if (this.newFrom.length > 0 && this.newTo.length > 0 && this.newValue.length > 0 && Number.isInteger(+this.newValue)) {
      this.graph.push([this.newFrom.toUpperCase(), this.newTo.toUpperCase(), this.newValue]);
    }
  }

  fileUpload(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsText(file);
      reader.onload = () => {
        console.log(reader.result);
        this.graph = this.stringToGraph(reader.result as string);
      };
    }
  }

  private stringToGraph(result: string) {
    const graph = result
      .split('\n')
      .map(line => line.split(' '));
    return graph;
  }

  remove(position: number) {
    this.graph.splice(position, 1);
  }
}
