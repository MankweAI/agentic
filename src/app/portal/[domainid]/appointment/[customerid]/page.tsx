import {
  onDomainCustomerResponses,
  onGetAllDomainBookings,
} from "@/actions/appointment";
import PortalForm from "@/components/forms/portal/portal-form";
import React from "react";

type Props = { params: { domainid: string; customerid: string } };

const CustomerSignUpForm = async ({ params }: Props) => {
  const { customerid, domainid } = params;
  const [questions, bookings] = await Promise.all([
    onDomainCustomerResponses(customerid),
    onGetAllDomainBookings(domainid),
  ]);

  if (!questions) return null;

  return (
    <PortalForm
      bookings={bookings}
      email={questions?.email!}
      domainid={domainid}
      customerId={customerid}
      questions={questions?.questions}
      type="Appointment"
    />
  );
};

export default CustomerSignUpForm;
