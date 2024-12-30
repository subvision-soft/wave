export class EndpointsUtils {
  public static root: string = '';
  public static api: string = 'https://wave-api-6rqq.onrender.com/generate-token';
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
    return [EndpointsUtils.api, 'generate-token']
      .filter((v) => !!v)
      .join('/');
  }

  public static getPathDetectTarget() {
    return [EndpointsUtils.api, 'detect-target']
      .filter((v) => !!v)
      .join('/');
  }
}
