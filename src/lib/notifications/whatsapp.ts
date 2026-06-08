
function assertWhatsAppEnv() {
  if (!process.env.WHATSAPP_ACCESS_TOKEN) throw new Error('Missing WHATSAPP_ACCESS_TOKEN');
  if (!process.env.WHATSAPP_PHONE_NUMBER_ID) throw new Error('Missing WHATSAPP_PHONE_NUMBER_ID');
  if (!process.env.WHATSAPP_ADMIN_NUMBER) throw new Error('Missing WHATSAPP_ADMIN_NUMBER');
}

function normalizeWhatsAppNumber(phone: string) {
  return phone.replace(/\D/g, '');
}

function getGraphUrl() {
  assertWhatsAppEnv();
  return `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
}

async function sendTemplateMessage({
  to,
  templateName,
  bodyParams,
}: {
  to: string;
  templateName: string;
  bodyParams: string[];
}) {
  const response = await fetch(getGraphUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: normalizeWhatsAppNumber(to),
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: bodyParams.map((text) => ({
              type: 'text',
              text,
            })),
          },
        ],
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`WhatsApp send failed for template "${templateName}": ${text}`);
  }

  return response.json();
}

export async function sendAdminPaidOrderWhatsApp({
  orderNumber,
  customerName,
  totalInr,
  phone,
  adminOrderUrl,
}: {
  orderNumber: string;
  customerName: string;
  totalInr: number;
  phone: string;
  adminOrderUrl: string;
}) {
  return sendTemplateMessage({
    to: process.env.WHATSAPP_ADMIN_NUMBER!,
    templateName: 'admin_new_paid_order',
    bodyParams: [
      orderNumber,
      customerName,
      String(totalInr),
      phone,
      adminOrderUrl,
    ],
  });
}

export async function sendCustomerPaidWhatsApp({
  customerPhone,
  customerName,
  orderNumber,
  totalInr,
  trackingUrl,
  storeName,
}: {
  customerPhone: string;
  customerName: string;
  orderNumber: string;
  totalInr: number;
  trackingUrl: string;
  storeName: string;
}) {
  return sendTemplateMessage({
    to: customerPhone,
    templateName: 'order_payment_confirmed',
    bodyParams: [
      customerName,
      orderNumber,
      String(totalInr),
      trackingUrl,
      storeName,
    ],
  });
}