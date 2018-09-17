import * as React from 'react';

declare namespace F7Swiper {
  export interface Props {
    slot? : string
    id? : string | number
    params? : Object
    pagination? : boolean
    scrollbar? : boolean
    navigation? : boolean
    init? : boolean  | true
    color? : string
    colorTheme? : string
    textColor? : string
    bgColor? : string
    borderColor? : string
    rippleColor? : string
    themeDark? : boolean
    
  }
}
declare class F7Swiper extends React.Component<F7Swiper.Props, {}> {
  
}
export default F7Swiper;