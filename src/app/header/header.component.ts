import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() backLink: string = "";
  @Input() year: string | undefined = undefined;
  @Input() showBackButton: boolean = true;
  @Input() showHR: boolean = false;

}
