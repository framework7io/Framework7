import * as React from 'react';

declare namespace F7Fab {
  export interface Props {
    slot? : string
    id? : string | number
    morphTo? : string
    href? : boolean | string
    target? : string
    text? : string
    position? : string  | 'right-bottom'
    tooltip? : string
    color? : string
    colorTheme? : string
    textColor? : string
    bgColor? : string
    borderColor? : string
    rippleColor? : string
    themeDark? : boolean
    onClick? : Function
  }
}
declare class F7Fab extends React.Component<F7Fab.Props, {}> {
  onClick(event : any) : unknown
}
export default F7Fab;