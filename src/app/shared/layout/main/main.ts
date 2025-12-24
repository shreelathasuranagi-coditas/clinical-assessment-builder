import { Component, viewChild } from '@angular/core';
import { Toolbar } from '../../components/toolbar/toolbar';
import { Button } from '../../components/button/button';
import { Header } from '../header/header';
import { Sidenav } from '../../components/sidenav/sidenav';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-main',
  imports: [Toolbar,Button,Header,Sidenav,RouterOutlet,Footer],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  sidenav = viewChild(Sidenav);

  toggleSidebar() {
    this.sidenav()?.toggle();
  }
}
