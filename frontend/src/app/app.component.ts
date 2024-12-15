import { Component } from '@angular/core';
import { SeatLayoutComponent } from './components/seat-layout/seat-layout.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [SeatLayoutComponent, BookingFormComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'Train Reservation Application';
}
