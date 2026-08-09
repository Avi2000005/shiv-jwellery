export type Collection = {
  name: string
  count: string
  tagline: string
  image: string
}

export const collections: Collection[] = [
  {
    name: 'Rings',
    count: '48 pieces',
    tagline: 'A promise, cast in gold',
    image: '/images/cat-rings.png',
  },
  {
    name: 'Necklaces',
    count: '32 pieces',
    tagline: 'Heirlooms for the collar',
    image: '/images/cat-necklaces.png',
  },
  {
    name: 'Earrings',
    count: '54 pieces',
    tagline: 'Light that follows you',
    image: '/images/cat-earrings.png',
  },
  {
    name: 'Bangles',
    count: '26 pieces',
    tagline: 'A quiet music at the wrist',
    image: '/images/cat-bangles.png',
  },
]

export type Product = {
  id: string
  name: string
  price: number
  image: string
  gemstone: string
  gold: string
  category: string
}

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Solitaire Vow Ring',
    price: 2450,
    image: '/images/product-1.png',
    gemstone: 'Brilliant Diamond',
    gold: '22k Yellow Gold',
    category: 'Rings',
  },
  {
    id: 'p2',
    name: 'Emerald Meridian Pendant',
    price: 1890,
    image: '/images/product-2.png',
    gemstone: 'Zambian Emerald',
    gold: '18k Yellow Gold',
    category: 'Necklaces',
  },
  {
    id: 'p3',
    name: 'Aurora Drop Earrings',
    price: 1620,
    image: '/images/product-3.png',
    gemstone: 'Pavé Diamond',
    gold: '18k Yellow Gold',
    category: 'Earrings',
  },
  {
    id: 'p4',
    name: 'Heritage Kada Bangle',
    price: 3200,
    image: '/images/product-4.png',
    gemstone: 'Diamond & Ruby',
    gold: '22k Yellow Gold',
    category: 'Bangles',
  },
]

export const metals = ['22k Yellow Gold', '18k Rose Gold', '18k White Gold']
export const sizes = ['5', '6', '7', '8', '9']

export function formatPrice(n: number) {
  return `$${n.toLocaleString('en-US')}`
}
