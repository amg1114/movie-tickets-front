import { useAuth } from "@/_context/AuthContext";
import { api } from "@/_lib/axios";
import { IShow } from "@/_models/entities/show.interface";
import { IBuyTicketRequest } from "@/_models/requests/buy-ticket-req.interface";
import FormFeedback, { IFormFeedbackProps } from "@/_ui/components/forms/FormFeedback";
import StyledInput from "@/_ui/components/forms/StyledInput";
import StyledSelect from "@/_ui/components/forms/StyledSelect";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function BuyForm({ show }: { show: IShow }) {
  const [state, setState] = useState<{
    error?: string;
    status: IFormFeedbackProps["status"];
  } | null>(null);

  const { user } = useAuth();
  const { register, handleSubmit } = useForm<IBuyTicketRequest>({
    defaultValues: {
      showId: show.id,
      userId: user?.id || "",
    },
  });

  const onSubmit = async (data: IBuyTicketRequest) => {
    try {
      await api.post("/tickets", data);
      setState({ status: "success" });
    } catch (error) {
      if (error instanceof AxiosError) {
        setState({
          status: "error",
          error: error.response?.data.message || "An error occurred while purchasing tickets.",
        });
        return;
      }

      setState({
        status: "error",
        error: "An error occurred while purchasing tickets.",
      });
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      {state && (
        <FormFeedback
          status={state.status}
          errorMessage={state.error}
          successMessage="Tickets purchased successfully! Check your email for details."
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <StyledInput
          label="Quantity"
          type="number"
          min={1}
          defaultValue={1}
          {...register("quantity")}
        />
        <StyledSelect
          label="Payment Method"
          options={[
            { label: "Credit Card", value: "CREDIT_CARD" },
            { label: "Debit Card", value: "DEBIT_CARD" },
            { label: "Bank Transfer", value: "BANK_TRANSFER" },
            { label: "Cash", value: "CASH" },
          ]}
          {...register("paymentMethod")}
        />
      </div>

      <button
        type="submit"
        className="font-bungee cursor-pointer rounded bg-purple-500 p-4 text-xl text-white transition-colors hover:bg-purple-600"
      >
        Buy Tickets
      </button>
    </form>
  );
}
