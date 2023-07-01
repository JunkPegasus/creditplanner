import { BuildingSocietySaverBridgedModel } from './buildingSocietySaverBridged.model';
import { EChartsOption } from 'echarts';
import { BuildingSocietySaverModel } from './buildingSocietySaver.model';
import { CreditModel } from './credit.model';

export interface CalculationInterface {
  cost: number;
  cash: number;
  timestamp: Date;
  buildingSocietySavers: Array<BuildingSocietySaverModel>;
  credits: Array<CreditModel>;
  buildingSocietySaversBridged: Array<BuildingSocietySaverBridgedModel>;
}
export class CalculationModel {
  public cost: number;
  public cash: number;
  public timestamp: Date;
  public buildingSocietySavers: Array<BuildingSocietySaverModel>;
  public credits: Array<CreditModel>;
  public buildingSocietySaversBridged: Array<BuildingSocietySaverBridgedModel>;
  public chartData: EChartsOption;

  constructor(data: CalculationInterface) {
    this.cost = data.cost;
    this.timestamp = data.timestamp;
    this.buildingSocietySavers = data.buildingSocietySavers.map(item => { return new BuildingSocietySaverModel(item.id, item.sum, item.interest, item.monthlyRate) });
    this.credits =  data.credits.map(item => { return new CreditModel(item.id, item.sum, item.interest, item.acquittance) });
    this.buildingSocietySaversBridged = data.buildingSocietySaversBridged.map(item => { return new BuildingSocietySaverBridgedModel(item.id, item.sum, item.interest, item.monthlyRate, item.bridgeSum, item.bridgeInterest, item.bridgeRunTime) })
    this.cash = data.cash;
    this.chartData = this.calculateChartData();

  }

  private calculateChartData(): EChartsOption {
    let xAxisData = [];
    let seriesSumData = [];
    let seriesInterestData = [];
    if(this.buildingSocietySavers.length > 0) {
      xAxisData.push('Bausparer');
      seriesSumData.push(this.buildingSocietySavers.map(item => item.sum).reduce((a,b) => a + b, 0));
      seriesInterestData.push(this.buildingSocietySavers.map(item => item.result.interestSum).reduce((a,b) => a + b, 0));
    }
    if(this.credits.length > 0) {
      xAxisData.push('Darlehen');
      seriesSumData.push(this.credits.map(item => item.sum).reduce((a,b) => a + b, 0));
      seriesInterestData.push(this.credits.map(item => item.result.interestSum).reduce((a,b) => a + b, 0));
    }
    if(this.buildingSocietySaversBridged.length > 0) {
      xAxisData.push('Bausparer (überbrückt)');
      seriesSumData.push(this.buildingSocietySaversBridged.map(item => item.sum).reduce((a,b) => a + b, 0));
      seriesInterestData.push(this.buildingSocietySaversBridged.map(item => item.result.interestSum).reduce((a,b) => a + b, 0));
    }



    let data: EChartsOption = {
      xAxis: {
        data: xAxisData
      },
      yAxis: {
        name: '€'
      },
      series: [
        {
          name: 'Summe',
          type: 'bar',
          data: seriesSumData,
          stack: 'x',
          color: '#3E4E50'
        },
        {
          name: 'Zinsen',
          type: 'bar',
          data: seriesInterestData,
          stack: 'x',
          color: '#f84914'
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
    let sum = this.buildingSocietySaversSum() + this.buildingSocietySaversBridgedSum();
    let percent = sum / this.cost * 100;
    return `${percent}%`;
  }
  buildingSocietySaversPercent(): number {
    let sum = this.buildingSocietySaversSum() + this.buildingSocietySaversBridgedSum();
    return sum / this.cost * 100;
  }
  hasBuildingSocietySavers(): boolean {
    return this.buildingSocietySavers?.length > 0;
  }

  buildingSocietySaversBridgedSum(): number {
    let sum = 0;
    this.buildingSocietySaversBridged.forEach( el => {
      sum += el.sum;
    });
    return sum;
  }
  buildingSocietySaversBridgedPercent(): number {
    let sum = this.buildingSocietySaversBridgedSum();
    return sum / this.cost * 100;
  }
  hasBuildingSocietySaversBridged(): boolean {
    return this.buildingSocietySaversBridged?.length > 0;
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
