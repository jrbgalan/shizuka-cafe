/**
 * @typedef {'All' | 'Coffee Notes' | 'Brewing Guides' | 'Origins' | 'Café Life' | 'Seasonal' | 'Recipes'} Category
 */

/**
 * @typedef {Object} Author
 * @property {string} name
 * @property {string} role
 * @property {string} avatarLabel
 */

/**
 * @typedef {Object} ContentBlock
 * @property {'paragraph'|'heading'|'quote'|'image'|'list'} type
 * @property {string} [content]
 * @property {string[]} [items]
 * @property {string} [caption]
 * @property {string} [label]
 */

/**
 * @typedef {Object} Post
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} excerpt
 * @property {ContentBlock[]} content
 * @property {Category} category
 * @property {Author} author
 * @property {string} date
 * @property {string} readTime
 * @property {string} coverImageLabel
 * @property {boolean} [featured]
 */

/** @type {Author[]} */
export const authors = [
  { name: "Kenji Sato", role: "Head Roaster", avatarLabel: "coffee_bean_avatar" },
  { name: "Mei Lin", role: "Craft Brewer", avatarLabel: "tea_leaf_avatar" },
  { name: "Yuki Tanaka", role: "Café Manager", avatarLabel: "bonsai_avatar" }
];

/** @type {Category[]} */
export const categories = [
  'All',
  'Coffee Notes',
  'Brewing Guides',
  'Origins',
  'Café Life',
  'Seasonal',
  'Recipes'
];

