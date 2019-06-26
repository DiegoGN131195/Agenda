import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import * as pleasewait from 'please-wait';
import { LoaderState } from '../../class/loader-state';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {
  loadingScreen: any;
  show = false;
  private subscription: Subscription;
  constructor(private loaderService: LoaderService) 
  { 
  }
  ngOnInit() {
    this.subscription = this.loaderService.loaderState
    .subscribe((state: LoaderState) => {
      this.show = state.show;
      if(this.show){
        this.loadingScreen = state.isEvent ? this.getLoadingByEvent(state.colorBackground, state.colorLabel, state.title) : this.getLoadingScreen();
      }else{
        if(this.loadingScreen != null){
          this.loadingScreen.finish();
        }
      }
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getLoadingScreen(){
    return pleasewait.pleaseWait({
      logo: "assets/images/logo.png",
      backgroundColor: '#6610f2',
      loadingHtml: "<h2 class='loading-message' style='color: white; margin:0px'>Agenda System</h2> <div class='sk-three-bounce'>      <div class='sk-child sk-bounce1' style='background-color: white'></div>      <div class='sk-child sk-bounce2' style='background-color: white'></div>      <div class='sk-child sk-bounce3' style='background-color: white'></div>    </div>"
    });
  }

  getLoadingByEvent(backgroundColor: string, colorLabel: string, title: string){
    return pleasewait.pleaseWait({
      backgroundColor: backgroundColor,
      loadingHtml: "<h2 class='loading-message' style='color:" + colorLabel + "; margin:0px'>"+ title + "</h2> <div class='sk-three-bounce'>      <div class='sk-child sk-bounce1' style='background-color: " + colorLabel + "'></div>      <div class='sk-child sk-bounce2' style='background-color: " + colorLabel + " '></div>      <div class='sk-child sk-bounce3' style='background-color: " + colorLabel + " '></div>    </div>"
    })
  }
}
