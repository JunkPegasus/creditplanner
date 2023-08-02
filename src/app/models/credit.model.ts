import { EChartsOption } from "echarts";

export class CreditModel {


  constructor(
    public id: string,
    public sum: number,
    public interest: number,
    public acquittance: number,
    public cash: number
  ) {}


  public result: CreditCalculation = this.calculate();



  public calculate(): CreditCalculation {
    let interestRate: number = this.sum * (this.interest / 100);
    let acquittance: number = (this.acquittance / 100) * this.sum;
    let annuity: number = ((this.acquittance / 100) + (this.interest / 100)) * this.sum

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
      sum: completeSum,
      monthlyRate: annuity / 12,
      cash: this.cash
    }
  }
}

export interface CreditCalculation {
  interestList: Array<number>;
  acquittanceList: Array<number>;
  remainderOfADebtList: Array<number>;
  cash: number;

  interestSum: number;
  sum: number;
  monthlyRate: number;
}

