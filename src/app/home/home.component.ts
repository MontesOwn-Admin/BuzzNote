import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { AlertsComponent } from "../alerts/alerts.component";

@Component({
  selector: 'app-home',
  imports: [RouterLink, HeaderComponent, AlertsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  message: string | null = null;
  error: string | null = null;
}
