import { BuildingSocietySaverBridgedModel } from './buildingSocietySaverBridged.model';
import { EChartsOption } from 'echarts';
import { BuildingSocietySaverModel } from './buildingSocietySaver.model';
import { CreditModel } from './credit.model';
import { DecimalPipe } from '@angular/common';

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
  public timestamp: Date;
  public buildingSocietySaver: BuildingSocietySaverModel;
  public credit: CreditModel;
  public buildingSocietySaverBridged: BuildingSocietySaverBridgedModel;
  public chartData: EChartsOption;

  constructor(
    data: CalculationInterface,
    private decimalPipe: DecimalPipe) {
    let bSS = data.buildingSocietySaver;
    let bSSB = data.buildingSocietySaverBridged;
    let c = data.credit;

    this.cost = data.cost;
    this.timestamp = data.timestamp;
    this.buildingSocietySaver = new BuildingSocietySaverModel(bSS.id, bSS.sum, bSS.interest, bSS.monthlyRate, bSS.cash);
    this.credit =  new CreditModel(c.id, c.sum, c.interest, c.acquittance, c.cash);
    this.buildingSocietySaverBridged = new BuildingSocietySaverBridgedModel(bSSB.id, bSSB.sum, bSSB.interest, bSSB.monthlyRate, bSSB.bridgeSum, bSSB.bridgeInterest, bSSB.bridgeRunTime, bSSB.cash);
    this.chartData = this.calculateChartData();

  }

  private calculateChartData(): EChartsOption {
    let Me = this;
    let xAxisData = [];
    let seriesSumData = new Array<any>;
    let cashData = new Array<any>;
    let seriesInterestData = new Array<any>;
    let seriesInterestBridgedData = new Array<any>;
    xAxisData.push('Bausparer');
    seriesSumData.push(this.buildingSocietySaver.sum);
    seriesInterestData.push(this.buildingSocietySaver.result.interestSum);
    seriesInterestBridgedData.push(0);
    cashData.push(this.buildingSocietySaver.cash);

    xAxisData.push('Bausparer (überbrückt)');
    seriesSumData.push(this.buildingSocietySaverBridged.sum);
    seriesInterestData.push(this.buildingSocietySaverBridged.result.interestSum);
    seriesInterestBridgedData.push(this.buildingSocietySaverBridged.result.interestBridgeSum);
    cashData.push(this.buildingSocietySaverBridged.cash);

    xAxisData.push('Darlehen');
    seriesSumData.push(this.credit.sum);
    seriesInterestData.push(this.credit.result.interestSum);
    seriesInterestBridgedData.push(0);
    cashData.push(this.credit.cash);




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
          name: 'Darlehenssumme',
          type: 'bar',
          data: seriesSumData,
          stack: 'x',
          color: '#2D728F'
        },
        {
          name: 'Überbrückungszinsen',
          type: 'bar',
          data: seriesInterestBridgedData,
          stack: 'x',
          color: '#FFC100'
        },
        {
          name: 'Zinsen',
          type: 'bar',
          data: seriesInterestData,
          stack: 'x',
          color: '#f84914',
          label: {
            show: true,
            position: 'top',
            color: '#f84914',
            fontWeight: 'bold',
            fontSize: '24px',
            distance: 10,
            formatter: function (params) {
              let sum = 0;
              if(params.dataIndex == 0) sum = Me.buildingSocietySaver.result.sum;
              if(params.dataIndex == 1) sum = Me.buildingSocietySaverBridged.result.sum;
              if(params.dataIndex == 2) sum = Me.credit.result.sum;

              let value = Me.decimalPipe.transform(sum, '1.0-0', 'de-DE');
              if(value == null) value = '';
              else value += ' €'
              return value;
            },
          }
        }
      ],
      legend: {
        data: ['Eigenkapital','Darlehenssumme','Überbrückungszinsen','Zinsen']
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
