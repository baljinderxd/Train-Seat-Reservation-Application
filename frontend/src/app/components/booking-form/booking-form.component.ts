import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent {

  numberOfSeats: number = 1;
  maxSeats: number = 7;
  lastBookedSeats: string[] = [];
  errorMessage = '';

  constructor(private bookingService: BookingService) { }

  /**
   * Check if the booking form is valid. The form is valid if
   * the number of seats is between 1 and the maximum number of
   * seats available that is 7.
   * @returns {boolean} true if the form is valid, false otherwise
   */
  isFormValid(): boolean {
    return this.numberOfSeats > 0 && this.numberOfSeats <= this.maxSeats;
  }

  /**
   * Submits the booking form.
   * If the form is invalid, it displays an error message.
   * If the form is valid, it sends a request to the backend to
   * book the specified number of seats. If the booking is
   * successful, it resets the form and displays the booked
   * seats. If the booking fails, it displays the error message.
   */
  onSubmit() {
    if (!this.isFormValid()) {
      this.errorMessage = `Please enter a valid number of seats (1-${this.maxSeats})`;
      return;
    }

    this.bookingService.confirmBooking(this.numberOfSeats).then((response) => {
      this.errorMessage = '';
      this.numberOfSeats = 1;
      this.lastBookedSeats = response.data.bookedSeats;
      this.reLoadSeats();
    }).catch((error) => {
      this.lastBookedSeats = [];
      this.numberOfSeats = 1;
      this.errorMessage = error.response.data;
    })

  }

  /**
   * Reloads the seats by fetching the latest seat data from the backend.
   * Updates the seatsSubject with the new data to notify subscribers.
   * Logs an error message to the console if the fetch operation fails.
   */

  reLoadSeats() {
    this.bookingService.getSeatsForRow().then(seats => {
      this.bookingService.seatsSubject.next(seats.data);
    }).catch(error => {
      console.error(error);
    });
  }

  /**
   * Resets all seat bookings by sending a request to the backend.
   * If successful, updates the UI with a confirmation message, clears the
   * booked seats list. In case of an
   * error, displays the error message.
   */

  resetBookings() {
    this.bookingService.resetAllBookings().then((response) => {
      this.errorMessage = response.data.message;
      this.reLoadSeats();
      this.lastBookedSeats = [];
      this.numberOfSeats = 1;
    }).catch((error) => {
      this.errorMessage = error.response.message;
      this.numberOfSeats = 1;
    });
  }
}
