export interface IBuyTicketRequest {
  showId: string;
  userId: string;
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "BANK_TRANSFER" | "CASH";
  quantity: number;
}
