export class Action {
  label: string = '';
  icon: string = '';
  action?: (self: this) => boolean | void;
  actions?: Action[];

  execute(): boolean | void {
    if (this.action) {
      return this.action(this);
    }
  }

  constructor(
    label?: string,
    icon?: string,
    action?: (self: Action) => boolean | void,
    actions?: Action[]
  ) {
    this.label = label || '';
    this.icon = icon || '';
    this.action = action;
    this.actions = actions;
  }
}
