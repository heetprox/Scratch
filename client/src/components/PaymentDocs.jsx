import React from 'react';
import Link from 'next/link';
import TextHover from './animation/TextHover';

export const PaymentDocs = () => {
  return (
    <Link
      className={`w-fit text-sm sus capitalize flex flex-col hover`}
      href="/docs/payment-integration"
    >
      <TextHover
        titile1="Integration"
        titile2="Integration"
      />
    </Link>
  );
};