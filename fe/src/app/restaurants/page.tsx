import RestaurantsPage from "./RestaurantsPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Restaurants | Teeko',
    description: 'Find the best restaurants in Kuala Lumpur',
};

export default function Page() {
    return <RestaurantsPage />;
}
