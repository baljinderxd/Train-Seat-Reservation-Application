import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { SeatRowComponent } from '../seat-row/seat-row.component';
import { Seat } from '../../models/seat.model';

@Component({
  selector: 'app-seat-layout',
  standalone: true,
  imports: [CommonModule, SeatRowComponent],
  templateUrl: './seat-layout.component.html',
  styleUrls: ['./seat-layout.component.css']
})
export class SeatLayoutComponent implements OnInit {
  rows: number[] = [];
  totalRows: number = 12;
  seats: Seat[] = [];

  /**
   * Initializes the component by fetching the seats data from the BookingService.
   * It also subscribes to the seats$ observable in the BookingService to receive
   * updates to the seats data.
   */
  constructor(private bookingService: BookingService) {
    //Subscribe to seats data observable
    this.bookingService.seats$.subscribe(seats => {
      this.seats = seats;
    });

    //Fetch seats data from DB on initalization
    this.bookingService.getSeatsForRow().then(seats => {
      this.seats = seats.data;
    }).catch(error => {
      console.error(error);
    });
  }

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound
   * properties. It is used to initialize the rows array with numbers from 1
   * to totalRows that is 12.
   */
  ngOnInit() {
    this.rows = Array.from({ length: this.totalRows }, (_, i) => i + 1);
  }

  /**
   * Filters the seats array by row number and returns the filtered result.
   * It is used by the SeatRowComponent to get the seats for the current row.
   * @param row The row number to filter by.
   * @returns The filtered seats data.
   */
  getSeatsForRow(row: number) {
    return this.seats.filter(seat => seat.row === row);
  }
}
