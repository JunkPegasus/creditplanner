import { BuildingSocietySaverBridgedModel } from './buildingSocietySaverBridged.model';
import { EChartsOption } from 'echarts';
import { BuildingSocietySaverModel } from './buildingSocietySaver.model';
import { CreditModel } from './credit.model';

export interface CalculationInterface {
  cost: number;
  cash: number;
  timestamp: Date;
  buildingSocietySaver: BuildingSocietySaverModel;
  credit: CreditModel;
  buildingSocietySaverBridged: BuildingSocietySaverBridgedModel;
}
export class CalculationModel {
  public cost: number;
  public cash: number;
  public timestamp: Date;
  public buildingSocietySaver: BuildingSocietySaverModel;
  public credit: CreditModel;
  public buildingSocietySaverBridged: BuildingSocietySaverBridgedModel;
  public chartData: EChartsOption;

  constructor(data: CalculationInterface) {
    let bSS = data.buildingSocietySaver;
    let bSSB = data.buildingSocietySaverBridged;
    let c = data.credit;

    this.cost = data.cost;
    this.timestamp = data.timestamp;
    this.buildingSocietySaver = new BuildingSocietySaverModel(bSS.id, bSS.sum, bSS.interest, bSS.monthlyRate);
    this.credit =  new CreditModel(c.id, c.sum, c.interest, c.acquittance);
    this.buildingSocietySaverBridged = new BuildingSocietySaverBridgedModel(bSSB.id, bSSB.sum, bSSB.interest, bSSB.monthlyRate, bSSB.bridgeSum, bSSB.bridgeInterest, bSSB.bridgeRunTime);
    this.cash = data.cash;
    this.chartData = this.calculateChartData();

  }

  private calculateChartData(): EChartsOption {
    let xAxisData = [];
    let seriesSumData = [];
    let cashData = [this.cash, this.cash, this.cash];
    let seriesInterestData = [];
    xAxisData.push('Bausparer');
    seriesSumData.push(this.buildingSocietySaver.sum);
    seriesInterestData.push(this.buildingSocietySaver.result.interestSum);

    xAxisData.push('Bausparer (überbrückt)');
    seriesSumData.push(this.buildingSocietySaverBridged.sum);
    seriesInterestData.push(this.buildingSocietySaverBridged.result.interestSum);

    xAxisData.push('Darlehen');
    seriesSumData.push(this.credit.sum);
    seriesInterestData.push(this.credit.result.interestSum);




    let data: EChartsOption = {
      xAxis: {
        data: xAxisData
      },
      yAxis: {
        name: '€'
      },
      series: [
        {
          name: 'Eigenkapital',
          type: 'bar',
          data: cashData,
          stack: 'x',
          color: '#3E4E50',
          markLine: {
              data: [
                {
                  yAxis: this.cost
                }
              ]
          }
        },
        {
          name: 'Summe',
          type: 'bar',
          data: seriesSumData,
          stack: 'x',
          color: '#fa8b69'
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
        data: ['Eigenkapital','Summe','Zinsen']
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
}
