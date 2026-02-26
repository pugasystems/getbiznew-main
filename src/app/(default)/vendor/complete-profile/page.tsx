'use client';

import { LocationSvg } from '@/assets/icons/Svgs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Step, Stepper, type StepItem } from '@/components/ui/stepper';
import AddressDetails from '@/components/vendor/AddressDetails';
import BusinessDetails from '@/components/vendor/BusinessDetails';
import { BackpackIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

const steps = [
  { label: 'Address Details', icon: LocationSvg },
  { label: 'Business Details', icon: BackpackIcon },
] satisfies StepItem[];

export default function CompleteProfile() {
  const [addressId, setAddressId] = useState<number | null>(null);

  return (
    <Card className="my-8">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Complete your profile</CardTitle>
        <CardDescription className="text-[15px] font-medium">
          Fill in your business and address details to complete your profile
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Stepper
          size="lg"
          initialStep={0}
          steps={steps}
          orientation="vertical"
          styles={{ 'step-label': 'font-semibold text-base' }}
        >
          {steps.map((stepProps, i) => (
            <Step key={i} {...stepProps}>
              {i === 0 ? (
                <AddressDetails setAddressId={setAddressId} />
              ) : (
                <BusinessDetails addressId={addressId} />
              )}
            </Step>
          ))}
        </Stepper>
      </CardContent>
    </Card>
  );
}
