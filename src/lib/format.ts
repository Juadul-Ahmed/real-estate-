export function formatPrice(property: { type: "rent" | "sale"; price: number; rentPrice?: number }) {
  if (property.type === "rent") {
    return `$${property.rentPrice || property.price}/mo`;
  }
  return `$${property.price.toLocaleString()}`;
}
