export type ElementType =
  | 'logo'
  | 'heading'
  | 'text'
  | 'button'
  | 'image'
  | 'video'
  | 'table'
  | 'list'
  | 'accordion'
  | 'card'
  | 'container'
  | 'grid'
  | 'inline'
  | 'section'
  | 'nav-link'
  | 'nav-links'
  | 'badge'
  | 'divider'
  | 'hamburger-button'
  | 'mobile-menu-drawer'
  | 'icon'
  | 'form'
  | 'form-input-text'
  | 'form-textarea'
  | 'form-input-email'
  | 'form-input-password'
  | 'form-input-number'
  | 'form-select'
  | 'form-checkbox'
  | 'form-radio'
  | 'form-date'
  | 'form-file'
  | 'form-submit'
  | 'modal'
  | 'map'
  | 'mixed-media'
  | 'submenu'
  | 'nav-container'
  | 'cta-container';

export type LogoType = 'text' | 'image';

export type TypefaceOption = string;

export type FontWeightOption = '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'blockquote' | 'ul' | 'ol';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type ButtonStyle = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' | 'dark';

export type ShadowDepth = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type ObjectFitMode = 'cover' | 'contain' | 'fill' | 'none';

export type ImageFilterMode = 'none' | 'grayscale' | 'warm' | 'vintage' | 'darken' | 'contrast';

export type BackgroundType = 'solid' | 'transparent' | 'gradient' | 'image';

