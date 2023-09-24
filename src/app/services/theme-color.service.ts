import { Injectable } from '@angular/core';

declare var require: any;

const Color = require('color');

@Injectable({
  providedIn: 'root',
})
export class ThemeColorService {
  colors: Object = {};

  color: string = '#1677ff';

  constructor() {}

  setCssVariables(baseColor: string) {
    const color = Color(baseColor);
    const success = Color('#52c41a');
    const error = Color('#ff4d4f');
    const neutral1 = Color('#000000');
    const neutral2 = Color('#1cd29b');
    const seedBorderRadius = 10;

    const darkMode = false;
    const data = {
      colorPrimaryBg: darkMode
        ? color.darken(0.75).hex()
        : color.lighten(0.75).hex(),
      colorPrimaryBgHover: darkMode
        ? color.darken(0.8).hex()
        : color.lighten(0.7).hex(),
      colorPrimaryBorder: darkMode
        ? color.darken(0.5).hex()
        : color.lighten(0.5).hex(),
      colorPrimaryBorderHover: darkMode
        ? color.darken(0.56).hex()
        : color.lighten(0.44).hex(),
      colorPrimaryHover: !darkMode
        ? color.lighten(0.1).hex()
        : color.lighten(0.1).hex(),
      colorPrimary: color.hex(),
      colorPrimaryActive: !darkMode
        ? color.darken(0.2).hex()
        : color.darken(0.2).hex(),
      colorPrimaryTextHover: !darkMode
        ? color.lighten(0.1).hex()
        : color.lighten(0.1).hex(),
      colorPrimaryText: color.hex(),
      colorPrimaryTextActive: darkMode
        ? color.darken(0.2).hex()
        : color.darken(0.2).hex(),

      colorPrimaryAlpha1: color.alpha(0.1).rgb(),
      colorPrimaryAlpha2: color.alpha(0.5).rgb(),
      colorPrimaryAlpha3: color.alpha(0.8).rgb(),

      colorSuccessBg: darkMode
        ? success.darken(0.95).hex()
        : success.lighten(1.1).hex(),
      colorSuccessBgHover: darkMode
        ? success.darken(0.8).hex()
        : success.lighten(0.7).hex(),
      colorSuccessBorder: darkMode
        ? success.darken(0.5).hex()
        : success.lighten(0.5).hex(),
      colorSuccessBorderHover: darkMode
        ? success.darken(0.56).hex()
        : success.lighten(0.44).hex(),
      colorSuccessHover: !darkMode
        ? success.lighten(0.1).hex()
        : success.lighten(0.1).hex(),
      colorSuccess: success.hex(),
      colorSuccessActive: !darkMode
        ? success.darken(0.2).hex()
        : success.darken(0.2).hex(),
      colorSuccessTextHover: !darkMode
        ? success.lighten(0.1).hex()
        : success.lighten(0.1).hex(),
      colorSuccessText: success.hex(),
      colorSuccessTextActive: darkMode
        ? success.darken(0.2).hex()
        : success.darken(0.2).hex(),

      colorErrorBg: darkMode
        ? error.darken(0.45).hex()
        : error.lighten(0.45).hex(),
      colorErrorBgHover: darkMode
        ? error.darken(0.4).hex()
        : error.lighten(0.4).hex(),
      colorErrorBorder: darkMode
        ? error.darken(0.35).hex()
        : error.lighten(0.35).hex(),
      colorErrorBorderHover: darkMode
        ? error.darken(0.3).hex()
        : error.lighten(0.3).hex(),
      colorErrorHover: !darkMode
        ? error.lighten(0.1).hex()
        : error.lighten(0.1).hex(),
      colorError: error.hex(),
      colorErrorActive: !darkMode
        ? error.darken(0.2).hex()
        : error.darken(0.2).hex(),
      colorErrorTextHover: !darkMode
        ? error.lighten(0.1).hex()
        : error.lighten(0.1).hex(),
      colorErrorText: error.hex(),
      colorErrorTextActive: darkMode
        ? error.darken(0.2).hex()
        : error.darken(0.2).hex(),

      colorText: neutral1.alpha(0.88).rgb(),
      colorTextSecondary: neutral1.alpha(0.65).rgb(),
      colorTextTertiary: neutral1.alpha(0.45).rgb(),
      colorTextQuaternary: neutral1.alpha(0.25).rgb(),
      colorBorder: neutral2.darken(0.15).hex(),
      colorBorderSecondary: neutral2.darken(0.06).hex(),

      colorFill: neutral1.alpha(0.15).rgb(),
      colorFillSecondary: neutral1.alpha(0.06).rgb(),
      colorFillTertiary: neutral1.alpha(0.04).rgb(),
      colorFillQuaternary: neutral1.alpha(0.02).rgb(),

      colorBgContainer: neutral2.hex(),
      colorBgElevated: neutral2.hex(),
      colorBgLayout: neutral2.darken(0.04).hex(),

      colorBgSpotlight: neutral1.alpha(0.85).rgb(),
      colorBgMask: neutral1.alpha(0.45).rgb(),
      borderRadius: `${seedBorderRadius}px`,
      borderRadiusSM: `${Math.ceil(seedBorderRadius * (2 / 3))}px`,
      borderRadiusLG: `${Math.ceil(seedBorderRadius * (6 / 5))}px`,
      borderRadiusXS: `${Math.ceil(seedBorderRadius / 5)}px`,

      boxShadow: `0 0px 5px 0 rgba(0, 0, 0, 0.1)`,
      boxShadowSecondary: `0 0px 5px 0 rgba(0, 0, 0, 0.2)`,
    };

    const rows = Object.keys(data)
      .map((key) => {
        // @ts-ignore
        return `  --${key}: ${data[key]};`;
      })
      .join('\n');

    const variables = `

:root {
${rows}
}
    `;

    return data;
  }
}
