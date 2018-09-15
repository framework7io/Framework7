import React from 'react';

declare namespace F7MessagesTitle {
  export interface Props {
    slot? : string
    id? : string | number
    color? : string
    colorTheme? : string
    textColor? : string
    bgColor? : string
    borderColor? : string
    rippleColor? : string
    themeDark? : boolean
    
  }
}
declare class F7MessagesTitle extends React.Component<F7MessagesTitle.Props, {}> {
  
}
export default F7MessagesTitle;