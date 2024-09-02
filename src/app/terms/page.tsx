import NavBar from "@/components/navbar";
import GA from "../../components/ga";

export default async function Terms() {
  return (
    <>
      <GA />
      <NavBar />
      <div className="container mx-auto max-w-4xl p-4 md:p-6 lg:p-8 xl:p-10 bg-white rounded-lg shadow-lg">
        <div className="m-8 w-full flex justify-between">
          <header className="w-auto"></header>

          <h1 className="text-2xl w-full flex justify-center font-bold text-[#C60D69]">
            Terms Of Use
          </h1>
        </div>

        <div className="m-8">
          <h1 className="text-xl font-bold text-[#C60D69]">
            30 Days Free Trial
          </h1>
          <hr className="border-1 border-[#C60D69]" />
          <p className="text-sm text-gray-600 mt-4">
            The 30-day free trial gives you access to the full range of services
            offered by our platform at no cost. No credit card information is
            required to initiate the trial, and there is no obligation to
            continue using the service after the trial ends. The trial is
            designed to allow you to evaluate the platform&apos;s features and
            benefits without any financial commitment.
          </p>
        </div>
        <div className="m-8">
          <h1 className="text-xl font-bold text-[#C60D69]">Contracts</h1>
          <hr className="border-1 border-[#C60D69]" />
          <p className="text-sm text-gray-600">
            Our platform operates on a no-contract basis. You are not bound by
            any long-term agreements and can continue using our services only as
            long as you find value in them and are satisfied with the results.
            Your commitment to our platform is entirely based on your ongoing
            satisfaction and the benefits you experience.
          </p>
        </div>
        <div className="m-8">
          <h1 className="text-xl font-bold text-[#C60D69]">Premiums</h1>
          <hr className="border-1 border-[#C60D69]" />

          <p className="mt-3">
            <strong>Premium Fees and Payment Terms</strong>
          </p>

          <p>
            Our premium services are available at a competitive price of R1800
            per month (excluding VAT, which will be added at the prevailing
            South African rate). To ensure seamless access to our platform,
            please note the following payment terms, which apply to all
            subscribers within South Africa:
          </p>

          <ul className="m-3">
            <li>
              <strong>Payment Due Date</strong>: Premium fees are payable no
              later than the 3rd day of each month.
            </li>
            <li>
              <strong>Late Payment</strong>: Failure to make timely payment may
              result in cancellation of your service.
            </li>
            <li>
              <strong>No Exceptions</strong>: To avoid disruption, we cannot
              make exceptions to this payment schedule.
            </li>
          </ul>

          <p>
            <strong>Prompt Payment Ensures Continuous Service</strong>
          </p>

          <p>
            To maintain access to our premium features and support, please
            ensure that your payments are made on or before the due date. If you
            have any questions or concerns about our payment terms, please
            don&apos;t hesitate to reach out to us.
          </p>
        </div>

        <div className="m-8">
          <h1 className="text-xl font-bold text-[#C60D69]">
            Information Security
          </h1>
          <hr className="border-1 border-[#C60D69]" />

          <p className="mt-4">
            We take the security of your information and your clients&apos; data
            seriously. Our platform is hosted on secure servers provided by our
            trusted third-party partners, who implement robust measures to
            protect your data.
          </p>

          <ul className="mt-4">
            <li>
              <strong>Authentication Security</strong>: Our platform uses secure
              authentication protocols to ensure that only authorized users can
              access the platform.
            </li>
            <li>
              <strong>Data Security</strong>: Your client&apos;s data and your
              own user information are stored securely on our servers, protected
              by industry-standard encryption and access controls.
            </li>
            <li>
              <strong>Data Deletion</strong>: For added peace of mind, your
              customer information is permanently removed from our servers daily
              at 10PM.
            </li>
          </ul>

          <p className="mt-4">
            Our information security policy is aligned with the requirements of
            the Protection of Personal Information Act (POPIA) of South Africa,
            ensuring that we adhere to the highest standards of data protection
            and privacy.
          </p>

          <p className="mt-4">
            By leveraging the expertise and resources of our third-party hosting
            and server partners, we ensure that your data is always protected
            and secure.
          </p>
        </div>

        <div className="m-8">
          <h1 className="text-xl font-bold text-[#C60D69]">Cancellations</h1>
          <hr className="border-1 border-[#C60D69]" />

          <p className="mt-4">
            You can cancel your subscription to our platform at any time,
            without penalty or obligation.
          </p>

          <p className="mt-4">
            <strong>Notice of Cancellation</strong>: To cancel your
            subscription, simply notify us via email or through our
            platform&apos;s live support channel.
          </p>

          <p>
            <strong>Service Continuity</strong>: Following cancellation, your
            services will remain available until the end of the current billing
            cycle. You will not be charged for the subsequent month.
          </p>

          <p>
            <strong>No Refunds</strong>: Please note that we do not offer
            refunds for partial months or unused services.
          </p>

          <p className="mt-4">
            We appreciate your understanding and hope that you have benefited
            from using our platform.
          </p>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          Copyright 2024 Agentic. All rights reserved. By using our platform,
          you agree to our Terms of Use.
        </footer>
      </div>
    </>
  );
}
