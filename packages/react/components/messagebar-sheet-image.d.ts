import * as React from 'react';

declare namespace F7MessagebarSheetImage {
  export interface Props {
    slot? : string
    id? : string | number
    image? : string
    checked? : boolean
    color? : string
    colorTheme? : string
    textColor? : string
    bgColor? : string
    borderColor? : string
    rippleColor? : string
    themeDark? : boolean
    onChecked? : Function
    onUnchecked? : Function
    onChange? : Function
  }
}
declare class F7MessagebarSheetImage extends React.Component<F7MessagebarSheetImage.Props, {}> {
  onChange(e : any) : unknown
}
export default F7MessagebarSheetImage;