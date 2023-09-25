import { Component, HostBinding, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @HostBinding('class.ripple') ripple: boolean = true;
  _type: 'primary' | 'default' | 'dashed' | 'text' | 'link' = 'default';
  _color: 'primary' | 'success' | 'error' = 'primary';

  @Input()
  set type(value: 'primary' | 'default' | 'dashed' | 'text' | 'link') {
    this._type = value;
    switch (value) {
      case 'primary':
        this.typePrimary = true;
        break;
      case 'dashed':
        this.typeDashed = true;
        break;
      case 'text':
        this.typeText = true;
        break;
      case 'link':
        this.typeLink = true;
        break;
      default:
        this.typeDefault = true;
        break;
    }
  }

  @Input()
  set color(value: 'primary' | 'success' | 'error') {
    this._color = value;
    switch (value) {
      case 'primary':
        this.primary = true;
        this.success = false;
        this.error = false;
        break;
      case 'error':
        this.primary = false;
        this.success = false;
        this.error = true;
        break;
      case 'success':
        this.primary = false;
        this.success = true;
        this.error = false;
        break;
      default:
        this.primary = false;
        this.success = false;
        this.error = false;
        break;
    }
  }

  @HostBinding('class.color-error') error: boolean = false;
  @HostBinding('class.color-primary') primary: boolean = true;
  @HostBinding('class.color-success') success: boolean = false;

  @HostBinding('class.type-default') _typeDefault: boolean = true;
  @HostBinding('class.type-dashed') _typeDashed: boolean = false;
  @HostBinding('class.type-link') _typeLink: boolean = false;
  @HostBinding('class.type-primary') _typePrimary: boolean = false;
  @HostBinding('class.type-text') _typeText: boolean = false;
  @HostBinding('class.focus') public focus: boolean = false;

  @HostListener('focus')
  public onFocus(): void {
    this.focus = true;
  }

  @HostListener('focusout')
  public onBlur(): void {
    this.focus = false;
  }

  set typeDefault(value: boolean) {
    this._typeDefault = value;
    if (value) {
      this._typeDashed = false;
      this._typeLink = false;
      this._typePrimary = false;
      this._typeText = false;
    }
  }

  set typeDashed(value: boolean) {
    this._typeDashed = value;
    if (value) {
      this._typeDefault = false;
      this._typeLink = false;
      this._typePrimary = false;
      this._typeText = false;
    }
  }

  set typeLink(value: boolean) {
    this._typeLink = value;
    if (value) {
      this._typeDefault = false;
      this._typeDashed = false;
      this._typePrimary = false;
      this._typeText = false;
    }
  }

  set typePrimary(value: boolean) {
    this._typePrimary = value;
    if (value) {
      this._typeDefault = false;
      this._typeDashed = false;
      this._typeLink = false;
      this._typeText = false;
    }
  }

  set typeText(value: boolean) {
    this._typeText = value;
    if (value) {
      this._typeDefault = false;
      this._typeDashed = false;
      this._typeLink = false;
      this._typePrimary = false;
    }
  }
}
