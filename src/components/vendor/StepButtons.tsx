import { Button } from '@/components/ui/button';
import { useStepper } from '@/components/ui/stepper';

export default function StepButtons({
  isLoading = false,
}: {
  isLoading?: boolean;
}) {
  const { prevStep, isDisabledStep } = useStepper();

  return (
    <div className="flex w-full justify-end gap-2">
      <Button
        disabled={isDisabledStep || isLoading}
        onClick={prevStep}
        variant="secondary"
        type="button"
      >
        Prev
      </Button>
      <Button isLoading={isLoading}>Submit</Button>
    </div>
  );
}
