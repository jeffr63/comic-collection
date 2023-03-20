import { Component, inject, OnInit, signal } from "@angular/core";
import { NgIf } from "@angular/common";
import { Router } from "@angular/router";

import { Column } from "../models/column";
import { DisplayTableComponent } from "../shared/display-table.component";
import { Publisher } from "../models/publisher";
import { PublisherService } from "../services/publisher.service";

@Component({
  selector: "app-by-publisher",
  standalone: true,
  imports: [DisplayTableComponent, NgIf],
  template: `
    <section class="mt-5">
      <app-display-table
        *ngIf="publishers"
        [includeAdd]="false"
        [isAuthenticated]="false"
        [isFilterable]="true"
        [isPageable]="true"
        [paginationSizes]="[5, 10, 25, 100]"
        [defaultPageSize]="10"
        [disableClear]="true"
        [tableData]="publishers()"
        [tableColumns]="columns"
        (open)="open($event)"
      ></app-display-table>
    </section>
  `,
  styles: [
    `
      table {
        width: 100%;
      }
      section {
        margin: 10px 20px;
      }
    `,
  ],
})
export default class ByPublisherComponent implements OnInit {
  publisherService = inject(PublisherService);
  router = inject(Router);

  columns: Column[] = [
    {
      key: "name",
      name: "Publisher",
      width: "300px",
      type: "sort",
      position: "left",
      sortDefault: true,
    },
    {
      key: "view",
      name: "",
      width: "50px",
      type: "view",
      position: "left",
    },
  ];

  loading = signal(false);
  publishers = signal<Publisher[]>([]);

  ngOnInit(): void {
    this.getAllPublishers();
  }

  async getAllPublishers() {
    const publishers = await this.publisherService.getAll();
    this.publishers.set(publishers);
  }

  open(id: number) {
    this.router.navigate(["/by_publisher", id]);
  }
}
