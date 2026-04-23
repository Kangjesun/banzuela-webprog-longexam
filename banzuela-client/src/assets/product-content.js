import Prod1 from "./img/nu_basketball_v2_tshirt.png";
import Prod2 from "./img/nu_bulldogs_baller.png";
import Prod3 from "./img/nu_bulldogs_baseball_tshirt.png";
import Prod4 from "./img/nu_cap.png";
import Prod5 from "./img/nu_hoodie.png";
import Prod6 from "./img/nu_lanyard.png";
import Prod7 from "./img/nu_sweat_shirt.png";
import Prod8 from "./img/nu_v1_scarf.png";
import Prod9 from "./img/nu_lady_bulldogs_tshirt.png";
import Prod10 from "./img/nu_keychain.png";
import Prod11 from "./img/nu_varsity_jacket.png";
import Prod12 from "./img/nu_watch.png";
import Prod13 from "./img/NUBackpack.png";
import Prod14 from "./img/NUPhoneCase.png";
import Prod15 from "./img/NUTumbler.png";
import Prod16 from "./img/nu_classic_v1_sticker.png";


const products = [
  {
    name: 'nu-basketball-shirt',
    title: 'NU Basketball T-Shirt',
    category: 'Apparel',
    price: 'PHP 699',
    stock: 'In stock',
    image: Prod1,
    content: [
      'Official-inspired NU basketball shirt with athletic fit and bold print.',
      'Breathable fabric designed for both sports and casual wear.',
      'Perfect for game days or everyday campus outfits.',
    ],
  },
  {
    name: 'nu-bulldogs-baller',
    title: 'NU Bulldogs Baller Shirt',
    category: 'Apparel',
    price: 'PHP 749',
    stock: 'In stock',
    image: Prod2,
    content: [
      'Street-style Bulldogs baller shirt with standout graphics.',
      'Soft cotton blend for all-day comfort.',
      'Great for fans who want a sporty and trendy look.',
    ],
  },
  {
    name: 'nu-baseball-shirt',
    title: 'NU Bulldogs Baseball T-Shirt',
    category: 'Apparel',
    price: 'PHP 699',
    stock: 'In stock',
    image: Prod3,
    content: [
      'Classic baseball-style NU Bulldogs shirt with sporty vibe.',
      'Lightweight and breathable for warm weather.',
      'Ideal for casual wear and outdoor activities.',
    ],
  },
  {
    name: 'nu-cap',
    title: 'NU Cap',
    category: 'Apparel',
    price: 'PHP 399',
    stock: 'In stock',
    image: Prod4,
    content: [
      'Adjustable NU cap with embroidered logo.',
      'Durable and comfortable for daily use.',
      'A simple way to represent NU anywhere.',
    ],
  },
  {
    name: 'nu-hoodie',
    title: 'NU Hoodie',
    category: 'Apparel',
    price: 'PHP 1,199',
    stock: 'In stock',
    image: Prod5,
    content: [
      'Warm and cozy hoodie featuring NU branding.',
      'Made with soft fleece interior for comfort.',
      'Perfect for cooler days or late-night study sessions.',
    ],
  },
  {
    name: 'nu-lanyard',
    title: 'NU Lanyard',
    category: 'Daily Essentials',
    price: 'PHP 199',
    stock: 'In stock',
    image: Prod6,
    content: [
      'Durable NU lanyard for IDs and keys.',
      'Lightweight and comfortable for daily use.',
      'Perfect for students and office use.',
    ],
  },
  {
    name: 'nu-sweatshirt',
    title: 'NU Sweatshirt',
    category: 'Apparel',
    price: 'PHP 999',
    stock: 'In stock',
    image: Prod7,
    content: [
      'Classic NU sweatshirt with clean design.',
      'Soft fabric for warmth and comfort.',
      'Great for layering or casual outfits.',
    ],
  },
  {
    name: 'nu-scarf',
    title: 'NU Scarf',
    category: 'Apparel',
    price: 'PHP 349',
    stock: 'In stock',
    image: Prod8,
    content: [
      'Stylish NU scarf with bold school colors.',
      'Lightweight yet warm material.',
      'Perfect for showing school spirit during events.',
    ],
  },
  {
    name: 'nu-lady-bulldogs-shirt',
    title: 'NU Lady Bulldogs T-Shirt',
    category: 'Apparel',
    price: 'PHP 699',
    stock: 'In stock',
    image: Prod9,
    content: [
      'Designed for Lady Bulldogs fans with flattering fit.',
      'Soft and breathable fabric.',
      'Perfect for both casual wear and game support.',
    ],
  },
  {
    name: 'nu-keychain',
    title: 'NU Keychain',
    category: 'Accessories',
    price: 'PHP 149',
    stock: 'In stock',
    image: Prod10,
    content: [
      'Compact NU keychain with durable design.',
      'Easy to attach to keys or bags.',
      'A small but stylish way to represent NU.',
    ],
  },
  {
    name: 'nu-varsity-jacket',
    title: 'NU Varsity Jacket',
    category: 'Apparel',
    price: 'PHP 1,799',
    stock: 'In stock',
    image: Prod11,
    content: [
      'Premium NU varsity jacket with classic design.',
      'Warm interior with durable outer material.',
      'Perfect statement piece for school pride.',
    ],
  },
  {
    name: 'nu-watch',
    title: 'NU Watch',
    category: 'Accessories',
    price: 'PHP 899',
    stock: 'In stock',
    image: Prod12,
    content: [
      'Sleek NU wristwatch with minimalist design.',
      'Comfortable strap for daily wear.',
      'Combines function and school spirit.',
    ],
  },
  {
    name: 'nu-backpack',
    title: 'NU Backpack',
    category: 'Daily Essentials',
    price: 'PHP 1,299',
    stock: 'In stock',
    image: Prod13,
    content: [
      'Spacious NU backpack for books and daily essentials.',
      'Durable with multiple compartments.',
      'Ideal for school and travel use.',
    ],
  },
  {
    name: 'nu-phone-case',
    title: 'NU Phone Case',
    category: 'Accessories',
    price: 'PHP 299',
    stock: 'In stock',
    image: Prod14,
    content: [
      'Protective NU phone case with sleek design.',
      'Lightweight yet durable material.',
      'Keeps your phone safe while showing school pride.',
    ],
  },
  {
    name: 'nu-tumbler',
    title: 'NU Tumbler',
    category: 'Daily Essentials',
    price: 'PHP 499',
    stock: 'In stock',
    image: Prod15,
    content: [
      'Reusable NU tumbler for hot or cold drinks.',
      'Leak-resistant and easy to carry.',
      'Perfect for everyday hydration.',
    ],
  },
  {
    name: 'nu-sticker',
    title: 'NU Sticker',
    category: 'Accessories',
    price: 'PHP 99',
    stock: 'In stock',
    image: Prod16,
    content: [
      'High-quality NU sticker with vibrant print.',
      'Water-resistant and long-lasting.',
      'Perfect for laptops and notebooks.',
    ],
  },
];

export default products;