export interface ElementStyles {
  typeface?: TypefaceOption | string;
  fontWeight?: FontWeightOption | string;
  fontStyle?: 'normal' | 'italic' | string;
  textDecoration?: 'none' | 'underline' | 'line-through' | string;
  textDecorationLine?: string;
  textDecorationStyle?: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | string;
  textDecorationThickness?: number | string;
  textDecorationColor?: string;
  textUnderlineOffset?: number | string;
  textDecorationSkipInk?: 'auto' | 'none' | string;
  underlineStyle?: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | string;
  underlineThickness?: number | string;
  underlineColor?: string;
  underlineOffset?: number | string;
  underlineSkipInk?: 'auto' | 'none' | string;
  overlineStyle?: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | string;
  overlineThickness?: number | string;
  overlineColor?: string;
  overlineOffset?: number | string;
  overlineSkipInk?: 'auto' | 'none' | string;
  strikethroughStyle?: 'solid' | 'double' | 'dotted' | 'dashed' | 'wavy' | string;
  strikethroughThickness?: number | string;
  strikethroughColor?: string;
  strikethroughSkipInk?: 'auto' | 'none' | string;
  textColorOpacity?: number;
  fontSize?: number | string;
  textColor?: string;
  color?: string;
  hoverTextColor?: string;
  backgroundColor?: string;
  bgOpacity?: number;
  href?: string;
  target?: string;
  headerBg?: string;
  zebraStripes?: boolean;
  hoverBgColor?: string;
  backgroundType?: BackgroundType;
  backgroundGradient?: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
  backgroundImage?: string;
  backgroundOverlay?: 'none' | 'dark' | 'light' | 'gradient' | string;
  overlayOpacity?: number;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundSize?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderPosition?: 'all' | 'top' | 'bottom' | 'top-bottom' | 'left' | 'right' | 'none';
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomLeftRadius?: number;
  textAlign?: TextAlign;
  alignment?: 'left' | 'center' | 'right';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | string;
  alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'auto' | string;
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse' | string;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse' | string;
  verticalAlign?: 'top' | 'middle' | 'bottom' | string;
  padding?: number;
  paddingY?: number;
  paddingX?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginY?: number;
  marginX?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  margin?: number | string;
  spaceBefore?: number;
  spaceAfter?: number;
  listStyleType?: string;
  marginAuto?: 'left' | 'center' | 'right' | 'none' | boolean;
  letterSpacing?: number;
  wordSpacing?: number;
  lineHeight?: number;
  display?: string;
  float?: string;
  shapeOutside?: string;
  textTransform?: 'none' | 'uppercase' | 'capitalize' | 'lowercase';
  opacity?: number;
  shadow?: ShadowDepth;
  boxShadow?: string;
  customGlow?: string;
  glowColor?: string;
  textGradient?: string;
  highlightBackground?: string;
  highlightGradient?: string;
  highlightColor?: string;
  highlightPadding?: number;
  highlightBorderRadius?: number;
  highlightBorderWidth?: number;
  highlightBorderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  highlightBorderColor?: string;
  highlightBoxShadow?: string;
  highlightWordSpacing?: number;
  rotation?: number;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  flipX?: boolean;
  flipY?: boolean;
  fixedRatio?: boolean;
  hoverEffect?: 'none' | 'lift' | 'glow' | 'scale' | 'darken' | 'lighten' | 'zoom' | 'grayscale-to-color' | 'shine' | 'opacity' | 'slide-icon' | 'shadow' | 'rotate' | 'pulse';
  cardStyle?: 'flat' | 'bordered' | 'elevated' | 'glass';
  buttonSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  buttonStyle?: ButtonStyle;
  fullWidth?: boolean;
  gradientText?: boolean;
  width?: string | number;
  height?: string | number;
  mediaWidth?: number | string;
  aspectRatio?: 'auto' | '1/1' | '16/9' | '4/3' | '21/9' | '3/2' | '3/4' | '9/16' | string;
  objectFit?: ObjectFitMode;
  objectPosition?: string;
  cropZoom?: number;
  cropPanX?: number;
  cropPanY?: number;
  filter?: ImageFilterMode;
  filterBrightness?: number;
  filterContrast?: number;
  maxWidth?: 'full' | '7xl' | '6xl' | '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'none' | string;
  layoutDirection?: 'row' | 'col' | 'grid-2' | 'grid-3';
  gap?: number;
  listStylePosition?: 'inside' | 'outside';
  minHeight?: number | string;
  overflow?: 'visible' | 'hidden' | 'clip';
  backdropBlur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  overlayColor?: string;
  modalWidth?: string;
  modalHeight?: string;
  contentAlignment?: 'left' | 'center' | 'right' | 'none' | string;
  reverseLayout?: boolean;
  layoutColumns?: '1' | '2' | '3' | '4' | '5' | string;
  footerColumns?: '1' | '2' | '3' | '4' | '5' | string;
  layoutDistribution?: 'space-between' | 'space-around' | 'space-evenly' | 'center' | 'flex-start' | 'flex-end' | string;
  verticalAlignment?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | string;
  horizontalAlignment?: 'left' | 'center' | 'right' | string;
  mobilePaddingY?: number;
  mobilePaddingX?: number;
  tabletPaddingY?: number;
  tabletPaddingX?: number;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  heroPreset?: 'default' | 'image-split' | 'video-split' | string;
  columnRatioPreset?: 'equal' | 'split-1-2' | 'split-2-1' | 'split-1-2-1' | 'sidebar-left' | 'sidebar-right' | string;
  gapDesktop?: number;
  gapTablet?: number;
  gapMobile?: number;
  columnGap?: number;
  columnRatio?: string;
  animation?: 'none' | 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | string;
  labelColor?: string;
  labelFontSize?: number | string;
  labelFontWeight?: FontWeightOption | string;
  labelTypeface?: TypefaceOption | string;
  labelLetterSpacing?: number;
  labelLineHeight?: number;
  labelPosition?: 'top' | 'left' | 'bottom' | 'right';
  placeholderColor?: string;
  placeholderFontSize?: number;
  helperTextColor?: string;
  helperTextFontSize?: number;
  submenuAlign?: 'left' | 'center' | 'right';
  submenuBg?: string;

  focusBorderColor?: string;
  focusBackgroundColor?: string;
  focusRingColor?: string;
  focusRingWidth?: number;
  focusTextColor?: string;
  fieldBorderRadius?: number;
  fieldBackgroundColor?: string;
  fieldTextColor?: string;
  fieldBorderColor?: string;
  fieldBorderWidth?: number;
  fieldPaddingX?: number;
  fieldPaddingY?: number;
  fieldFontSize?: number;
  fieldHoverBorderColor?: string;
  fieldHoverBackgroundColor?: string;
  fieldFocusShadow?: string;
}

export interface TableColumn {
  title: string;
  align?: TextAlign;
}

