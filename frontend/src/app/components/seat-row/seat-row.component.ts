import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Seat } from '../../models/seat.model';

@Component({
  selector: 'app-seat-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-row.component.html',
  styleUrls: ['./seat-row.component.css']
})

//Defining input properties for component
export class SeatRowComponent {
  @Input() rowNumber!: number;
  @Input() seats: Seat[] = [];
  @Input() isLastRow = false;
}
