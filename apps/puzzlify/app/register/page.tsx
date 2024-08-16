import RegistrationForm from "@/components/RegistrationForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col justify-center items-center m-4">
      <RegistrationForm />
      <p>
        Already have an account? <Link href="/">Login</Link>
      </p>
    </div>
  );
}
