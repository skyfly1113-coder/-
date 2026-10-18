export type GameMode = 'touch-count' | 'choose-number' | 'put-in-box' | 'free-play';

export type NumberRange = '1-3' | '1-5' | '1-10';

export type CountingStyle = 'native' | 'sino'; // native: 하나, 둘, 셋 / sino: 일, 이, 삼

export type ConcreteItemId =
  | 'apple'
  | 'strawberry'
  | 'banana'
  | 'bear'
  | 'puppy'
  | 'duck'
  | 'car'
  | 'star'
  | 'cookie'
  | 'carrot';

export interface ConcreteItemDef {
  id: ConcreteItemId;
  name: string;
  unit: string;
  themeColor: string;
  bgLight: string;
}

export interface PlacedObject {
  id: string;
  index: number; // 0, 1, 2...
  itemId: ConcreteItemId;
  isCounted: boolean;
  orderNumber?: number; // 1, 2, 3...
  x?: number;
  y?: number;
}

export interface AccessibilitySettings {
  numberRange: NumberRange;
  countingStyle: CountingStyle;
  speechRate: number; // 0.6 (아주 천천히) ~ 0.7 (천천히) ~ 0.85 (보통)
  useVoice: boolean;
  useSound: boolean;
  useTenFrame: boolean;
  highContrast: boolean;
  switchAccess: boolean;
  switchScanSpeed: number; // in seconds, e.g. 2.5
}
