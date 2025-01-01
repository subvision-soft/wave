import {Injectable} from '@angular/core';
import {ParametersService} from '../services/parameters.service';

@Injectable({
    providedIn: 'root'
  }
)
export class EndpointsUtils {
  public static root: string = '';
  public static api: string = 'http://127.0.0.1:8000';
  public static competitonId: string = '';

  getPathCompetitions(id: string) {
    return [EndpointsUtils.root, 'competitions', id]
      .filter((v) => !!v)
      .join('/');
  }

  getPathCurrentCompetition() {
  }

  getPathCompetitors(id: string) {
    return [EndpointsUtils.root, 'competitors', id]
      .filter((v) => !!v)
      .join('/');
  }

  getPathCategories() {
    return [EndpointsUtils.root];
  }

  getPathCompetitorTargets(competitorId: string, targetId: string) {
    return [
      EndpointsUtils.root,
      'competitors',
      competitorId,
      'targets',
      targetId,
    ]
      .filter((v) => !!v)
      .join('/');
  }


  public static getPathGenToken() {
    return [ParametersService.get("URL_API2").value, 'generate-token']
      .filter((v) => !!v)
      .join('/');
  }

  public static getPathDetectTarget() {
    return [ParametersService.get("URL_API2").value, 'detect-target']
      .filter((v) => !!v)
      .join('/');
  }

  public static getPathTargetScore() {
    return [ParametersService.get("URL_API2").value, 'target-score']
      .filter((v) => !!v)
      .join('/');
  }
}
