// Dish names checked against each restaurant's digital menu. Prices are intentionally omitted.
window.woodlandMenus = {
  hari: [
    ['Soups & salads', ['Tomato And Basil Soup', 'Cream Of Mushroom Soup', 'Sweet Corn Veg Soup', 'Manchow Veg Soup', 'Broccoli Almond Soup', 'Hot N Sour Chicken', 'Chicken Wonton Soup']],
    ['Comfort food', ['Veggie Feast Pizza', 'Paneer Tikka Pizza', 'Spaghetti N Classic Arrabbiata', 'Penne In Creamy Alfredo', 'Cheesy Spinach N Corn Rolls', 'Thai Spring Rolls - Vegetable', 'Chicken Momos Steamed']],
    ['Starters', ['Paneer Tikka Classic', 'Malai Broccoli', 'Dahi Ke Shollay', 'Stuffed Tandoori Mushroom', 'Crispy Corn Pepper Salt', 'Murgh Tikka Classic', 'Chilly Chicken Dry', 'Mutton Seekh Kebab']],
    ['Asian favourites', ['Vegetable Chilly Garlic Noodles', 'Chicken Noodles', 'Vegetable Fried Rice', 'Teriyaki Chicken Fried Rice', 'Vegetable Manchurian With Gravy', 'Chicken N Thai Green Curry']],
    ['Indian mains', ['Dal Dera Peshawari', 'Yellow Dal Tadka', 'Paneer Lababdar', 'Paneer Butter Masala', 'Kadhai Paneer', 'Murgh Makhanwala', 'Murgh Tikka Lababdar', 'Mutton Roganjosh']],
    ['Rice & sweets', ['Subz Biryani', 'Murgh Biryani', 'Gosht Biryani', 'Jeera Rice', 'Chocolate Brownie With Vanilla Ice Cream', 'Gulab Jamun']]
  ],
  dwarka: [
    ['Soups & salads', ['Som Tam Salad', 'Tomato And Basil Soup', 'Vegetable Wonton Soup', 'Manchow Veg Soup', 'Badami Murgh Shorba', 'Chicken Wonton Soup']],
    ['Pizza & pasta', ['Veggie Feast Pizza', 'Paneer Tikka Pizza', 'Mushroom, Olive & Jalapeño Delight Pizza', 'Chicken Tikka Pizza', 'Spaghetti N Pesto Basil Sauce', 'Penne N Creamy Alfredo Sauce']],
    ['Quick bites & dimsum', ['Cheesy Spinach Corn Rolls', 'Tomato And Basil Bruschetta', 'Thai Spring Rolls Veg', 'Honey Chilly Potatoes', 'Vegetable Crystal Dimsums', 'Chicken Crystal Dimsums']],
    ['From the tandoor', ['Makhmali Paneer Tikka', 'Afghani Paneer Tikka', 'Dahi Ke Sholley', 'Crispy Corn Pepper Salt', 'Stuffed Tandoori Mushrooms', 'Afghani Murgh', 'Tandoori Murgh', 'Prawn Tempura']],
    ['Mains & global flavours', ['Dal Dera Peshawari', 'Paneer Tikka Lababdar', 'Paneer Makhani', 'Kadhai Paneer', 'Murgh Makhanwala', 'Teriyaki Grilled Chicken N Rice', 'Exotic Vegetables N Thai Curry']],
    ['Rice, breads & desserts', ['Vegetable Fried Rice', 'Subz Pulao', 'Garlic Naan', 'Laccha Parantha', 'Moong Dal Ka Halwa', 'Phirni', 'Gulab Jamun']]
  ],
  janakpuri: [
    ['Soups', ['Cream Of Tomato', 'Sweet Corn Veg', 'Hot N Sour Veg', 'Manchow Veg', 'Cream Of Chicken', 'Sweet Corn Chicken', 'Lemon Coriander Chicken']],
    ['Pizza & comfort food', ['Veggie Feast Pizza', 'Paneer Tikka Pizza', 'Pizza Chicken Tikka', 'Penne In Tangy Tomato Sauce', 'Cheesy Spinach N Corn Rolls', 'Thai Spring Rolls - Vegetable', 'Momos Veg Steamed']],
    ['Starters', ['Makhmali Paneer Tikka', 'Afghani Paneer Tikka', 'Paneer Tikka Classic', 'Dahi Ke Sholay', 'Crispy Corn Pepper Salt', 'Murgh Tikka Classic', 'Mutton Seekh Kebab']],
    ['Chinese favourites', ['Vegetable Chilly Garlic Noodles', 'Chicken N Egg Noodles', 'Vegetable Fried Rice', 'Diced Chicken Szechwan Style', 'Chilly Paneer With Gravy', 'Vegetable Chopsuey', 'Chicken Chinese Sizzler']],
    ['Indian mains', ['Dal Dera Peshawari', 'Yellow Dal Tadka', 'Paneer Lababdar', 'Paneer Butter Masala', 'Kadhai Paneer', 'Murgh Makhanwala', 'Mutton Roganjosh']],
    ['Biryani, breads & sweets', ['Subz Biryani', 'Murgh Biryani with Gravy', 'Gosht Biryani', 'Jeera Rice', 'Tandoori Roti', 'Naan Buttered', 'Gulab Jamun']]
  ]
};

