import { Injectable } from "@angular/core";
import { slideModel } from '../models/slideModel';

@Injectable({
  providedIn: "root"
})
export class DataBringerService {
  private particleJsConfig: any;
  private particleJsStyle: any;
  private slidesData: slideModel[];
  private nasaApi: string;

  constructor() {
    this.nasaApi = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=WuvGIBuwjNy1OVOvZeyH1yzysvjdqgGKjnK3nHUh";
    this.particleJsConfig = {
      particles: {
        number: {
          value: 20
        },
        color: {
          value: "#fff"
        },
        shape: {
          type: "triangle"
        }
      }
    };
    this.particleJsStyle = {
      position: 'fixed',
      background: 'black',
      'z-index': -1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    };
    this.slidesData = [
      {
        image: 'assets/images/gancho.gif',
      },
      {
        image: 'assets/images/burger.gif',
      },
      {
        image: 'assets/images/rossie.gif',
      }
    ];
  }

  public getParticleJSConfig(): any {
    return this.particleJsConfig;
  }

  public getParticleJSStyle(): any {
    return this.particleJsStyle;
  }

  public getSlidesData(): any {
    return this.slidesData;
  }

  public getNasaAPI(): any {
    return this.nasaApi;
  }
}
