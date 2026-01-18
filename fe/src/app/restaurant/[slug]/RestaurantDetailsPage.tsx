"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, MapPin, Phone, Globe, Clock, Share2, Heart, ChevronRight, Utensils, Award } from 'lucide-react';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const RestaurantDetailsPage = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const params = useParams();
    const id = params?.id || params?.slug;
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');

    const MOCK_RESTAURANTS = [
        {
            id: 1,
            name: "Iketeru Restaurant",
            image: "https://media-cdn.tripadvisor.com/media/photo-o/17/f8/75/34/iketeru-restaurant.jpg",
            rating: 4.8,
            reviewCount: 2704,
            cuisine: "Japanese",
            priceRange: "$$$$",
            address: "3 Jalan Stesen Sentral Level 8, Hilton Hotel, Kuala Lumpur 50470 Malaysia",
            address_obj: {
                street1: "3 Jalan Stesen Sentral",
                street2: "Level 8, Hilton Hotel",
                city: "Kuala Lumpur",
                country: "Malaysia",
                postalcode: "50470",
                address_string: "3 Jalan Stesen Sentral Level 8, Hilton Hotel, Kuala Lumpur 50470 Malaysia"
            },
            // discount: "20% off",
            phone: "+60 3-2264 2264",
            website: "https://www.sevenrooms.com/reservations/iketeru/tripadvisor",
            reserve_website: "https://www.sevenrooms.com/reservations/iketeru/tripadvisor",
            isOpen: true,
            description: "Embark on a gastronomic adventure that showcases the finest nuances of Japanese cuisine. With a dedicated team led by Chef Tokuhisa Naotaka, Iketeru stands as one of the city's culinary gems, renowned for curated multi-course menus, fresh air-flown produce sashimi and an emphasis on quality ingredients and innovation.",
            features: [
                "American Express",
                "Accepts Credit Cards",
                "Mastercard",
                "Visa",
                "Buffet",
                "Family style",
                "Free Wifi",
                "Highchairs Available",
                "Non-smoking restaurants",
                "Parking Available",
                "Private Dining",
                "Reservations",
                "Seating",
                "Serves Alcohol",
                "Table Service",
                "Takeout",
                "Valet Parking",
                "Validated Parking"
            ],
            hours: [
                { day: "Mon-Sun", time: "12:00 PM - 02:30 PM" },
                { day: "Mon-Sun", time: "06:30 PM - 10:30 PM" },
            ],
            popularDishes: [
                { name: "Assortment of Sashimi", price: "$28", image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/16/e3/d5/ea/assortment-of-sashimi.jpg" },
                { name: "Iketeru Private Room", price: "$18", image: "https://media-cdn.tripadvisor.com/media/photo-o/06/0b/94/4a/iketeru-restaurant.jpg" },
                { name: "Raw sea bream, tuna & king clam", price: "$12", image: "https://media-cdn.tripadvisor.com/media/photo-o/06/0a/72/38/iketeru-restaurant.jpg" }
            ]
        },
        {
            id: 2,
            name: "Sky51",
            image: "https://media-cdn.tripadvisor.com/media/photo-o/26/96/bc/92/sky51-facade.jpg",
            rating: 4.8,
            reviewCount: 461,
            cuisine: "International",
            priceRange: "$$$$",
            address: "Jalan Sultan Ismail Equatorial Plaza, Kuala Lumpur 50250 Malaysia",
            address_obj: {
                street1: "Jalan Sultan Ismail",
                street2: "Equatorial Plaza",
                city: "Kuala Lumpur",
                country: "Malaysia",
                postalcode: "50250",
                address_string: "Jalan Sultan Ismail Equatorial Plaza, Kuala Lumpur 50250 Malaysia"
            },
            phone: "+60 3-2789 7777",
            website: "https://www.eqkualalumpur.equatorial.com/dining/sky51/",
            reserve_website: "https://www.sevenrooms.com/explore/sky51andblue/reservations/create/search",
            isOpen: true,
            description: "The eye-popping Sky51 is an entire floor dedicated to fine dining, fine wines, creative cocktails, and unrivalled views. Featured here are Sabayon, specializing in gourmet Continental cuisine, and Blue, an open-air rooftop lounge. All of which, promises a memorable experience. Sabayon Contemporary European dining reaches a whole new level – literally and lavishly. Sabayon is on most everyone’s places to eat. The cuisine is best described as the perfect combination of classic and contemporary. The award-winning restaurant serves degustation menus with an option for wine pairing. Be delighted in Sabayon’s fine-dining journey. For those requiring a private setting, our team will be happy to arrange a more personal dining experience for parties of any size. Give the special occasion that extra shine. Blue KL’s top bespoke outdoor rooftop bar at Sky51 offers tantalising snacks and handcrafted cocktails prepared by seasoned mixologists. The picture-perfect skybar provides the best panoramic views of the city, spanning from the KL Tower to the Petronas Twin Towers. There are three main areas: Lounge to unwind and watch live performances, Sky Deck where one gets a front-row seat to the city skyline and VIP Deck for private parties.",
            features: [
                "Accepts Credit Cards",
                "Full Bar",
                "Outdoor Seating",
                "Parking Available",
                "Reservations",
                "Seating",
                "Serves Alcohol",
                "Table Service",
                "Wine and Beer"
            ],
            hours: [
                { day: "Mon-Sun", time: "05:00 PM - 01:00 AM" },
            ],
            popularDishes: [
                { name: "SKY51", price: "$28", image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/26/96/b7/de/sky51.jpg" },
                { name: "BLUE - Private Pods", price: "$18", image: "https://media-cdn.tripadvisor.com/media/photo-w/26/96/b7/dc/blue-private-pods.jpg" },
                { name: "SKY51 - Sky Deck", price: "$12", image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/26/96/b7/d9/sky51-sky-deck.jpg" }
            ]
        },
        {
            id: 3,
            name: "Vasco's",
            image: "https://media-cdn.tripadvisor.com/media/photo-o/06/11/bf/f5/vasco-s-kl-hilton.jpg",
            rating: 4.8,
            reviewCount: 3242,
            cuisine: "International",
            priceRange: "$$ - $$$",
            address: "3 Jalan Stesen Sentral Lobby Level, Hilton Kuala Lumpur, Kuala Lumpur 50470 Malaysia",
            address_obj: {
                street1: "3 Jalan Stesen Sentral",
                street2: "Lobby Level, Hilton Kuala Lumpur",
                city: "Kuala Lumpur",
                country: "Malaysia",
                postalcode: "50470",
                address_string: "3 Jalan Stesen Sentral Lobby Level, Hilton Kuala Lumpur, Kuala Lumpur 50470 Malaysia"
            },
            // discount: "Free Dessert",
            phone: "+60 3-2264 2264",
            website: "https://www.sevenrooms.com/reservations/vascos/tripadvisor",
            reserve_website: "https://www.sevenrooms.com/reservations/vascos/tripadvisor",
            isOpen: true,
            description: "An innovative all-day-dining restaurant designed with an \"al fresco\" urban park feel. Impressive buffet showcase with choice selection of Asian and international favourites.",
            features: [
                "American Express",
                "Accepts Credit Cards",
                "Mastercard",
                "Visa",
                "Buffet",
                "Free Wifi",
                "Highchairs Available",
                "Parking Available",
                "Private Dining",
                "Reservations",
                "Seating",
                "Table Service",
                "Valet Parking",
                "Validated Parking",
                "Wheelchair Accessible",
                "Wine and Beer"
            ],
            hours: [
                { day: "Mon-Fri", time: "12:00 PM - 02:30 PM" },
                { day: "Mon-Fri", time: "06:00 PM - 10:00 PM" },
                { day: "Sat-Sun", time: "12:30 PM - 03:00 PM" },
                { day: "Sat-Sun", time: "06:00 PM - 10:00 PM" },
            ],
            popularDishes: [
                { name: "Vasco's Main Entrance", price: "$28", image: "https://media-cdn.tripadvisor.com/media/photo-o/06/11/c0/83/vasco-s-kl-hilton.jpg" },
                { name: "Mini nutella dorayaki . Live at our dessert counter .", price: "$18", image: "https://media-cdn.tripadvisor.com/media/photo-o/2c/ee/85/07/mini-nutella-dorayaki.jpg" },
                { name: "Meat lovers to dine at and enjoy our carving .", price: "$12", image: "https://media-cdn.tripadvisor.com/media/photo-o/2c/ee/84/6e/meat-lovers-to-dine-at.jpg" }
            ]
        },
        {
            id: 4,
            name: "Kampachi EQ",
            image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/22/29/f8/19/magnificent-sushi-counter.jpg",
            rating: 4.9,
            reviewCount: 716,
            cuisine: "Japanese",
            priceRange: "$$$$",
            address: "Equatorial Hotel 27 Jalan Sultan Ismail, Kuala Lumpur 50250 Malaysia",
            address_obj: {
                street1: "Equatorial Hotel",
                street2: "27 Jalan Sultan Ismail",
                city: "Kuala Lumpur",
                country: "Malaysia",
                postalcode: "50250",
                address_string: "Equatorial Hotel 27 Jalan Sultan Ismail, Kuala Lumpur 50250 Malaysia"
            },
            phone: "+60 3-2789 7722",
            website: "http://www.kampachi.com.my/",
            reserve_website: "https://www.sevenrooms.com/explore/kampachieq/reservations/create/search",
            isOpen: true,
            description: "The latest and finest version of Kampachi Restaurants after the great remake. Features a sophisticated Hinoki Wood Sushi counter that will surely bring your Sushi Omakase dining experience to the next level.",
            features: [
                "American Express",
                "Accepts Credit Cards",
                "Mastercard",
                "Visa",
                "Buffet",
                "Family style",
                "Free Wifi",
                "Full Bar",
                "Gift Cards Available",
                "Highchairs Available",
                "Non-smoking restaurants",
                "Parking Available",
                "Private Dining",
                "Reservations",
                "Seating",
                "Serves Alcohol",
                "Table Service",
                "Takeout",
                "Valet Parking",
                "Wheelchair Accessible",
                "Wine and Beer"
            ],
            hours: [
                { day: "Mon-Sun", time: "12:00 PM - 03:00 PM" },
                { day: "Mon-Sun", time: "06:00 PM - 10:00 PM" },
            ],
            popularDishes: [
                { name: "Be seated at the sushi counter for a delightful sushi Omakase using the freshest ingredients prepared heartfully at Kampachi. ", price: "$28", image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/22/29/fe/78/be-seated-at-the-sushi.jpg" },
                { name: "Exquisite Kappou dining area.", price: "$18", image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/22/29/f8/6a/exquisite-kappou-dining.jpg" },
                { name: "Semi-private dining area.", price: "$12", image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/22/29/f8/4d/semi-private-dining-area.jpg" }
            ]
        },
        {
            id: 5,
            name: "The Mesh",
            image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/2a/c6/ec/a4/merasa-kembali-kenangan.jpg",
            rating: 4.9,
            reviewCount: 345,
            cuisine: "International",
            priceRange: "$$$$",
            address: "Jalan Ampang Ground Floor, Four Points By Sheraton Kuala Lumpur, City Centre Corner of Jalan Sultan Ismail, Kuala Lumpur 50450 Malaysia",
            "address_obj": {
                "street1": "Jalan Ampang",
                "street2": "Ground Floor, Four Points By Sheraton Kuala Lumpur, City Centre Corner of Jalan Sultan Ismail",
                "city": "Kuala Lumpur",
                "country": "Malaysia",
                "postalcode": "50450",
                "address_string": "Jalan Ampang Ground Floor, Four Points By Sheraton Kuala Lumpur, City Centre Corner of Jalan Sultan Ismail, Kuala Lumpur 50450 Malaysia"
            },
            phone: "+60 3-2706 9099",
            website: "http://www.themeshkl.com",
            reserve_website: "https://www.sevenrooms.com/reservations/themesh/tripadvisor",
            isOpen: true,
            description: "Embrace the communal spirit and savour authentic Malaysian cuisine at The Mesh. Our all-day dining venue blends traditional dishes with a modern twist in a unique, inviting atmosphere, celebrating community and culture, fit for a capacity of over 200 persons.",
            features: [
                "American Express",
                "Accepts Credit Cards",
                "Mastercard",
                "Visa",
                "Buffet",
                "Family style",
                "Free Wifi",
                "Highchairs Available",
                "Non-smoking restaurants",
                "Parking Available",
                "Private Dining",
                "Reservations",
                "Seating",
                "Serves Alcohol",
                "Table Service",
                "Takeout",
                "Valet Parking",
                "Validated Parking"
            ],
            hours: [
                { day: "Mon-Sun", time: "06:30 AM - 10:30 PM" },
            ],
            popularDishes: [
                { name: "Seafood Asam Pedas", price: "$28", image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/2b/b5/68/73/seafood-asam-pedas.jpg" },
                { name: "Chicken Burger & Triple Deck Club", price: "$18", image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/2b/b5/68/72/chicken-burger-triple.jpg" },
                { name: "Booze", price: "$12", image: "https://media-cdn.tripadvisor.com/media/photo-w/2b/b5/68/71/booze.jpg" }
            ]
        },
    ];

    // Mock data for a single restaurant (would normally fetch based on ID)
    const restaurant = MOCK_RESTAURANTS.find(restaurant => restaurant.id === Number(id)) || MOCK_RESTAURANTS[0];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 pb-12 pt-20">
            <Navigation forceSolid />
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                    <span className="cursor-pointer hover:text-red-600 dark:hover:text-red-400" onClick={() => router.push('/restaurants')}>Restaurants</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="font-medium text-gray-900 dark:text-gray-200">{restaurant?.name}</span>
                </div>
            </div>

            {/* Hero Images Grid (TripAdvisor style) */}
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <div className="grid grid-cols-4 gap-2 h-96 rounded-2xl overflow-hidden relative">
                    <div className="col-span-2 row-span-2">
                        <img src={restaurant?.image} alt="Main" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="col-span-1">
                        <img src={restaurant?.popularDishes?.[0].image} alt="Dish 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="col-span-1">
                        <img src={restaurant?.popularDishes?.[1].image} alt="Dish 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="col-span-1">
                        <img src={restaurant?.popularDishes?.[2].image} alt="Dish 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    {/* <div className="col-span-1 relative">
                        <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1374&auto=format&fit=crop" alt="Ambience" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                            <span className="text-white font-bold text-lg">+ 42 photos</span>
                        </div>
                    </div> */}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mb-20">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Header Info */}
                        <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-8">
                            <div className="flex justify-between items-start mb-4">
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{restaurant?.name}</h1>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-all">
                                        <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-600" />
                                    </button>
                                    <button className="p-2 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-all">
                                        <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-red-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-sm mb-6">
                                <div className="flex items-center gap-1.5">
                                    <div className="flex text-red-500">
                                        {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`w-5 h-5 ${star <= Math.floor(restaurant?.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />)}
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">{restaurant?.rating}</span>
                                    <span className="text-gray-500 dark:text-gray-400 underline cursor-pointer">{restaurant?.reviewCount} reviews</span>
                                </div>

                                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                                    <Utensils className="w-4 h-4" />
                                    <span>{restaurant?.cuisine}</span>
                                </div>

                                <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{restaurant?.priceRange}</span>
                                </div>

                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${restaurant?.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {restaurant?.isOpen ? 'Open Now' : 'Closed'}
                                </div>
                            </div>

                            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <span className="text-base">{restaurant?.address}</span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-8 border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto">
                            {['Overview', 'Menu', 'Reviews', 'Photos', 'Q&A'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase())}
                                    className={`pb-4 font-bold text-base whitespace-nowrap transition-all border-b-2 ${activeTab === tab.toLowerCase() ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content: Overview */}
                        <div className="space-y-10">
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{restaurant?.description}</p>
                            </section>

                            {/* <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Dishes</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {restaurant.popularDishes.map((dish, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:shadow-md transition-all cursor-pointer bg-white">
                                            <img src={dish.image} alt={dish.name} className="w-24 h-24 rounded-lg object-cover" />
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-900 mb-1">{dish.name}</h4>
                                                <span className="text-red-600 font-bold block mb-2">{dish.price}</span>
                                                <button className="text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-red-600">View Photo</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section> */}

                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Features & Amenities</h2>
                                <div className="grid grid-cols-2 gap-y-3">
                                    {restaurant?.features.map(feature => (
                                        <div key={feature} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                            <Award className="w-5 h-5 text-red-500" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Sticky Sidebar */}
                    <div className="w-full lg:w-80 shrink-0 space-y-6">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location & Contact</h3>

                            {/* Map Placeholder */}
                            <div className="h-48 bg-gray-100 rounded-xl mb-6 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-74.006,40.7128,14,0/600x400?access_token=YOUR_TOKEN')] bg-cover bg-center grayscale opacity-60"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-sm font-bold text-gray-800 shadow-sm group-hover:scale-105 transition-transform flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-red-500" />
                                        View Map
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{restaurant?.address}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{restaurant?.phone}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-gray-400" />
                                    <a href={restaurant?.website} target="_blank" className="text-red-600 text-sm font-medium hover:underline">Visit Website</a>
                                </div>
                            </div>

                            <hr className="border-gray-100 dark:border-gray-700 my-4" />

                            <div className="mb-6">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-red-500" /> Opening Hours
                                </h4>
                                <div className="space-y-2 text-sm">
                                    {restaurant?.hours?.map((h, i) => (
                                        <div key={i} className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400 w-20">{h.day}</span>
                                            <span className="text-gray-900 dark:text-gray-200 font-medium">{h.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => window.open(restaurant.reserve_website, "_blank")} className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                Reserve a Table
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RestaurantDetailsPage;
