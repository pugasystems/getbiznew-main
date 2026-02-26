import { FacebookSvg, GoogleSvg } from '@/assets/icons/Svgs';
import { Button } from '@/components/ui/button';

export default function SignInButtons({ disabled }: { disabled?: boolean }) {
  return (
    <div className="flex gap-4">
      <Button
        type="button"
        variant="outline"
        className="flex-1 gap-2 rounded-full"
        disabled={disabled}
      >
        <GoogleSvg className="h-5 w-5" />
        <span className="text-sm">Google</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex-1 gap-2 rounded-full"
        disabled={disabled}
      >
        <FacebookSvg className="h-5 w-5" />
        <span className="text-sm">Facebook</span>
      </Button>
    </div>
  );
}
