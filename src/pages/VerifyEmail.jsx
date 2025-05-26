
import React from "react";
import { Link } from "react-router-dom";

export default function VerifyEmail() {
  return (
    <>
      <div className="w-full max-w-[36rem] space-y-6 p-20">
        <div className="space-y-2 place-items-center">
          <div className="">
            <p>Logo</p>
          </div>
          <p className="font-semibold text-2xl ">Verify your email</p>
          <p className="font-light text-sm">
            We sent a code to your email address.
          </p>
        </div>
        <div className="space-y-7 w-full">
          <form className="flex flex-col gap-4 w-full">
            <div className="space-y-2 w-full">
              <p className="text-sm">Username*</p>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="p-3 w-full rounded-md border border-black/10 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className={`px-5 py-3 rounded-md text-white cursor-pointer transition-colors bg-c-color hover:bg-c-bg`}
              //   disabled={errors.username || errors.password}
            >
              Continue
            </button>
          </form>

          <div className="text-center w-full">
            <p className="text-sm font-light ">
              Don't have an account?{" "}
              <Link to="/signup">
                <span className="text-c-color font-bold cursor-pointer">
                  SignUp
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
