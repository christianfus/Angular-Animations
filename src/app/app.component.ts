import { Component } from "@angular/core";
import { trigger, style, state, animate, transition, keyframes } from "@angular/animations";
import { slideModel } from "./models/slideModel";
import { DataBringerService } from "./services/the-data-bringer.service";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RoverDiscovery } from "./models/roverDiscoveryModel";
import { DirectionConstants } from "./constants/directionConstants";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

declare let particlesJS: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [
    trigger("doSlide", [
      transition(
        "*=>moveLeft",
        animate(
          "2000ms",
          keyframes([
            style({ offset: 0 }),
            style({ transform: "translateX(-230vh)", offset: 0.5 }),
            style({ transform: "translateX(230vh)", offset: 0.501 }),
            style({ transform: "translateX(0)", offset: 1.0 })
          ])
        )
      ),
      transition(
        "*=>moveRight",
        animate(
          "2000ms",
          keyframes([
            style({ offset: 0 }),
            style({ transform: "translateX(230vh)", offset: 0.5 }),
            style({ transform: "translateX(-230vh)", offset: 0.501 }),
            style({ transform: "translateX(0)", offset: 1.0 })
          ])
        )
      ),
      transition(
        "*=>moveUp",
        animate(
          "2000ms",
          keyframes([
            style({ offset: 0 }),
            style({ transform: "translateY(-230vh)", offset: 0.5 }),
            style({ transform: "translateY(230vh)", offset: 0.501 }),
            style({ transform: "translateY(0)", offset: 1.0 })
          ])
        )
      ),
      transition(
        "*=>moveDown",
        animate(
          "2000ms",
          keyframes([
            style({ offset: 0 }),
            style({ transform: "translateY(230vh)", offset: 0.5 }),
            style({ transform: "translateY(-230vh)", offset: 0.501 }),
            style({ transform: "translateY(0)", offset: 1.0 })
          ])
        )
      )
    ])
  ]
})
export class AppComponent {
  public myStyle: object;
  public myParams: object;
  public width: number;
  public height: number;
  public moveDirection: string;
  public activeSlide: slideModel;
  private activeSlideIndex: number;
  private slides: Array<slideModel>;
  private nasaObservable$: Observable<any>;
  private checkActiveSlidesNASA: boolean;
  private changeNasaSlideInterval: any;
  private currentSlideDirection: string;
  private setNASASlideStyle: boolean;

  //GIFS
  public leftGifMovement: string;
  public rightGifMovement: string;
  public upGifVisible: boolean;
  public downGifVisible: boolean;

  constructor(private http: HttpClient, private dataBringerService: DataBringerService) {
    this.myStyle = {};
    this.myParams = {};
    this.width = 100;
    this.height = 100;
    this.upGifVisible = false;
    this.downGifVisible = false;
    this.currentSlideDirection = DirectionConstants.LEFT;
    this.checkActiveSlidesNASA = false;
  }

  ngOnInit() {
    this.myStyle = this.dataBringerService.getParticleJSStyle();
    this.myParams = this.dataBringerService.getParticleJSConfig();
    this.nasaObservable$ = this.http.get(this.dataBringerService.getNasaAPI());
    this.slides = this.dataBringerService.getSlidesData();
    this.activeSlide = this.slides[0];
    this.activeSlideIndex = 0;
  }

  public changeSlidesType(direction: string) {
    this.clearSlidesAndInterval();
    this.checkActiveSlidesNASA = !this.checkActiveSlidesNASA;
    this.moveDirection = direction;
    if (this.checkActiveSlidesNASA) {
      this.initiateSpaceTransmision();
    } else {
      this.slides = this.dataBringerService.getSlidesData();
      this.activeSlide = this.slides[0];
    }
  }

  private initiateSpaceTransmision(){
    this.nasaObservable$.subscribe(nasaData => {
      this.setNASASlides(nasaData.photos);
      this.intervalChangeNASASlide();
    });
    setTimeout(() => {
      this.moveDirection = null;
    }, 2000);
  }

  private setNASASlides(data: RoverDiscovery[]) {
    data.forEach((data: RoverDiscovery) => {
      let slide: slideModel = this.transformNASADataToSlide(data);
      this.slides.push(slide);
    });
    this.setNASASlideStyle = this.checkActiveSlidesNASA;

    this.activeSlide = this.slides[0];
  }

  private intervalChangeNASASlide() {
    this.changeNasaSlideInterval = setInterval(() => {
      let movement = this.alternateSlideMovement();
      this.changeSlide(movement);
    }, 7000);
  }

  private transformNASADataToSlide(data: RoverDiscovery): slideModel {
    let slide: slideModel = {
      image: data.img_src,
      title: "Name: " + data.rover.name,
      text: "<b>Landing Date:</b> " + data.rover.landing_date + "<br/>"
            + "<b>Launch Date:</b> " + data.rover.launch_date + "<br/>"
            + "<b>Status:</b> " + data.rover.status
    };
    console.log(data);
    
    return slide;
  }

  private alternateSlideMovement(): string {
    this.currentSlideDirection == DirectionConstants.LEFT
      ? (this.currentSlideDirection = DirectionConstants.RIGHT)
      : (this.currentSlideDirection = DirectionConstants.LEFT);
    return this.currentSlideDirection;
  }

  private clearSlidesAndInterval(): void{
    this.changeNasaSlideInterval ? clearInterval(this.changeNasaSlideInterval) : "";
    this.changeNasaSlideInterval = null;
    this.slides = [];
    this.activeSlideIndex = 0;
  }

  // SLIDES LOGIC

  public changeSlide(direction: string) {
    this.triggerGifMovement(direction);
    setTimeout(() => {
      if (direction == DirectionConstants.RIGHT) {
        this.activeSlideIndex < this.slides.length - 1
          ? this.changeActiveSlide(direction)
          : this.resetActiveSlide(direction);
      } else {
        this.activeSlideIndex > 0 ? this.changeActiveSlide(direction) : this.resetActiveSlide(direction);
      }
    }, 150);
  }

  private changeActiveSlide(direction: string) {
    this.triggerSlideMovement(direction);
    setTimeout(() => {
      if(!this.checkActiveSlidesNASA){
        direction == DirectionConstants.RIGHT ? this.activeSlideIndex++ : this.activeSlideIndex--;
      }else{
        this.activeSlideIndex++;
      }
      this.activeSlide = this.slides[this.activeSlideIndex];
    }, 1000);
  }

  private resetActiveSlide(direction: string) {
    this.triggerSlideMovement(direction);
    setTimeout(() => {
      direction == DirectionConstants.RIGHT
        ? (this.activeSlideIndex = 0)
        : (this.activeSlideIndex = this.slides.length - 1);
      this.activeSlide = this.slides[this.activeSlideIndex];
    }, 1000);
  }

  private triggerSlideMovement(direction: string) {
    direction == DirectionConstants.LEFT
      ? (this.moveDirection = DirectionConstants.MOVE_LEFT)
      : (this.moveDirection = DirectionConstants.MOVE_RIGHT);
    setTimeout(() => {
      this.moveDirection = null;
    }, 2000);
  }

  private triggerGifMovement(direction: string) {
    direction == DirectionConstants.LEFT
      ? (this.leftGifMovement = DirectionConstants.MOVE_LEFT)
      : (this.rightGifMovement = DirectionConstants.MOVE_RIGHT);
    setTimeout(() => {
      this.leftGifMovement = null;
      this.rightGifMovement = null;
    }, 2000);
  }
}
