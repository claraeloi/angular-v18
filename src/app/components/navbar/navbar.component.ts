import { Component, input, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  drawerOpened = input<boolean>()
  toggleDrawer = output()
  opened: boolean = false

  toggleSidebar() {
    this.opened = !this.opened
    this.toggleDrawer.emit();
  }
}
