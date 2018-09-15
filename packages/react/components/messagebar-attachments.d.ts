import React from 'react';

declare namespace F7MessagebarAttachments {
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
declare class F7MessagebarAttachments extends React.Component<F7MessagebarAttachments.Props, {}> {
  
}
export default F7MessagebarAttachments;