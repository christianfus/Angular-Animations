import { Component } from '@angular/core';
import { trigger, style, state, animate, transition, keyframes } from '@angular/animations';
import { slideModel } from './models/slideModel';

declare let particlesJS: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('doSlide', [
      state(
        'moveLeft',
        style({})
      ),
      state(
        'moveRight',
        style({})
      ),
      transition('*=>moveLeft',
      animate('2000ms', keyframes([
        style({offset: 0}),
        style({transform: 'translateX(-230vh)', offset: 0.5}),
        style({transform: 'translateX(230vh)',    offset: 0.501}),
        style({transform: 'translateX(0)', offset: 1.0})
      ])
      )),
      transition('*=>moveRight',
      animate('2000ms', keyframes([
        style({offset: 0}),
        style({transform: 'translateX(230vh)', offset: 0.5}),
        style({transform: 'translateX(-230vh)',    offset: 0.501}),
        style({transform: 'translateX(0)', offset: 1.0})
      ])
      ))
    ])
  ]
})
export class AppComponent {

  public myStyle: object 
  public myParams: object
  public width: number
  public height: number
  public moveDirection: string;
  public activeSlide: slideModel;
  public activeSlideIndex: number;
  public slides: Array<slideModel>;

  //GIFS
  public leftGifVisible:boolean;
  public rightGifVisible:boolean;
  public leftGifMovement:string;
  public rightGifMovement:string;

  constructor() {
    this.myStyle = {};
    this.myParams = {};
    this.width = 100;
    this.height = 100;
    this.leftGifVisible = true;
    this.rightGifVisible = true;
  }

  public changeSlide(direction: boolean) {
    if (direction) {
       this.moveLeft();
    } else {
       this.moveRight();
    }
  }

  public moveLeft(){
    let direction = 'left'
    this.triggerGifMovement(direction);

    setTimeout(() => {
      if (this.activeSlideIndex > 0) {
        setTimeout(() => {
          this.activeSlideIndex--;
          this.activeSlide = this.slides[this.activeSlideIndex];
        }, 1000);
        
        this.triggerMovement(direction);
      }else{
        setTimeout(() => {
          this.activeSlideIndex=this.slides.length-1;
          this.activeSlide = this.slides[this.activeSlideIndex];
        }, 1000);
  
        this.triggerMovement(direction);
      }
    }, 300);
    
  }

  public moveRight(){
    let direction = 'right'
    this.triggerGifMovement(direction);

    setTimeout(() => {
      if (this.activeSlideIndex < this.slides.length-1) {
        setTimeout(() => {
          this.activeSlideIndex++;
          this.activeSlide = this.slides[this.activeSlideIndex];
        }, 1000);
        this.triggerMovement(direction)
      }else{
        setTimeout(() => {
          this.activeSlideIndex=0;
          this.activeSlide = this.slides[this.activeSlideIndex];
        }, 1000);
        this.triggerMovement(direction);
      }
    }, 300);
    
  }

  public triggerMovement(direction: string) {
    direction == 'left' ? (this.moveDirection = 'moveLeft') : (this.moveDirection = 'moveRight');
    setTimeout(() => {
      this.moveDirection = '';
    }, 2000); 
  }

  public triggerGifMovement(direction){
    direction == 'left' ? (this.leftGifMovement = 'moveLeft') : (this.rightGifMovement = 'moveRight');
    setTimeout(() => {
      this.leftGifMovement = '';
      this.rightGifMovement = '';
    }, 2000); 
  }


  ngOnInit() {
    this.slides = [
      {
        image: 'assets/images/gancho.gif',
        title: 'Cap de ganxo',
        text: 'Lorem ipsum dolor et sit amet y no se ke'
      },
      {
        image: 'assets/images/burger.gif',
        title: 'Bob\'s burguer',
        text: 'Lorem ipsum dolor et sit amet y no se ke'
      },
      {
        image: 'assets/images/rossie.gif',
        title: 'Muten Roshi DBZ',
        text: 'Lorem ipsum dolor et sit amet y no se ke'
      }
    ];
    this.activeSlide = this.slides[0];
    this.activeSlideIndex = 0;

    this.myStyle = {
      position: 'fixed',
      background: 'black',
      width: '100%',
      height: '100%',
      'z-index': -1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    };

    this.myParams = {
      particles: {
        number: {
          value: 100,
          density: {
            enable: false,
            value_area: 1600
          }
        },
        color: {
          value: '#fff'
        },
        shape: {
          type: 'circle'
        },
        move: {
          enable: true,
          speed: 2.14420094855545,
          direction: 'top-right',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          },
          onclick: {
            enable: true,
            mode: 'repulse'
          },
          resize: true
        },
        modes: {
          grab: {
            distance: 200,
            line_linked: {
              opacity: 1
            }
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3
          },
          repulse: {
            distance: 127.4725274725275,
            duration: 0.4
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      }
    };
  }
}
