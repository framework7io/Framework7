import React from 'react';

declare namespace F7MessagebarSheetItem {
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
declare class F7MessagebarSheetItem extends React.Component<F7MessagebarSheetItem.Props, {}> {
  
}
export default F7MessagebarSheetItem;