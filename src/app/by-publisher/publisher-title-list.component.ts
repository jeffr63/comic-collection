import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publisher-title-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      publisher works!
    </p>
  `,
  styles: [
  ]
})
export class PublisherTitleListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
