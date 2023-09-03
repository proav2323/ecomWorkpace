import { TestBed } from '@angular/core/testing';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
  numberAttribute,
} from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { OrdersService, order } from 'ecomLib';
import { Chart, registerables } from 'chart.js';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-dashbourd',
  templateUrl: './dashbourd.component.html',
  styleUrls: ['./dashbourd.component.css'],
})
export class DashbourdComponent implements OnInit, AfterViewInit {
  private breakpointObserver = inject(BreakpointObserver);
  data!: { data: order[]; day: Date }[];
  $lineChart: BehaviorSubject<Chart | null> = new BehaviorSubject<Chart | null>(
    null
  );
  linechart!: Chart | null;
  @ViewChild('myLinechart') canvasRef!: ElementRef<HTMLCanvasElement>;
  constructor(private orderService: OrdersService) {
    this.orderService.$dashbourdOrders.subscribe((data) => {
      this.data = data;
    });
    this.$lineChart.subscribe((data) => {
      this.linechart = data;
    });
  }
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Revenue', cols: 2, rows: 1, data: 'chart' },
          { title: 'Card 2', cols: 2, rows: 1, data: '' },
          { title: 'Card 3', cols: 2, rows: 1, data: '' },
          { title: 'Card 4', cols: 2, rows: 1, data: '' },
        ];
      }

      return [
        { title: 'Revenue', cols: 2, rows: 1, data: 'chart' },
        { title: 'Card 2', cols: 1, rows: 1, data: '' },
        { title: 'Card 3', cols: 1, rows: 2, data: '' },
        { title: 'Card 4', cols: 1, rows: 1, data: '' },
      ];
    })
  );
  createChart() {
    Chart.register(...registerables);
    let mondayPrice: number = 100;
    let tuesday = 30;
    let wedprice = 40;
    let thursprice = 40;
    let fridayproce = 60;
    let satProce = 80;
    let sunDayprice = 90;
    if (this.canvasRef !== null && this.canvasRef !== undefined) {
      console.log('hi');
      let linechart = new Chart(
        this.canvasRef.nativeElement.getContext('2d')!,
        {
          type: 'line',
          data: {
            labels: ['mon', 'tues', 'wed', 'thur', 'fir', 'sat', 'sun'],
            datasets: [
              {
                label: '# of prices',
                data: [
                  mondayPrice,
                  tuesday,
                  wedprice,
                  thursprice,
                  fridayproce,
                  satProce,
                  sunDayprice,
                ],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        }
      );
      this.$lineChart.next(linechart);
    }
  }
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.createChart();
  }
}