export interface TableCellItem {
  text?: string;
  isCheck?: boolean;
  isCross?: boolean;
  badge?: string;
  backgroundColor?: string;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  fontWeight?: string;
  fontSize?: number;
  borderColor?: string;
  borderWidth?: number;
  padding?: number;
}

export interface TableHeaderItem {
  text: string;
  backgroundColor?: string;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: string;
  fontSize?: number;
}

export type TableRowItem = TableCellItem;

export interface TableData {
  headers: (string | TableHeaderItem)[];
  rows: (string | TableCellItem)[][];
  includeHeader?: boolean;
  zebraStripes?: boolean;
  tableAlignment?: 'left' | 'center' | 'right' | 'full';
  headerBg?: string;
  headerTextColor?: string;
  headerAlign?: 'left' | 'center' | 'right';
  cellPadding?: 'compact' | 'normal' | 'relaxed' | number;
}

export interface AccordionItemData {
  title: string;
  content: string;
  isOpen?: boolean;
  titleTag?: TextTag;
  titleStyles?: ElementStyles;
  contentTag?: TextTag;
  contentStyles?: ElementStyles;
}

export interface WebsiteElement {
  id: string;
  customId?: string;
  type: ElementType;
  label?: string;
  content?: string;
  text?: string;
  links?: Array<{ id?: string; label: string; href: string; target?: string; description?: string }>;
  placeholder?: string;
  logoType?: LogoType;
  src?: string;
  url?: string;
  mapUrl?: string;
  alt?: string;
  title?: string;
  videoUrl?: string;
  videoType?: 'youtube' | 'vimeo' | 'mp4' | 'custom' | string;
  poster?: string;
  videoPoster?: string;
  autoplay?: boolean;
  videoAutoplay?: boolean;
  controls?: boolean;
  videoControls?: boolean;
  loop?: boolean;
  videoLoop?: boolean;
  muted?: boolean;
  videoMuted?: boolean;
  linkAction?: 'none' | 'url' | 'lightbox';
  tableData?: TableData;
  listItems?: string[];
  listMarkerStyle?:
    | 'bullet'
    | 'disc'
    | 'circle'
    | 'square'
    | 'numbers'
    | 'decimal'
    | 'decimal-leading-zero'
    | 'alpha'
    | 'upper-alpha'
    | 'lower-alpha'
    | 'roman'
    | 'upper-roman'
    | 'lower-roman'
    | 'checklist-empty'
    | 'checklist'
    | 'arrow'
    | 'dash'
    | 'star'
    | 'none';
  listIconColor?: string;
  listSpacing?: number;
  listCheckedState?: boolean[];
  accordionItems?: AccordionItemData[];
  accordionIconStyle?: 'chevron' | 'plus-minus' | 'arrow';
  accordionItemBg?: string;
  accordionItemBorderColor?: string;

  iconName?: string;
  iconItems?: string[];
  iconText?: string;
  iconTextLayout?: 'separate' | 'wrap' | 'group';
  iconGap?: number;
  customIcon?: string;
  iconSize?: number;
  iconColor?: string;
  iconBgColor?: string;
  iconBorderRadius?: number;
  iconPadding?: number;

  buttonDisplayMode?: 'icon' | 'icon-text' | 'text';
  buttonActionType?: 'url' | 'modal' | 'email' | 'phone' | 'scroll' | 'toggle-dark-mode' | 'dark-mode';
  buttonEmail?: string;
  buttonSubject?: string;
  buttonPhone?: string;
  buttonScrollTarget?: string;
  buttonModalTargetId?: string;

  inputLabel?: string;
  showInputLabel?: boolean;
  inputPlaceholder?: string;
  inputRequired?: boolean;
  inputDefaultValue?: string;
  inputDefaultChecked?: boolean;
  inputRows?: number;
  inputOptions?: string[];
  inputHelpText?: string;
  inputMasked?: boolean;
  inputMin?: number | string;
  inputMax?: number | string;
  inputStep?: number | string;

