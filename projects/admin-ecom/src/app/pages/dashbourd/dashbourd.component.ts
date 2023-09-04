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
import { Chart, registerables } from 'chart.js';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { OrdersService, order } from 'ecomLib';

@Component({
  selector: 'app-dashbourd',
  templateUrl: './dashbourd.component.html',
  styleUrls: ['./dashbourd.component.css'],
})
export class DashbourdComponent
  implements OnInit, AfterViewInit, AfterContentInit
{
  private breakpointObserver = inject(BreakpointObserver);
  data!: { data: order[]; day: Date }[];
  orders!: order[];
  $lineChart: BehaviorSubject<Chart | null> = new BehaviorSubject<Chart | null>(
    null
  );
  linechart!: Chart | null;
  $totalPrice: BehaviorSubject<number> = new BehaviorSubject(0);
  totalPrice!: number;
  @ViewChild('myLinechart') canvasRef!: ElementRef<HTMLCanvasElement>;
  constructor(private orderService: OrdersService) {
    this.$totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });
    this.orderService.$orders.subscribe((data) => {
      this.orders = data;
      data.forEach((data) => {
        this.$totalPrice.next(this.totalPrice + data.price);
      });
    });
    this.orders.forEach((data) => {
      this.$totalPrice.next(this.totalPrice + data.price);
    });
    const token = localStorage.getItem('token');
    if (token) {
      this.orderService.getAllOrders(token);
    }
    this.orderService.getDashbourdOrders();
    this.orderService.$dashbourdOrders.subscribe((data) => {
      this.data = data;
      this.createChart();
    });
    this.$lineChart.subscribe((data) => {
      this.linechart = data;
    });
  }
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      this.createChart();
      if (matches) {
        return [
          { title: 'last week Revenue', cols: 2, rows: 1, data: 'chart' },
          { title: 'total price', cols: 2, rows: 1, data: 'price' },
        ];
      }

      return [
        { title: 'last week Revenue', cols: 1, rows: 1, data: 'chart' },
        { title: 'total price', cols: 1, rows: 1, data: 'price' },
      ];
    })
  );
  createChart() {
    Chart.register(...registerables);
    let mondayPrice: number = 0;
    let tuesday = 0;
    let wedprice = 0;
    let thursprice = 0;
    let fridayproce = 0;
    let satProce = 0;
    let sunDayprice = 0;
    console.log(this.data);
    this.data.forEach((data) => {
      const days = new Date(data.day);
      if (days.getDay() === 0) {
        data.data.forEach((order) => {
          sunDayprice += order.price;
        });
      } else if (days.getDay() === 1) {
        data.data.forEach((order) => {
          mondayPrice += order.price;
        });
      } else if (days.getDay() === 2) {
        data.data.forEach((order) => {
          tuesday += order.price;
        });
      } else if (days.getDay() === 3) {
        data.data.forEach((order) => {
          wedprice += order.price;
        });
      } else if (days.getDay() === 4) {
        data.data.forEach((order) => {
          thursprice += order.price;
        });
      } else if (days.getDay() === 5) {
        data.data.forEach((order) => {
          fridayproce += order.price;
        });
      } else if (days.getDay() === 6) {
        data.data.forEach((order) => {
          satProce += order.price;
        });
      }
    });
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
  ngAfterViewInit(): void {}
  ngAfterContentInit(): void {}
}
