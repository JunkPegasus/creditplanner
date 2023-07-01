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
      this.data = new CalculationModel(
      {
        cost: 0,
        cash: 0,
        timestamp: new Date(),
        buildingSocietySavers: [],
        credits: [],
        buildingSocietySaversBridged: []
      }
    );
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
    this.data = new CalculationModel({
      cost: 0,
      cash: 0,
      timestamp: new Date(),
      buildingSocietySavers: new Array<BuildingSocietySaverModel>(),
      credits: new Array<CreditModel>(),
      buildingSocietySaversBridged: new Array<BuildingSocietySaverBridgedModel>()
    });
    this.saveData();

    return this.data;
  }

  public addBuildingSocietySavers() {
    if(this.data == null) this.resetData();
    this.data.buildingSocietySavers.push(new BuildingSocietySaverModel(Guid.create().toString(),0, 0, 0));
  }

  public addBuildingSocietySaverBridged() {
    if(this.data == null) this.resetData();
    this.data.buildingSocietySaversBridged.push(new BuildingSocietySaverBridgedModel(Guid.create().toString(),0, 0, 0, 0, 0, 0));
  }

  public addCredit() {
    if(this.data == null) this.resetData();
    this.data.credits.push(new CreditModel(Guid.create().toString(),0, 0,0));
  }


  public removeCredit(id: string) {
    this.data.credits = this.data.credits.filter((item) => item.id !== id);
  }

  public removeBuildingSocietySavers(id: string) {
    this.data.buildingSocietySavers = this.data.buildingSocietySavers.filter((item) => item.id !== id);
  }
  public removeBuildingSocietySaversBridged(id: string) {
    this.data.buildingSocietySaversBridged = this.data.buildingSocietySaversBridged.filter((item) => item.id !== id);
  }
}
