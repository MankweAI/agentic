import {
  onDomainCustomerResponses,
  onGetAllDomainBookings,
} from "@/actions/appointment";
import PortalForm from "@/components/forms/portal/portal-form";
import React from "react";

type Props = { params: { domainid: string; customerid: string } };

const CustomerSignUpForm = async ({ params }: Props) => {
  console.log("......... PARAMS", params);
  
  const { customerid, domainid } = params;
  const [questions, bookings] = await Promise.all([
    onDomainCustomerResponses(params.customerid),
    onGetAllDomainBookings(domainid),
  ]);
  

  return (
    <PortalForm
      bookings={bookings}
      email={questions?.email!}
      domainid={domainid}
      customerId={params.customerid}
      questions={[]}
      type="Appointment"
    />
  );
};

export default CustomerSignUpForm;
