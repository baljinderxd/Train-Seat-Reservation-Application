import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Seat } from '../models/seat.model';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  //Defined seats array, observable, and subject to update and share data for seats from multiple components
  private seats: Seat[] = [];
  public seatsSubject = new BehaviorSubject<Seat[]>(this.seats);
  public seats$ = this.seatsSubject.asObservable();

  private apiUrl = 'https://train-seat-reservation-backend-seven.vercel.app';

  /**
   * Resets all seat bookings.
   * @returns {Promise<AxiosResponse<any>>} A promise that resolves to the response.
   */
  resetAllBookings() {
    return axios.post(`${this.apiUrl}/reset`);
  }

  /**
   * Sends a request to the backend to reserve a specified number of seats.
   * @param {number} numberOfSeats - The number of seats to be reserved.
   * @returns {Promise<AxiosResponse<any>>} A promise that resolves to the response from the server.
   */

  confirmBooking(numberOfSeats: number) {
    return axios.post(`${this.apiUrl}/reserve`, { numberOfSeats });
  }

  /**
   * Retrieves the seats data from the backend.
   * @returns {Promise<AxiosResponse<any>>} A promise that resolves to the response from the server.
   */
  getSeatsForRow() {
    return axios.get(`${this.apiUrl}/seats`);
  }

}
