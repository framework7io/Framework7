import * as React from 'react';

declare namespace F7Checkbox {
  export interface Props {
    slot? : string
    id? : string | number
    checked? : boolean
    name? : number | string
    value? : number | string | boolean
    disabled? : boolean
    readonly? : boolean
    defaultChecked? : boolean
    color? : string
    colorTheme? : string
    textColor? : string
    bgColor? : string
    borderColor? : string
    rippleColor? : string
    themeDark? : boolean
    onChange? : Function
  }
}
declare class F7Checkbox extends React.Component<F7Checkbox.Props, {}> {
  onChange(event : any) : unknown
}
export default F7Checkbox;