import { Component } from '@angular/core';
import { CalculationInterface, CalculationModel } from '../models/calculation.model';
import { CONSTANTS } from '../constants';
import { BuildingSocietySaverModel } from '../models/buildingSocietySaver.model';
import { CreditModel } from '../models/credit.model';
import { Guid } from "guid-typescript";

@Component({
  selector: 'app-consultant',
  templateUrl: './consultant.component.html',
  styleUrls: ['./consultant.component.scss']
})
export class ConsultantComponent {

  public data: CalculationModel;

  constructor() {
    this.data = new CalculationModel(
      {
        cost: 0,
        cash: 0,
        timestamp: new Date(),
        buildingSocietySavers: [],
        credits: []
      }
    );
    let jsonData = localStorage.getItem(CONSTANTS.STORAGE_KEY);
    if(jsonData != undefined) {
      this.data = new CalculationModel(<CalculationInterface><unknown>JSON.parse(jsonData));
    }
  }

  public saveData() {
    this.data.timestamp = new Date();
    localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(this.data));
  }

  public resetData() {
    this.data = new CalculationModel({
      cost: 0,
      cash: 0,
      timestamp: new Date(),
      buildingSocietySavers: new Array<BuildingSocietySaverModel>(),
      credits: new Array<CreditModel>()
    });
    this.saveData();
  }

  public addBuildingSocietySavers() {
    if(this.data == null) this.resetData();
    this.data.buildingSocietySavers.push(new BuildingSocietySaverModel(Guid.create().toString(),0, 0, 0));
  }

  public addCredit() {
    if(this.data == null) this.resetData();
    this.data.credits.push(new CreditModel(Guid.create().toString(),0, 0,0));
  }
}
