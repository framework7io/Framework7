import React from 'react';

namespace F7ActionsButton {
  export interface Props {
    slot? : string
    id? : string | number
    className? : string
    style? : React.CSSProperties
    bold? : boolean
    close? : boolean  | true
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
class F7ActionsButton extends React.Component<F7ActionsButton.Props, {}> {
  onClick(event : any) : unknown
}
export default F7ActionsButton;
