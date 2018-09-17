import * as React from 'react';

declare namespace F7Link {
  export interface Props {
    slot? : string
    id? : string | number
    noLinkClass? : boolean
    noFastClick? : boolean
    noFastclick? : boolean
    text? : string
    tabLink? : boolean | string
    tabLinkActive? : boolean
    tabbarLabel? : boolean
    iconOnly? : boolean
    badge? : string | number
    badgeColor? : string
    iconBadge? : string | number
    href? : string | boolean  | '#'
    target? : string
    tooltip? : string
    smartSelect? : boolean
    smartSelectParams? : Object
    color? : string
    colorTheme? : string
    textColor? : string
    bgColor? : string
    borderColor? : string
    rippleColor? : string
    themeDark? : boolean
    icon? : string
    iconMaterial? : string
    iconIon? : string
    iconFa? : string
    iconF7? : string
    iconIfMd? : string
    iconIfIos? : string
    iconIos? : string
    iconMd? : string
    iconColor? : string
    iconSize? : string | number
    back? : boolean
    external? : boolean
    force? : boolean
    animate? : boolean  | undefined
    ignoreCache? : boolean
    pageName? : string
    reloadCurrent? : boolean
    reloadAll? : boolean
    reloadPrevious? : boolean
    routeTabId? : string
    view? : string
    searchbarEnable? : boolean | string
    searchbarDisable? : boolean | string
    searchbarClear? : boolean | string
    searchbarToggle? : boolean | string
    panelOpen? : boolean | string
    panelClose? : boolean | string
    popupOpen? : boolean | string
    popupClose? : boolean | string
    actionsOpen? : boolean | string
    actionsClose? : boolean | string
    popoverOpen? : boolean | string
    popoverClose? : boolean | string
    loginScreenOpen? : boolean | string
    loginScreenClose? : boolean | string
    sheetOpen? : boolean | string
    sheetClose? : boolean | string
    sortableEnable? : boolean | string
    sortableDisable? : boolean | string
    sortableToggle? : boolean | string
    onClick? : Function
  }
}
declare class F7Link extends React.Component<F7Link.Props, {}> {
  onClick(event : any) : unknown
}
export default F7Link;