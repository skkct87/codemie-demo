export const packages = {
  goa:       { name: "Goa Getaway (3 Days)", price: 8999 },
  kerala:    { name: "Kerala Backwaters (5 Days)", price: 15999 },
  manali:    { name: "Manali Adventure (4 Days)", price: 12999 },
  rajasthan: { name: "Rajasthan Heritage (6 Days)", price: 21999 }
};

export function formatINR(n) {
  return "₹ " + n.toLocaleString("en-IN");
}