import React from "react";
import LoginForm from "./_components/LoginForm";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="card w-96 bg-base-200 shadow-2xl mt-20 mb-20">
        <div className="card-body">
          <div className="items-center mt-2">
            <LoginForm />
            <div className="mt-2 text-center">
              <button className="btn btn-link text-secondary">
                Forgot your password?
              </button>
              <p className="mt-2">
                Don't have an account?{" "}
                <Link href="/register" className="text-accent">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
