import authOptions from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import emailCapture from '@/assets/email-capture.svg';

export default async function Messages() {
  const session = await getServerSession(authOptions);

  return (
    <section className="flex flex-grow flex-col items-center justify-center bg-grey">
      <h2 className="text-2xl font-semibold">
        Welcome,
        <span className="text-primary"> {session?.user.vendors?.[0].name}</span>
      </h2>
      <p className="mt-1.5 font-medium text-muted">
        Connect With Suppliers Seamlessly On GetBizzUSA
      </p>
      <Image src={emailCapture} alt="email" className="mt-10 h-72 w-auto" />
    </section>
  );
}
