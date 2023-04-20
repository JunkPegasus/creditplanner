import {AfterViewInit,  Component, OnDestroy} from '@angular/core';
import { CalculationModel, CalculationInterface } from '../models/calculation.model';
import { CONSTANTS } from '../constants';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-presentation',
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.scss']
})
export class PresentationComponent implements OnDestroy, AfterViewInit {

  public data!: CalculationModel;
  public sub!: Subscription;


  constructor() {
    this.loadData();
  }

  ngAfterViewInit() {
    this.refreshData();
  }

  ngOnDestroy(): void {
    if(this.sub!= null) this.sub.unsubscribe();
  }

  refreshData(): void {
    interval(CONSTANTS.REFRESH_INTERVAL).subscribe(() => {
      this.loadData();
    })
  }

  loadData(): void {
    try {
      let jsonData = localStorage.getItem(CONSTANTS.STORAGE_KEY);
      if(jsonData != undefined) {
        let storage = new CalculationModel(<CalculationInterface><unknown>JSON.parse(jsonData));
        if(this.data != null) {
          if(this.data.timestamp < storage.timestamp) {
            this.data = storage;
            console.log("data changed");
          }
        } else {
          this.data = storage;
          console.log("data changed");
        }
      }
    } catch(ex) {
      console.warn(ex);
    }
  }
}
