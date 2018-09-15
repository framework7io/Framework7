import React from 'react';

declare namespace F7Views {
  export interface Props {
    slot? : string
    id? : string | number
    tabs? : boolean
    color? : string
    colorTheme? : string
    textColor? : string
    bgColor? : string
    borderColor? : string
    rippleColor? : string
    themeDark? : boolean
    
  }
}
declare class F7Views extends React.Component<F7Views.Props, {}> {
  
}
export default F7Views;