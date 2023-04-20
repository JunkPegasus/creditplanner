import {EChartsOption} from "echarts";

export class BuildingSocietySaverModel {


  constructor(
    public id: string,
    public sum: number,
    public interest: number,
    public monthlyRate: number
  ) {
  }

  public result: BuildingSocietySaverCalculation = this.calculate();



  public calculate(): BuildingSocietySaverCalculation {
    let interestRate: number = this.sum * (this.interest / 100);
    let annuity: number = this.monthlyRate * 12;
    let acquittanceRate: number = (annuity - interestRate) / this.sum;
    let acquittance: number = this.sum * acquittanceRate;

    let remainderOfADebt: number = this.sum - acquittance;

    let interestList = new Array<number>();
    let acquittanceList = new Array<number>();
    let remainderOfADebtList = new Array<number>();

    interestList.push(interestRate);
    acquittanceList.push(acquittance);
    remainderOfADebtList.push(remainderOfADebt);

    let i = 0;
    let interestLoan = this.interest / 100;
    while(remainderOfADebt > 0) {
      interestRate = +(remainderOfADebt * interestLoan).toFixed(2);

      if(remainderOfADebt < annuity) {
        acquittance = remainderOfADebt;
      } else {
        acquittance = annuity - interestRate;
      }

      remainderOfADebt = remainderOfADebt - acquittance;
      if(remainderOfADebt < 0) remainderOfADebt = 0;

      interestList.push(interestRate);
      acquittanceList.push(acquittance);
      remainderOfADebtList.push(remainderOfADebt);

      if(i > 200) break;
      i++;
    }

    let interestSum = interestList.reduce((a,b) => a + b, 0);
    let completeSum = interestSum + this.sum;

    let labelList = new Array<string>();
    for(let i = 1; i < interestList.length + 2; i++){
      labelList.push(i.toString());
    }


    console.log("calculate called");

    return {
      acquittanceList: acquittanceList,
      interestList: interestList,
      remainderOfADebtList: remainderOfADebtList,
      interestSum: interestSum,
      sum: completeSum
    }
  }
}

export interface BuildingSocietySaverCalculation {
  interestList: Array<number>;
  acquittanceList: Array<number>;
  remainderOfADebtList: Array<number>;

  interestSum: number;
  sum: number;
}
