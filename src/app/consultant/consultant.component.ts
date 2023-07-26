import { Component } from '@angular/core';
import { CalculationInterface, CalculationModel } from '../models/calculation.model';
import { CONSTANTS } from '../constants';
import { BuildingSocietySaverModel } from '../models/buildingSocietySaver.model';
import { CreditModel } from '../models/credit.model';
import { Guid } from "guid-typescript";
import { BuildingSocietySaverBridgedModel } from '../models/buildingSocietySaverBridged.model';

@Component({
  selector: 'app-consultant',
  templateUrl: './consultant.component.html',
  styleUrls: ['./consultant.component.scss']
})
export class ConsultantComponent {

  public data: CalculationModel;

  constructor() {
    try {
      this.data = this.getBlankData();
      let jsonData = localStorage.getItem(CONSTANTS.STORAGE_KEY);
      if(jsonData != undefined) {
        this.data = new CalculationModel(<CalculationInterface><unknown>JSON.parse(jsonData));
      } else {
        this.resetData();
      }
    } catch(ex) {
      console.warn("Your data could not be read. Initializing with new.");
      this.data = this.resetData();
    }

  }

  public saveData() {
    this.data.timestamp = new Date();
    localStorage.setItem(CONSTANTS.STORAGE_KEY, JSON.stringify(this.data));
  }

  public resetData(): CalculationModel {
    this.data = this.getBlankData();
    this.saveData();

    return this.data;
  }

  public getBlankData(): CalculationModel {
    return new CalculationModel({
      cost: 0,
      cash: 0,
      timestamp: new Date(),
      buildingSocietySaver: new BuildingSocietySaverModel(Guid.create().toString(), 0,0,0),
      credit: new CreditModel(Guid.create().toString(),0, 0, 0),
      buildingSocietySaverBridged: new BuildingSocietySaverBridgedModel(Guid.create().toString(),0, 0, 0, 0, 0, 0)
    });
  }

}
