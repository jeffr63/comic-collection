import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-title-issue-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      title-issue-list works!
    </p>
  `,
  styles: [
  ]
})
export class TitleIssueListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
