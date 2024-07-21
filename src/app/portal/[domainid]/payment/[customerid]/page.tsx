import {
  onDomainCustomerResponses,
  onGetAllDomainBookings,
} from '@/actions/appointment'
import { onGetDomainProductsAndConnectedAccountId } from '@/actions/payments'
import PortalForm from '@/components/forms/portal/portal-form'
import React from 'react'

const CustomerPaymentPage = async ({
  params,
}: {
  params: { domainid: string; customerid: string }
}) => {
  const questions = await onDomainCustomerResponses(params.customerid)
  const products = await onGetDomainProductsAndConnectedAccountId(
    params.domainid
  )

  if (!questions) return null

  return (
    <></>
  )
}

export default CustomerPaymentPage
