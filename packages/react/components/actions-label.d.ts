import React from 'react';

declare namespace F7ActionsLabel {
  export interface Props {
    slot? : string
    id? : string | number
    bold? : boolean
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
declare class F7ActionsLabel extends React.Component<F7ActionsLabel.Props, {}> {
  onClick(event : any) : unknown
}
export default F7ActionsLabel;