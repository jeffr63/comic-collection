import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-by-publisher',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>issue-by-publisher works!</p> `,
  styles: [],
})
export class ByPublisherComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
