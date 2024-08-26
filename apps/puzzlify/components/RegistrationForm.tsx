"use client";

import { userSchema } from "@/app/schemas/user";
import { createUser } from "@/app/actions/user/create-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";

const RegistrationForm = () => {
  const { form, handleSubmitWithAction } = useHookFormAction(
    createUser,
    zodResolver(userSchema),
    { formProps: { defaultValues: { email: "", password: "" } } },
  );

  return (
    <>
      <form
        onSubmit={handleSubmitWithAction}
        className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
      >
        <div className="my-2">
          <label htmlFor="email">Email Address</label>
          <input
            className="border mx-2 border-gray-500 rounded"
            type="email"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p>{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="my-2">
          <label htmlFor="password">Password</label>
          <input
            className="border mx-2 border-gray-500 rounded"
            type="password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p>{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
        >
          Register
        </button>
      </form>
    </>
  );
};

export default RegistrationForm;
