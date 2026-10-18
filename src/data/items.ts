import { ConcreteItemDef } from '../types/game';

export const CONCRETE_ITEMS: ConcreteItemDef[] = [
  {
    id: 'apple',
    name: '사과',
    unit: '개',
    themeColor: '#EF4444',
    bgLight: '#FEF2F2',
  },
  {
    id: 'bear',
    name: '곰돌이',
    unit: '마리',
    themeColor: '#B45309',
    bgLight: '#FEF3C7',
  },
  {
    id: 'strawberry',
    name: '딸기',
    unit: '개',
    themeColor: '#F43F5E',
    bgLight: '#FFE4E6',
  },
  {
    id: 'duck',
    name: '오리',
    unit: '마리',
    themeColor: '#EAB308',
    bgLight: '#FEFCE8',
  },
  {
    id: 'car',
    name: '자동차',
    unit: '대',
    themeColor: '#3B82F6',
    bgLight: '#EFF6FF',
  },
  {
    id: 'puppy',
    name: '강아지',
    unit: '마리',
    themeColor: '#D97706',
    bgLight: '#FFFBEB',
  },
  {
    id: 'banana',
    name: '바나나',
    unit: '개',
    themeColor: '#F59E0B',
    bgLight: '#FEF9C3',
  },
  {
    id: 'star',
    name: '별',
    unit: '개',
    themeColor: '#FBBF24',
    bgLight: '#FEF3C7',
  },
  {
    id: 'cookie',
    name: '쿠키',
    unit: '개',
    themeColor: '#A16207',
    bgLight: '#FDF6E2',
  },
  {
    id: 'carrot',
    name: '당근',
    unit: '개',
    themeColor: '#EA580C',
    bgLight: '#FFEDD5',
  },
];

export function getItemDef(id: string): ConcreteItemDef {
  return CONCRETE_ITEMS.find((it) => it.id === id) || CONCRETE_ITEMS[0];
}
