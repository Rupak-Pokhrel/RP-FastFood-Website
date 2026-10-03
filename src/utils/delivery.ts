export const getDeliveryLabel = (distance: number, radius: number) => distance <= radius ? 'FREE' : 'Additional delivery charges may apply.';
