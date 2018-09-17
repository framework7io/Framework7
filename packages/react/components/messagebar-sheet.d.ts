import React from 'react';

namespace F7MessagebarSheet {
  export interface Props {
    slot? : string
    id? : string | number
    className? : string
    style? : React.CSSProperties
    color? : string
    colorTheme? : string
    textColor? : string
    bgColor? : string
    borderColor? : string
    rippleColor? : string
    themeDark? : boolean
    
  }
}
class F7MessagebarSheet extends React.Component<F7MessagebarSheet.Props, {}> {
  
}
export default F7MessagebarSheet;