  formTitle?: string;
  showFormTitle?: boolean;
  formSubtitle?: string;
  showFormSubtitle?: boolean;
  formFields?: FormField[];
  formSubmitText?: string;
  formSubmitAlign?: 'left' | 'center' | 'right' | 'full';
  formSubmitBgColor?: string;
  formSubmitTextColor?: string;
  formSubmitBorderRadius?: number;
  formSubmitPaddingX?: number;
  formSubmitPaddingY?: number;
  formSubmitFontSize?: number;
  formSubmitFontWeight?: string | number;
  formSubmitBorderColor?: string;
  formSubmitBorderWidth?: number;
  formSubmitShadow?: string;
  formSubmitHoverBgColor?: string;
  formSubmitHoverTextColor?: string;
  formSubmitHoverEffect?: string;
  formActionUrl?: string;
  formMethod?: 'POST' | 'GET';
  formSubmittingText?: string;
  formSuccessMessage?: string;
  formErrorMessage?: string;
  formSuccessAction?: 'inline' | 'modal' | 'redirect';
  formRedirectUrl?: string;
  formAutoReset?: boolean;
  formHoneypotEnabled?: boolean;
  formEndpointMode?: 'vercel' | 'custom';
  formSuccessModalId?: string;
  formErrorModalId?: string;

  formNotificationGmailEnabled?: boolean;
  formNotificationGmailEmail?: string;
  formNotificationTelegramEnabled?: boolean;
  formNotificationTelegramBotToken?: string;
  formNotificationTelegramChatId?: string;

  focusBorderColor?: string;
  focusBackgroundColor?: string;
  focusRingColor?: string;
  focusRingWidth?: number;
  focusTextColor?: string;
  inMobileDrawer?: boolean;

  modalTitle?: string;
  modalContent?: string;
  modalTriggerText?: string;
  modalTriggerStyle?: 'button' | 'link' | 'card';
  modalTriggerAction?: 'button' | 'visit' | 'scroll' | 'exit';
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
  closeButtonPosition?: 'top-right' | 'top-left' | 'outside';
  modalPosition?: 'center' | 'top' | 'bottom' | 'left-drawer' | 'right-drawer';
  modalIsOpen?: boolean;
  modalData?: {
    triggerText?: string;
    title?: string;
    content?: string;
    size?: 'sm' | 'md' | 'lg' | 'full';
    showCloseButton?: boolean;
    buttonStyles?: ElementStyles;
  };

  mapEmbedUrl?: string;
  mapEmbedCode?: string;
  mapLocation?: string;
  mapZoom?: number;
  mapHeight?: number;
  mapAspectRatio?: string;
  mapStyle?: 'standard' | 'dark' | 'light' | 'satellite';

  mediaType?: 'icon' | 'image';
  mediaSrc?: string;
  mediaIcon?: string;
  mediaHeading?: string;
  subContent?: string;
  mediaLayout?: 'side-by-side' | 'wrap';
  mixedMediaLayout?: 'side-by-side' | 'wrap';
  mediaPosition?: 'left' | 'right';
  mediaResponsive?: 'keep-beside' | 'stack';
  keepBesideOnMobile?: boolean;
  mediaWidth?: number | string;
  mediaGap?: number;
  mediaWrapMargin?: number;
  mediaWrapShape?: 'rect' | 'circle' | 'rounded';
  mediaButtonText?: string;
  mediaButtonHref?: string;
  mixedMedia?: {
    mediaType: 'icon' | 'image';
    iconName?: string;
    imageUrl?: string;
    imageAlt?: string;
    layout: 'side-by-side' | 'wrap' | 'stacked';
    mediaPosition?: 'left' | 'right';
    responsiveBehavior?: 'stack-on-mobile' | 'keep-side-by-side';
    mediaWidth?: number;
    gap?: number;
    title?: string;
    subtitle?: string;
    bodyText?: string;
    showButton?: boolean;
    buttonText?: string;
    buttonHref?: string;
  };

  href?: string;
  buttonStyle?: ButtonStyle;
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  icon?: string;
  buttonIcon?: string;
  iconPosition?: 'left' | 'right';
  buttonIconPosition?: 'left' | 'right';
  target?: '_self' | '_blank';
  sublinks?: SubmenuItem[];
  submenu?: SubmenuItem[];
  group?: 'nav1' | 'nav2' | 'main' | 'secondary' | string;
  targetGroup?: 'nav1' | 'nav2' | 'main' | 'secondary' | string;
  tag?: TextTag;
  styles?: ElementStyles;
  variant?: string;
  items?: any[];
  children?: WebsiteElement[];
  isContainer?: boolean;
  hidden?: boolean;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
}

