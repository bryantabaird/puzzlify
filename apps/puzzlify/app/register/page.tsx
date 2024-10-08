import React from "react";
import RegistrationForm from "./_components/RegistrationForm";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="card w-96 bg-base-200 shadow-2xl mt-20 mb-20">
        <div className="card-body">
          <div className="items-center mt-2">
            <RegistrationForm />
            <div className="mt-2 text-center">
              <p className="mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-accent">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
