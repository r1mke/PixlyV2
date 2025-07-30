import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

// Registrujemo sve Chart.js komponente
Chart.register(...registerables);

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartDataset {
  label: string;
  data: number[];
  }

export interface LineChartData {
  labels: string[];
  datasets: ChartDataset[];
}


@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 400px;
    }
    
    canvas {
      max-width: 100%;
      max-height: 100%;
    }
  `]
})
export class LineChartComponent implements OnInit, OnDestroy, OnChanges {

  private readonly pixlyColors = {
    primary: '#02A388',
    primaryLight: 'rgba(255, 107, 107, 0.1)',
    primaryMedium: 'rgba(2, 163, 136, 0.3)',
    secondary: '#4299E1',
    secondaryLight: 'rgba(66, 153, 225, 0.1)',
    accent: '#FF6B6B',
    accentLight: 'rgba(255, 107, 107, 0.1)'
  };

  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @Input() data: LineChartData = {
    labels: [],
    datasets: []
  }; 
  @Input() fill: boolean = false;
  @Input() title: string = '';
  @Input() width: number = 500;
  @Input() height: number = 300;
  @Input() responsive: boolean = true;
  @Input() borderColor: string = this.pixlyColors.primary;
  @Input() backgroundColor: string = this.pixlyColors.primaryLight;
  @Input() pointBackgroundColor: string = this.pixlyColors.primary;
  @Input() pointBorderColor: string = '#ffffff';
  @Input() pointBorderWidth: number = 2;
  @Input() pointRadius: number = 5;
  @Input() pointHoverRadius: number = 7;
  @Input() tension: number = 0.4;
  @Input() borderWidth: number = 3;
  @Input() pointHoverBackgroundColor: string = '#3B82F6';
  @Input() pointHoverBorderColor: string = '#fff';
  @Input() pointHoverBorderWidth: number = 2;

  private chart: Chart | null = null;

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Kada se promijene input podaci, ažuriramo chart
    if (changes['data'] && this.chart) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    // Obavezno uništavamo chart kada se komponenta uništava
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    
    if (ctx) {
      const config: ChartConfiguration<'line'> = {
        type: 'line',
        data: {
          labels: this.data.labels,
          datasets: this.data.datasets.map(dataset => ({
            label: dataset.label,
            data: dataset.data,
            borderColor: this.borderColor || '#3B82F6',
            backgroundColor: this.backgroundColor || 'rgba(59, 130, 246, 0.1)',
            fill: this.fill !== undefined ? this.fill : false,
            tension: this.tension !== undefined ? this.tension : 0.4,
            pointBackgroundColor: this.pointBackgroundColor || this.borderColor || '#3B82F6',
            pointBorderColor: this.pointBorderColor || '#fff',
            pointBorderWidth: this.pointBorderWidth || 2,
            pointRadius: this.pointRadius || 5,
            pointHoverRadius: this.pointHoverRadius || 7,
            borderWidth: this.borderWidth || 2,
            pointHoverBackgroundColor: this.pointHoverBackgroundColor || this.pointBackgroundColor || this.borderColor || '#3B82F6',
            pointHoverBorderColor: this.pointHoverBorderColor || this.pointBorderColor || '#fff',
            pointHoverBorderWidth: this.pointHoverBorderWidth || this.pointBorderWidth || 2
          }))
        },
        options: {
          responsive: this.responsive,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: !!this.title,
              text: this.title,
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Period'
              },
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Vrijednost'
              },
              grid: {
                display: true,
                color: 'rgba(0, 0, 0, 0.1)'
              },
              beginAtZero: true
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          elements: {
            point: {
              hoverRadius: 8
            }
          }
        }
      };

      this.chart = new Chart(ctx, config);
    }
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.data.labels = this.data.labels;
      this.chart.data.datasets = this.data.datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        borderColor: this.borderColor || '#3B82F6',
        backgroundColor: this.backgroundColor || 'rgba(59, 130, 246, 0.1)',
        fill: this.fill !== undefined ? this.fill : false,
        tension: this.tension !== undefined ? this.tension : 0.4,
        pointBackgroundColor: this.pointBackgroundColor || this.borderColor || '#3B82F6',
        pointBorderColor: this.pointBorderColor || '#fff',
        pointBorderWidth: this.pointBorderWidth || 2,
        pointRadius: this.pointRadius || 5,
        pointHoverRadius: this.pointHoverRadius || 7,
        borderWidth: this.borderWidth || 2
      }));
      
      this.chart.update();
    }
  }

  // Javne metode za upravljanje chart-om
  public addDataPoint(label: string, values: number[]): void {
    if (this.chart) {
      this.chart.data.labels?.push(label);
      this.chart.data.datasets.forEach((dataset, index) => {
        if (values[index] !== undefined) {
          dataset.data.push(values[index]);
        }
      });
      this.chart.update();
    }
  }

  public removeLastDataPoint(): void {
    if (this.chart) {
      this.chart.data.labels?.pop();
      this.chart.data.datasets.forEach(dataset => {
        dataset.data.pop();
      });
      this.chart.update();
    }
  }

  public updateChartTitle(newTitle: string): void {
    this.title = newTitle;
    if (this.chart && this.chart.options.plugins?.title) {
      this.chart.options.plugins.title.text = newTitle;
      this.chart.update();
    }
  }
}