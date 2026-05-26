import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiedraPapelTijera } from './piedra-papel-tijera';

describe('PiedraPapelTijera', () => {

  let component: PiedraPapelTijera;

  let fixture: ComponentFixture<PiedraPapelTijera>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({

      imports: [PiedraPapelTijera]

    })
    .compileComponents();

    fixture =
      TestBed.createComponent(PiedraPapelTijera);

    component = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});