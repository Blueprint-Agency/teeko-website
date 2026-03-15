export interface ContentBlock {
    id?: string;
    blockType: "h2" | "h3" | "h4" | "paragraph" | "location" | "restaurant" | "image";
    content: string;
    orderIndex?: string;
    locationId?: string;
    restaurantId?: string;
    imageUrl?: string;
    imageSize?: "small" | "medium" | "large";
    linkedEntity?: any;
    suggestions?: any[];
}
