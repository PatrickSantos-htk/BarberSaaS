import { formatCurrencyBRL } from "@/lib/utils";

/**
 * A wa.me "click to chat" link only pre-fills the message — sending still
 * requires a human to hit send inside WhatsApp. No official API access,
 * no automated/unattended delivery, but also zero infra and zero risk of
 * the number getting flagged for automated behavior.
 */
export function buildWhatsAppLink(phone: string, message: string) {
  const digits = phone.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
}

export function buildPaymentChargeMessage(input: {
  clientName: string;
  serviceName: string;
  price: number;
  pixKey: string | null;
}) {
  const lines = [
    `Olá ${input.clientName}! Seu atendimento (${input.serviceName}) no valor de ${formatCurrencyBRL(input.price)} está com pagamento pendente.`,
  ];
  if (input.pixKey) {
    lines.push(`Chave PIX: ${input.pixKey}`);
  }
  lines.push("Qualquer dúvida, é só chamar por aqui. Obrigado!");
  return lines.join("\n\n");
}
