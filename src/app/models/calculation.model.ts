import { EChartsOption } from 'echarts';
import { BuildingSocietySaverModel } from './buildingSocietySaver.model';
import { CreditModel } from './credit.model';

export interface CalculationInterface {
  cost: number;
  cash: number;
  timestamp: Date;
  buildingSocietySavers: Array<BuildingSocietySaverModel>;
  credits: Array<CreditModel>
}
export class CalculationModel {
  public cost: number;
  public cash: number;
  public timestamp: Date;
  public buildingSocietySavers: Array<BuildingSocietySaverModel>;
  public credits: Array<CreditModel>;
  public chartData: EChartsOption;

  constructor(data: CalculationInterface) {
    this.cost = data.cost;
    this.timestamp = data.timestamp;
    this.buildingSocietySavers = data.buildingSocietySavers.map(item => { return new BuildingSocietySaverModel(item.id, item.sum, item.interest, item.monthlyRate) });
    this.credits =  data.credits.map(item => { return new CreditModel(item.id, item.sum, item.interest, item.acquittance) });
    this.cash = data.cash;
    this.chartData = this.calculateChartData();

  }

  private calculateChartData(): EChartsOption {
    let data: EChartsOption = {
      xAxis: {
        data: ['Bausparer', 'Darlehen']
      },
      yAxis: {
        name: '€'
      },
      series: [
        {
          name: 'Summe',
          type: 'bar',
          data: [this.buildingSocietySavers.map(item => item.sum).reduce((a,b) => a + b, 0), this.credits.map(item => item.sum).reduce((a,b) => a + b, 0)],
          stack: 'x'
        },
        {
          name: 'Zinsen',
          type: 'bar',
          data: [this.buildingSocietySavers.map(item => item.result.interestSum).reduce((a,b) => a + b, 0), this.credits.map(item => item.result.interestSum).reduce((a,b) => a + b, 0)],
          stack: 'x'
        }
      ],
      legend: {
        data: ['Summe','Zinsen']
      },
      grid: {
        show: true
      },
      tooltip: {
        show: true,
        trigger: 'axis'
      }
    }

    return data;
  }

  buildingSocietySaversSum(): number {
    let sum = 0;
    this.buildingSocietySavers.forEach( el => {
      sum += el.sum;
    });
    return sum;
  }
  buildingSocietySaversPercentStyle(): string {
    let sum = this.buildingSocietySaversSum();
    let percent = sum / this.cost * 100;
    return `${percent}%`;
  }
  buildingSocietySaversPercent(): number {
    let sum = this.buildingSocietySaversSum();
    return sum / this.cost * 100;
  }
  hasBuildingSocietySavers(): boolean {
    return this.buildingSocietySavers?.length > 0;
  }


  cashPercentStyle(): string {
    let percent = this.cash / this.cost * 100;
    return `${percent}%`;
  }
  cashPercent(): number {
    return this.cash / this.cost * 100;
  }


  creditSum(): number {
    let sum = 0;
    this.credits.forEach( el => {
      sum += el.sum;
    });
    return sum;
  }
  creditPercentStyle(): string {
    let sum = this.creditSum();
    let percent = sum / this.cost * 100;
    return `${percent}%`;
  }
  creditPercent(): number {
    let sum = this.creditSum();
    return sum / this.cost * 100;
  }
  hasCredits(): boolean {
    return this.credits?.length > 0;
  }

}