// Package descriptions transcribed from the five buffet PDFs supplied by the restaurant.
window.woodlandBuffets = [
  {
    title:'Veg Standard Menu', terms:'Minimum 15 guests · 3 hours · snacks served for 90 minutes',
    sections:[
      ['Welcome drinks','Virgin Mojito; assorted soft drinks; bottled water (unlimited)'],
      ['Circulatory snacks','Paneer Tikka Classic; Dahi Ke Sholey; Chilly Mushroom Dry; Soya Malai Chaap Tikka; Thai Vegetable Spring Rolls; Crispy Honey Chilli Potatoes'],
      ['Soups','Tomato & Basil Soup; Hot N Sour Soup'],
      ['Main course','Garden fresh vegetable salad; mixed raita; Dal Makhani; Paneer Butter Masala; Mixed Vegetables or Vegetable Manchurian Gravy; Jeera Rice; Vegetable Hakka Noodles; assorted breads (naan, roti, laccha paratha)'],
      ['Desserts & afters','Gulab Jamun; ice cream; cappuccino coffee']
    ]
  },
  {
    title:'Non Veg Standard Menu', terms:'Minimum 15 guests · 3 hours · snacks served for 90 minutes',
    sections:[
      ['Welcome drinks','Virgin Mojito; assorted soft drinks; bottled water (unlimited)'],
      ['Circulatory snacks','Paneer Tikka Classic; Thai Vegetable Spring Rolls; Crispy Honey Chilli Potatoes; Soya Malai Chaap Tikka; Murgh Tikka Classic; Chilly Chicken Dry'],
      ['Soups','Tomato & Basil Soup; Chicken Hot & Sour Soup'],
      ['Main course','Garden fresh vegetables; mixed raita; Murgh Makhanwala Boneless; Dal Makhani; Paneer Butter Masala; Mixed Vegetables or Vegetable Manchurian Gravy; Jeera Rice; Vegetable Hakka Noodles; assorted bread (naan, roti, laccha paratha)'],
      ['Desserts & afters','Gulab Jamun; ice cream; cappuccino coffee']
    ]
  },
  {
    title:'Non Veg Premium Menu', terms:'Minimum 15 guests · 3 hours',
    sections:[
      ['Welcome drinks','Pina Colada; Virgin Mojito; Guava Lime Spritzer; assorted soft drinks; bottled water (unlimited)'],
      ['Vegetarian snacks — choose eight','Cheesy Spinach Corn Rolls; Cheese N Corn Poppers; Tai Pai Paneer; Paneer Satay; Makhmali Paneer Tikka; Paneer Tikka Classic; Tomato and Basil Bruschetta; Dahi Ke Sholay; Vegetable Wontons; Thai Vegetable Spring Rolls; Vegetable Manchurian Dry; Crispy Vegetables Pepper Salt; Crispy Corn Pepper Salt; Chilly Garlic Mushroom; Mushroom Duplex; Chatpatey Tandoori Mushroom; Soya Chaap Tikka; Stuffed Tandoori Aloo; Crispy Honey Chilli Potatoes; Herbed Potato Wedges; French Fries; Vegetable Seekh Kebab; Hara Bhara Kebab'],
      ['Non vegetarian snacks','Fish Fingers; Crispy Fish Pepper Salt; Murgh Tikka Classic; Kali Mirch Murgh Tikka; Lassoni Murgh Tikka; Tai Pai Chicken; Drums Of Heaven; Crispy Chicken Pepper Salt; Honey Chilly Chicken; Chicken Seekh Kebab; Mutton Seekh Kebab; Mutton Shammi Kebab'],
      ['Soups','Tomato & Basil; Broccoli Almond; Sweet Corn (chicken or veg); Hot N Sour (chicken or veg); Manchow (chicken or veg); Murgh Badami Shorba'],
      ['Main course choices','Salad bar with garden fresh vegetables, spring onion, mixed raita and kimchi salad; choose two non vegetarian mains, one dal, two paneer dishes, two vegetables, two pasta or noodle dishes, one rice or pulao; assorted Indian breads'],
      ['Non vegetarian mains','Murgh Makhanwala; Chicken Dhaniya Adraki Boneless; Murgh Tikka Lababdar; Kadhai Murgh; Shredded Chicken N Hot Garlic Sauce; Chilly Chicken Gravy; Mutton Roganjosh'],
      ['Vegetarian mains','Dal Dera Peshawari; Yellow Dal Tadka; Dal Dhaba Style; Malai Kofta; Paneer Dhaniya Adraki; Paneer Tikka Lababdar; Paneer Butter Masala; Kadhai Paneer; Mixed Vegetables; Aloo Gobhi; Makai Khumb Palak; Vegetable Manchurian Gravy; Thai Curry'],
      ['Desserts & afters','Choose two: Gulab Jamun; Gulkand Phirni; Fruit Cream; ice cream; Moong Dal Halwa; Gajar Halwa. Cappuccino coffee after the meal.']
    ]
  },
  {
    title:'Kitty Party Menu', terms:'Minimum 8 guests',
    sections:[
      ['Welcome drinks','Choose one per person: Pina Colada; Virgin Mojito; Tomato & Basil Soup; Broccoli Almond Soup. Assorted soft drinks served without limit.'],
      ['Starters — choose six','Cheesy Spinach Corn Rolls; Tai Pai Paneer; Makhmali Paneer Tikka; Stuffed Tandoori Mushrooms; Tomato and Basil Bruschetta; Crispy Corn Pepper Salt; Honey Chilly Potatoes; Soya Chaap Achari Tikka; Fish Fingers; Tai Pai Chicken; Drums Of Heaven Classic; Makhmali Murgh Tikka; Lasooni Murgh Tikka; Mutton Seekh Kebab'],
      ['Main course — choose two sets','Set 1: Dal Dera Peshawari, Paneer Lababdar, Jeera Rice, Onion Rings, assorted breads. Set 2: Dal Dera Peshawari, Murgh Makhanwala Boneless, Jeera Rice, Onion Rings, assorted breads. Set 3: Vegetable Hakka Noodles with Vegetable Manchurian Gravy or Chilly Chicken Gravy. Set 4: Penne Pasta in Creamy Alfredo or Arrabbiata sauce. Set 5: Thai Green Curry with chicken or exotic vegetables and steamed rice.'],
      ['Afters — choose one per person','Gulab Jamun; ice cream; Phirni; cappuccino coffee']
    ]
  },
  {
    title:'Classic Birthday Party Menu', terms:'Minimum 15 guests · 3 hour venue time between 1 PM and 7 PM',
    sections:[
      ['Welcome drinks','Assorted soft drinks and bottled water, unlimited'],
      ['Snacks — choose five','Chilly Paneer Dry; Paneer Tikka Classic; Cheesy Vegetable Croquettes; Thai Vegetable Spring Rolls; Crispy Corn Pepper Salt; Penne In Mixed Sauce Pasta; Vegetable Tortilla Wrap; Mini Burgers; Coleslaw Sandwich; Honey Chilly Potatoes; Herbed Potato Wedges; French Fries'],
      ['Main course — choose two sets','Set 1: Dal Dera Peshawari, Paneer Makhani, stuffed kulcha and onion rings. Set 2: Pav Bhaji. Set 3: Vegetable Hakka Noodles with Vegetable Manchurian Gravy. Set 4: Exotic Vegetables in Thai Curry (green or red) with steamed rice.'],
      ['Dessert — choose one','Vanilla ice cream with chocolate syrup; Phirni']
    ]
  }
];
