export class BuildingSocietySaverBridgedModel {


  constructor(
    public id: string,
    public sum: number,
    public interest: number,
    public monthlyRate: number,
    public bridgeSum: number,
    public bridgeInterest: number,
    public bridgeRunTime: number,
    public cash: number,
    public interestAssuranceFeePercent: number
  ) {
  }

  public result: BuildingSocietySaverBridgeCalculation = this.calculate();



  public calculate(): BuildingSocietySaverBridgeCalculation {
    let interestRate: number = this.sum * (this.interest / 100);
    let annuity: number = this.monthlyRate * 12;
    let acquittanceRate: number = (annuity - interestRate) / this.sum;
    let acquittance: number = this.sum * acquittanceRate;
    let interestAssuranceFee: number = (this.sum + this.cash) * (this.interestAssuranceFeePercent / 100);

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

    let interestBridgeSum = (this.bridgeInterest / 100) * this.bridgeSum * this.bridgeRunTime;

    completeSum += interestBridgeSum;
    completeSum += interestAssuranceFee;

    console.log("calculate called");

    return {
      acquittanceList: acquittanceList,
      interestList: interestList,
      remainderOfADebtList: remainderOfADebtList,
      interestSum: interestSum,
      interestBridgeSum: interestBridgeSum,
      sum: completeSum,
      cash: this.cash,
      interestAssuranceFee: interestAssuranceFee
    }
  }
}

export interface BuildingSocietySaverBridgeCalculation {
  interestList: Array<number>;
  acquittanceList: Array<number>;
  remainderOfADebtList: Array<number>;
  cash:number;
  interestAssuranceFee:number;

  interestSum: number;
  interestBridgeSum: number;
  sum: number;
}