export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'date'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'select'
  | 'number'
  | 'password';

export interface FormField {
  id: string;
  customId?: string;
  name?: string;
  type: FormFieldType;
  label: string;
  showLabel?: boolean;
  placeholder?: string;
  showPlaceholder?: boolean;
  required?: boolean;
  helperText?: string;
  options?: string[];
  defaultValue?: string;
  borderRadius?: number;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  paddingX?: number;
  paddingY?: number;
  fontSize?: number;
  fontWeight?: FontWeightOption;
  focusBorderColor?: string;
  focusBackgroundColor?: string;
  focusRingColor?: string;
  focusRingWidth?: number;
  labelColor?: string;
  labelFontSize?: number;
  labelFontWeight?: FontWeightOption;
  labelTypeface?: TypefaceOption;
  labelLetterSpacing?: number;
  labelLineHeight?: number;
  labelPosition?: 'top' | 'left' | 'bottom' | 'right';
  fieldAlignment?: 'left' | 'center' | 'right' | 'stretch';
  shadow?: ShadowDepth;
  width?: 'full' | '1/2' | '1/3' | '1/4' | '2/3' | '3/4' | string;
  helperTextColor?: string;
  helperTextFontSize?: number;
  placeholderColor?: string;
  placeholderFontSize?: number;
  hoverBorderColor?: string;
  hoverBackgroundColor?: string;
  focusShadow?: string;
  accept?: string;
  multiple?: boolean;
  rows?: number;
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

export interface SubmenuItem {
  id: string;
  label: string;
  href: string;
  target?: '_self' | '_blank';
  description?: string;
}

export type SectionType =
  | 'header'
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'team'
  | 'cta'
  | 'gallery'
  | 'footer'
  | 'text'
  | 'image'
  | 'video'
  | 'image-text'
  | 'video-text'
  | 'table'
  | 'slideshow'
  | 'collage'
  | 'blank'
  | 'custom';

export type HeaderLayoutType =
  | 'standard'
  | 'centered'
  | 'split'
  | 'stacked';

export type HeaderMobileStyle = 'drawer' | 'bottom-bar' | 'compact';
export type HeaderTabletStyle = 'auto' | 'stacked' | 'row';

export interface HeaderDeviceVisibility {
  logo?: boolean;
  nav?: boolean;
  primaryCta?: boolean;
  secondaryCta?: boolean;
  hamburger?: boolean;
}

export interface HeaderLayoutSettings {
  desktop?: HeaderDeviceVisibility;
  tablet?: HeaderDeviceVisibility;
  mobile?: HeaderDeviceVisibility;
  hamburgerGrouping?: 'logo' | 'cta';
}

export type FooterLayoutType =
  | 'columns-4'
  | 'columns-3'
  | 'minimal'
  | 'centered'
  | 'stacked-newsletter'
  | 'split';

export type FooterMobileStyle = 'stacked' | 'accordion' | 'grid-2';
export type FooterTabletStyle = 'grid-2' | 'grid-3' | 'row';

export type HamburgerIconStyle =
  | 'three-equal'
  | 'three-asc-left'
  | 'three-asc-center'
  | 'three-asc-right'
  | 'three-desc-left'
  | 'three-desc-center'
  | 'three-desc-right'
  | 'two-equal'
  | 'two-asc-left'
  | 'two-asc-center'
  | 'two-asc-right'
  | 'two-desc-left'
  | 'two-desc-center'
  | 'two-desc-right'
  | 'dots'
  | 'grid'
  | 'sidebar'
  | 'plus'
  | 'arrow'
  | 'diamond'
  | 'standard'
  | 'thick'
  | 'minimal'
  | 'staggered'
  | 'staggered-center'
  | 'circle'
  | 'square'
  | 'wave'
  | 'stack';

export interface HamburgerSettings {
  displayMode?: 'icon' | 'icon-text' | 'text';
  textLabel?: string;
  textColor?: string;
  textFontSize?: number;
  textFontWeight?: FontWeightOption | string;
  textTypeface?: TypefaceOption | string;
  iconStyle?: HamburgerIconStyle;
  iconColor?: string;
  iconSize?: number;
  lineThickness?: number;
  lineGap?: number;
  lineCap?: 'round' | 'square';
  iconThickness?: 'thin' | 'normal' | 'thick';
  showLabel?: boolean;
  labelText?: string;
  labelPosition?: 'left' | 'right';
  backgroundColor?: string;
  backgroundHoverColor?: string;
  iconHoverColor?: string;
  width?: number;
  height?: number;
  paddingX?: number;
  paddingY?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  shadow?: ShadowDepth;
  hoverEffect?: 'none' | 'scale' | 'lift' | 'glow' | 'invert' | 'rotate';
  backdropBlur?: boolean;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
}

export type CloseButtonType = 'icon' | 'text' | 'icon-text';
export type CloseIconStyle = 'standard' | 'circle' | 'minimal' | 'bold' | 'arrow' | 'chevron' | 'sidebar' | 'square' | 'text';

export interface MobileMenuCloseSettings {
  closeType?: CloseButtonType;
  closeText?: string;
  closeIconStyle?: CloseIconStyle;
  iconPosition?: 'left' | 'right';
  iconThickness?: number;
  position?: 'top-right' | 'top-left' | 'top-center';
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: FontWeightOption;
  paddingX?: number;
  paddingY?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  shadow?: ShadowDepth;
  hoverEffect?: 'none' | 'scale' | 'lift' | 'glow' | 'opacity';
}

export interface MobileMenuSettings {
  openDirection?: 'right' | 'left' | 'top' | 'fullscreen';
  drawerWidth?: number | string;
  drawerWidthVw?: number;
  backgroundColor?: string;
  backgroundGradient?: string;
  backdropBlur?: boolean;
  backdropDim?: 'none' | 'light' | 'medium' | 'heavy' | 'custom';
  backdropCustomColor?: string;
  backdropCustomOpacity?: number;
  backdropCustomBlur?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingHorizontal?: number;
  textAlign?: 'left' | 'center' | 'right';
  linkFontSize?: number;
  linkFontSizeRem?: number;
  linkFontWeight?: FontWeightOption;
  linkTextColor?: string;
  linkHoverColor?: string;
  linkSpacing?: number;
  showDividers?: boolean;
  dividerColor?: string;
  showCta?: boolean;
  ctaFullWidth?: boolean;
  closeSettings?: MobileMenuCloseSettings;
  closeIconStyle?: CloseIconStyle;
  closeIconColor?: string;
  closeType?: CloseButtonType;
  closeText?: string;
}

export interface WebsiteSection {
  id: string;
  anchorId?: string;
  type: SectionType;
  title: string;
  elements: WebsiteElement[];
  styles?: ElementStyles;
  style?: ElementStyles;
  hidden?: boolean;
  headerLayout?: HeaderLayoutType;
  headerMobileStyle?: HeaderMobileStyle;
  headerTabletStyle?: HeaderTabletStyle;
  isSticky?: boolean;
  headerLayoutSettings?: HeaderLayoutSettings;
  hamburgerSettings?: HamburgerSettings;
  mobileMenuSettings?: MobileMenuSettings;
  footerLayout?: FooterLayoutType;
  footerMobileStyle?: FooterMobileStyle;
  footerTabletStyle?: FooterTabletStyle;
  heroLayout?: 'default' | 'image-split' | 'video-split';
  heroPreset?: 'default' | 'image-split' | 'video-split';
  layoutColumns?: '1' | '2' | '3' | '4' | '5' | string;
  footerColumns?: '1' | '2' | '3' | '4' | '5' | string;
  footerColumnRatio?: string;
  footerMobileBehavior?: string;
  footerTabletBehavior?: string;
  reverseMobile?: boolean;
}

export interface SiteSettings {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  robots?: string;
  canonicalUrl?: string;
  language?: string;

  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogSiteName?: string;
  twitterCard?: string;
  twitterHandle?: string;

