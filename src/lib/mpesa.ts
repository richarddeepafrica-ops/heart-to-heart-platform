type MpesaEnvironment = "sandbox" | "production";

export type MpesaStkRequest = {
  donationId: string;
  amount: number;
  phone: string;
  accountReference: string;
  description: string;
};

export type MpesaStkResult =
  | {
      ok: true;
      merchantRequestId?: string;
      checkoutRequestId?: string;
      responseCode?: string;
      responseDescription?: string;
      customerMessage?: string;
      raw: unknown;
    }
  | {
      ok: false;
      message: string;
      raw?: unknown;
    };

function getMpesaEnvironment(): MpesaEnvironment {
  return process.env.MPESA_ENVIRONMENT === "production" ? "production" : "sandbox";
}

function getBaseUrl() {
  return getMpesaEnvironment() === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

export function getMissingMpesaConfig() {
  return [
    "MPESA_CONSUMER_KEY",
    "MPESA_CONSUMER_SECRET",
    "MPESA_SHORTCODE",
    "MPESA_PASSKEY",
    "MPESA_CALLBACK_URL"
  ].filter((key) => !process.env[key]);
}

export function normalizeMpesaPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254") && digits.length === 12) return digits;
  if (digits.startsWith("0") && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return "";
}

function timestamp() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join("");
}

async function getAccessToken() {
  const key = process.env.MPESA_CONSUMER_KEY || "";
  const secret = process.env.MPESA_CONSUMER_SECRET || "";
  const credentials = Buffer.from(`${key}:${secret}`).toString("base64");
  const response = await fetch(`${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
    cache: "no-store"
  });
  const payload = (await response.json().catch(() => null)) as { access_token?: string; errorMessage?: string } | null;

  if (!response.ok || !payload?.access_token) {
    throw new Error(payload?.errorMessage || "Could not get M-Pesa access token.");
  }

  return payload.access_token;
}

export async function initiateMpesaStkPush(input: MpesaStkRequest): Promise<MpesaStkResult> {
  const missing = getMissingMpesaConfig();
  if (missing.length > 0) {
    return {
      ok: false,
      message: `M-Pesa is not configured. Missing: ${missing.join(", ")}.`
    };
  }

  const phone = normalizeMpesaPhone(input.phone);
  if (!phone) return { ok: false, message: "Enter a valid M-Pesa phone number." };

  const businessShortCode = process.env.MPESA_SHORTCODE || "";
  const passkey = process.env.MPESA_PASSKEY || "";
  const requestTimestamp = timestamp();
  const password = Buffer.from(`${businessShortCode}${passkey}${requestTimestamp}`).toString("base64");
  const token = await getAccessToken();
  const response = await fetch(`${getBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: requestTimestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: input.amount,
      PartyA: phone,
      PartyB: businessShortCode,
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: input.accountReference.slice(0, 12),
      TransactionDesc: input.description.slice(0, 100)
    })
  });
  const payload = (await response.json().catch(() => null)) as {
    MerchantRequestID?: string;
    CheckoutRequestID?: string;
    ResponseCode?: string;
    ResponseDescription?: string;
    CustomerMessage?: string;
    errorMessage?: string;
  } | null;

  if (!response.ok || payload?.ResponseCode !== "0") {
    return {
      ok: false,
      message: payload?.errorMessage || payload?.ResponseDescription || "M-Pesa STK Push could not be started.",
      raw: payload
    };
  }

  return {
    ok: true,
    merchantRequestId: payload.MerchantRequestID,
    checkoutRequestId: payload.CheckoutRequestID,
    responseCode: payload.ResponseCode,
    responseDescription: payload.ResponseDescription,
    customerMessage: payload.CustomerMessage,
    raw: payload
  };
}