/** @type {Post[]} */
export const posts = [
  {
    id: 'post-1',
    slug: 'art-of-pour-over',
    title: 'The Art of the Perfect Pour-Over',
    excerpt: 'Mastering the delicate balance of time, temperature, and technique to bring out the subtle notes of our single-origin beans.',
    category: 'Brewing Guides',
    author: authors[0],
    date: '2023-10-15',
    readTime: '6 min read',
    coverImageLabel: 'pourover_coffee_drip',
    featured: true,
    content: [
      { type: 'paragraph', content: 'There is a certain meditation in the act of making a pour-over coffee. It requires patience, precision, and a quiet presence that sets the tone for the rest of the day.' },
      { type: 'heading', content: 'The Right Equipment' },
      { type: 'paragraph', content: 'Before we begin, ensure you have a gooseneck kettle, a reliable burr grinder, and a digital scale. These tools are non-negotiable for consistency.' },
      { type: 'quote', content: 'A great cup of coffee is 50% beans and 50% technique.' },
      { type: 'image', label: 'pourover_setup_zen', caption: 'Our daily setup at the roastery.' },
      { type: 'heading', content: 'Step-by-Step Guide' },
      { type: 'list', items: [
        'Boil water to exactly 93°C (199°F).',
        'Grind 15g of coffee beans to a medium-fine consistency.',
        'Rinse the paper filter to remove papery taste and preheat the dripper.',
        'Pour 30g of water for the bloom and wait 30 seconds.',
        'Slowly pour the remaining 220g in concentric circles.'
      ]},
      { type: 'paragraph', content: 'Take a moment to inhale the aroma during the bloom. This is where the coffee first speaks to you.' }
    ]
  },
  {
    id: 'post-2',
    slug: 'autumn-blend-2023',
    title: 'Introducing Our Autumn Blend',
    excerpt: 'Warm notes of roasted chestnut, dark chocolate, and a hint of sweet persimmon.',
    category: 'Seasonal',
    author: authors[0],
    date: '2023-09-28',
    readTime: '4 min read',
    coverImageLabel: 'coffee_beans_autumn',
    content: [
      { type: 'paragraph', content: 'As the leaves turn and the air grows crisp, our palates naturally seek warmth and comfort. We are delighted to introduce our new Autumn Blend.' },
      { type: 'heading', content: 'The Flavor Profile' },
      { type: 'paragraph', content: 'We combined our washed Colombian beans for their chocolatey body with a natural processed Ethiopian to bring out a delicate fruitiness.' },
      { type: 'quote', content: 'Like a quiet autumn afternoon captured in a cup.' },
      { type: 'paragraph', content: 'Perfectly paired with our seasonal Mont Blanc pastry, this blend is designed to be enjoyed slowly.' }
    ]
  },
  {
    id: 'post-3',
    slug: 'ethiopia-yirgacheffe-journey',
    title: 'Journey to Yirgacheffe',
    excerpt: 'Exploring the lush hills of Ethiopia where our favorite floral coffees are grown.',
    category: 'Origins',
    author: authors[2],
    date: '2023-08-10',
    readTime: '8 min read',
    coverImageLabel: 'coffee_farm_ethiopia',
    content: [
      { type: 'paragraph', content: 'Last month, I had the privilege of visiting the birthplace of coffee. The high altitudes and fertile soils of Yirgacheffe produce some of the most distinctive coffees in the world.' },
      { type: 'heading', content: 'Meeting the Farmers' },
      { type: 'paragraph', content: 'We visited several smallholder farms, where coffee trees grow wild in the shade of dense canopies. The dedication of these farmers to sustainable practices is truly inspiring.' },
      { type: 'image', label: 'coffee_cherries_ethiopia', caption: 'Ripe coffee cherries ready for harvest.' },
      { type: 'paragraph', content: 'We brought back a micro-lot of these exceptional beans, which will be available in the café starting next week.' }
    ]
  },
  {
    id: 'post-4',
    slug: 'matcha-espresso-fusion',
    title: 'Recipe: The Kyoto Collision',
    excerpt: 'How to make our signature matcha and espresso layered drink at home.',
    category: 'Recipes',
    author: authors[1],
    date: '2023-07-22',
    readTime: '3 min read',
    coverImageLabel: 'matcha_espresso_layered',
    content: [
      { type: 'paragraph', content: 'The Kyoto Collision was born from a happy accident when we were experimenting with our ceremonial grade matcha and house espresso.' },
      { type: 'heading', content: 'Ingredients' },
      { type: 'list', items: [
        '2g ceremonial grade matcha powder',
        '30ml warm water (80°C)',
        '150ml oat milk',
        '1 shot (30ml) of espresso',
        'Ice cubes'
      ]},
      { type: 'paragraph', content: 'Whisk the matcha with warm water until frothy. Fill a glass with ice, pour in the oat milk, then slowly pour the matcha over the milk. Finally, gently float the espresso on top. Enjoy the beautiful layers before stirring!' }
    ]
  },
  {
    id: 'post-5',
    slug: 'zen-of-café-design',
    title: 'The Zen of Our Space',
    excerpt: 'Designing a café that invites calm and quiet reflection.',
    category: 'Café Life',
    author: authors[2],
    date: '2023-06-05',
    readTime: '5 min read',
    coverImageLabel: 'cafe_interior_zen',
    content: [
      { type: 'paragraph', content: 'When designing Shizuka Café, our goal was not just to serve excellent coffee, but to provide a sanctuary from the bustling city outside.' },
      { type: 'heading', content: 'Material Choices' },
      { type: 'paragraph', content: 'We chose natural, raw materials—hinoki wood, natural stone, and handmade ceramic tiles. These materials age beautifully and ground the space.' },
      { type: 'quote', content: 'Empty space is just as important as the objects that fill it.' },
      { type: 'paragraph', content: 'The layout encourages quiet conversation and solitary reading, with generous spacing between tables.' }
    ]
  },
  {
    id: 'post-6',
    slug: 'understanding-roast-levels',
    title: 'Understanding Roast Levels',
    excerpt: 'From light and floral to dark and robust: finding your perfect roast.',
    category: 'Coffee Notes',
    author: authors[0],
    date: '2023-05-18',
    readTime: '6 min read',
    coverImageLabel: 'coffee_roasting_process',
    content: [
      { type: 'paragraph', content: 'Roasting coffee is a delicate dance between heat and time. The roast level dramatically changes the flavor profile of the bean.' },
      { type: 'heading', content: 'Light Roast' },
      { type: 'paragraph', content: 'Light roasts preserve the origin characteristics of the bean. You will often taste floral, fruity, and tea-like notes. The body is lighter, and the acidity is brighter.' },
      { type: 'heading', content: 'Medium Roast' },
      { type: 'paragraph', content: 'A balanced approach. Medium roasts offer a harmonious blend of origin flavors and roast flavors (like caramel and chocolate).' },
      { type: 'heading', content: 'Dark Roast' },
      { type: 'paragraph', content: 'Here, the roast flavors dominate. Expect bold, robust, dark chocolate, and smoky notes with very low acidity.' }
    ]
  },
  {
    id: 'post-7',
    slug: 'summer-cold-brew',
    title: 'Perfecting the Cold Brew',
    excerpt: 'Our refreshing method for smooth, low-acidity iced coffee.',
    category: 'Brewing Guides',
    author: authors[1],
    date: '2023-04-10',
    readTime: '4 min read',
    coverImageLabel: 'cold_brew_glass',
    content: [
      { type: 'paragraph', content: 'Cold brew is incredibly forgiving and easy to make at home. By replacing heat with time, we extract a smooth, sweet, and low-acidity coffee concentrate.' },
      { type: 'heading', content: 'The Ratio' },
      { type: 'paragraph', content: 'We recommend a 1:8 ratio of coffee to water for a concentrate, or 1:15 for a ready-to-drink brew.' },
      { type: 'list', items: [
        'Coarsely grind your beans.',
        'Mix with cold, filtered water in a jar.',
        'Steep in the fridge for 16-24 hours.',
        'Strain through a paper filter.'
      ]},
      { type: 'paragraph', content: 'Serve over ice, diluted with water or milk to your liking.' }
    ]
  },
  {
    id: 'post-8',
    slug: 'morning-rituals',
    title: 'Morning Rituals at the Café',
    excerpt: 'The quiet hour before we open our doors to the world.',
    category: 'Café Life',
    author: authors[2],
    date: '2023-03-22',
    readTime: '3 min read',
    coverImageLabel: 'a quiet corner with a plant',
    content: [
      { type: 'paragraph', content: 'The café is never quieter than it is at 6:00 AM. This is our favorite time of day.' },
      { type: 'paragraph', content: 'The first task is dialing in the espresso machine. We taste the first shots, adjusting the grind size to account for the day\'s humidity and temperature. It is a daily calibration of our senses.' },
      { type: 'image', label: 'espresso_machine_steam', caption: 'Warming up the equipment.' },
      { type: 'paragraph', content: 'Then comes the smell of fresh pastries arriving from the bakery, and the quiet sweeping of the floors. By 7:00 AM, we are ready to welcome you.' }
    ]
  }
];

/**
 * Get a post by its slug
 * @param {string} slug
 * @returns {Post | undefined}
 */
export const getPostBySlug = (slug) => {
  return posts.find(post => post.slug === slug);
};

/**
 * Get related posts based on category
 * @param {string} currentPostId
 * @param {Category} category
 * @param {number} limit
 * @returns {Post[]}
 */
export const getRelatedPosts = (currentPostId, category, limit = 3) => {
  return posts
    .filter(post => post.id !== currentPostId && post.category === category)
    .slice(0, limit);
};

/**
 * Search posts by query
 * @param {string} query
 * @returns {Post[]}
 */
export const searchPosts = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return posts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) || 
    post.excerpt.toLowerCase().includes(lowercaseQuery)
  );
};
