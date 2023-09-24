export class Action {
  label: string = '';
  icon: string = '';
  action?: (self: this) => boolean | void;
  actions?: Action[];
  isDisplayed: () => boolean = () => true;

  execute(): boolean | void {
    if (this.action) {
      return this.action(this);
    }
  }

  constructor(
    label?: string,
    icon?: string,
    action?: (self: Action) => boolean | void,
    actions?: Action[],
    isDisplayed: () => boolean = () => true
  ) {
    this.label = label || '';
    this.icon = icon || '';
    this.action = action;
    this.actions = actions;
    this.isDisplayed = isDisplayed;
  }
}
