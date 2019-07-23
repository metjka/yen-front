import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveSquareComponent } from './wave-square.component';

describe('WaveSquareComponent', () => {
  let component: WaveSquareComponent;
  let fixture: ComponentFixture<WaveSquareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaveSquareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
