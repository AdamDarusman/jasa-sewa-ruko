// @ts-expect-error midtrans-client does not have native ts types
import midtransClient from "midtrans-client";

export function getSnapClient() {
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
  const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";

  return new midtransClient.Snap({
    isProduction,
    serverKey,
    clientKey,
  });
}

export async function createMidtransTransaction({
  orderNumber,
  grossAmount,
  customerName,
  customerEmail,
  customerPhone,
  itemName,
}: {
  orderNumber: string;
  grossAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  itemName: string;
}) {
  const snap = getSnapClient();

  const parameter = {
    transaction_details: {
      order_id: orderNumber,
      gross_amount: Math.round(grossAmount),
    },
    customer_details: {
      first_name: customerName,
      email: customerEmail,
      phone: customerPhone || "08123456789",
    },
    item_details: [
      {
        id: orderNumber,
        price: Math.round(grossAmount),
        quantity: 1,
        name: itemName.substring(0, 50),
      },
    ],
  };

  const transaction = await snap.createTransaction(parameter);
  return transaction; // returns { token: '...', redirect_url: '...' }
}
