import RestaurantDetailsPage from "./RestaurantDetailsPage";
import { Metadata } from 'next';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Restaurant Details | Teeko`,
        description: `Details for restaurant ${slug}`,
    };
}

export default async function Page() {
    return <RestaurantDetailsPage />;
}
