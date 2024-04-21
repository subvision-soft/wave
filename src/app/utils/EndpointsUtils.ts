class EndpointsUtils {
  public static root: string = '';
  public static competitonId: string = '';

  getPathCompetitions(id: string) {
    return [EndpointsUtils.root, 'competitions', id]
      .filter((v) => !!v)
      .join('/');
  }

  getPathCurrentCompetition() {}

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
}