  jsonSchemaType?:
    | 'Organization'
    | 'WebSite'
    | 'LocalBusiness'
    | 'Article'
    | 'Product'
    | 'FAQPage'
    | 'Event'
    | 'SoftwareApplication'
    | 'Person'
    | 'Service'
    | 'Custom';
  customJsonSchema?: string;
  schemaData?: Record<string, any>;

  faviconUrl?: string;
  faviconDarkUrl?: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
  logoLightSvg?: string;
  logoDarkSvg?: string;
  appleTouchIcon?: string;
  themeColor?: string;
  themeColorDark?: string;
  palette?: PaletteConfig;

  headScripts?: string;
  footerScripts?: string;
}

export interface ColorPalette {
  textColor: string;
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
  neutralColor: string;
}

export interface PaletteConfig {
  enableDarkTheme: boolean;
  light: ColorPalette;
  dark: ColorPalette;
}

export interface WebsitePage {
  id: string;
  title: string;
  fileName?: string;
  previousFileName?: string;
  routePath?: string;
  folder?: string;
  status?: 'draft' | 'published' | 'scheduled' | 'archived';
  indexing?: 'index' | 'no-index';
  passwordProtected?: boolean;
  password?: string;
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: number;
  updatedAt?: number;
  sections: WebsiteSection[];
  globalStyles?: {
    fontFamily?: string;
    fontWeight?: number | string;
    fontSize?: number | string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    textColor?: string;
    backgroundColor?: string;
    themeMode?: 'light' | 'dark' | string;
    lineHeight?: number;
    borderRadius?: number;
    backgroundType?: BackgroundType;
    backgroundGradient?: string;
    gradientFrom?: string;
    gradientTo?: string;
    gradientAngle?: number;
    backgroundImage?: string;
    backgroundOverlay?: 'none' | 'dark' | 'light' | 'gradient' | string;
    overlayColor?: string;
    overlayOpacity?: number;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundSize?: string;
    maxWidth?: string;
    paddingY?: number;
    paddingX?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    marginY?: number;
    marginX?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    scrollbarWidth?: number;
    scrollbarRadius?: number;
    scrollbarThumbColor?: string;
    scrollbarTrackColor?: string;
  };
  siteSettings?: SiteSettings;
}

export type ViewportMode = 'responsive' | 'desktop' | 'tablet' | 'mobile';

export type EditorMode = 'edit' | 'preview' | 'code';

export interface BoundingRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

export interface SelectedElementContext {
  element: WebsiteElement;
  sectionId: string;
  subItemIndex?: number;
  subItemPart?: 'title' | 'content' | 'form-field' | 'form-label' | 'form-button' | 'form-container' | 'cell' | 'cell-text' | 'header' | 'header-cell' | string;
  formFieldId?: string;
  formFieldIndex?: number;
  formPart?: 'field' | 'label' | 'button' | 'container';
  tablePart?: 'table' | 'header' | 'header-cell' | 'cell' | 'cell-text';
  tableRowIndex?: number;
  tableColIndex?: number;
  rect?: BoundingRect;
  domElement?: HTMLElement | null;
  initialTab?: string;
}

export interface SelectedSectionContext {
  section: WebsiteSection;
  rect?: BoundingRect;
}

export interface PresetLogoSample {
  name: string;
  url: string;
}

export interface PresetImageSample {
  name: string;
  url: string;
  category: string;
}

export interface PageRevision {
  id: string;
  pageId: string;
  timestamp: string;
  author: string;
  authorRole?: string;
  summary: string;
  sections: WebsiteSection[];
  globalStyles?: WebsitePage['globalStyles'];
  title?: string;
  fileName?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  details: string;
  category: 'Page' | 'Publish' | 'Team' | 'Settings' | 'Revision';
  ipAddress?: string;
}

export interface PageComment {
  id: string;
  pageId: string;
  sectionId?: string;
  authorName: string;
  authorRole: string;
  authorPhoto?: string;
  text: string;
  createdAt: string;
  resolved: boolean;
  resolvedBy?: string;
  replies?: {
    id: string;
    authorName: string;
    authorRole: string;
    text: string;
    createdAt: string;
  }[];
}

export type CMSFieldType = 'text' | 'rich-text' | 'image' | 'number' | 'date' | 'boolean' | 'select' | 'email' | 'url';

export interface CMSField {
  id: string;
  name: string;
  key: string;
  type: CMSFieldType;
  required?: boolean;
  options?: string[];
  helpText?: string;
}

export interface CMSCollection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  fields: CMSField[];
  createdAt: string;
  updatedAt: string;
}

export interface CMSItem {
  id: string;
  collectionId: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
