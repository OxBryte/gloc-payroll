import React from "react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <div className="w-full h-full space-y-6 p-20">
      <div className="space-y-1 place-items-center">
        <p className="font-bold text-3xl ">Welcome back!</p>
        <p className="font-light text-sm">Log in to your Account</p>
      </div>
      <div className="space-y-7 w-full">
        <div className="flex gap-4 items-center justify-center border border-c-border px-5 w-full py-3 rounded-md hover:bg-white/5 cursor-pointer">
          <FcGoogle className="text-2xl" />
          <p className="font-light text-sm ">Signin with Google</p>
        </div>
        <div className="flex w-full items-center gap-3">
          <div className="h-[1px] w-full bg-white/20"></div>
          <p className="text-sm ">or</p>
          <div className="h-[1px] w-full bg-white/20"></div>
        </div>
        <form className="flex flex-col gap-4 w-full">
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded-md  bg-black/10 focus:outline-none focus:border-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 rounded-md  bg-black/10 focus:outline-none focus:border-none"
          />
          <button className="bg-c-color px-5 py-3 rounded-md  font-bold hover:bg-c-bg-2 cursor-pointer">
            Log in
          </button>
          <p className="text-sm font-light text-right">Forgot password? </p>
        </form>
        <div className="text-center w-full">
          <p className="text-sm font-light ">
            Don't have an account?{" "}
            <span className="text-c-color font-bold cursor-pointer">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
