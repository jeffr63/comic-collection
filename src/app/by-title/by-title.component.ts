import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-by-title-list',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>issue-by-title works!</p> `,
  styles: [],
})
export class ByTitleListComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
