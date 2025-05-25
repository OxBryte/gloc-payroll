import React from "react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <div className="p-4 h-screen flex flex-col gap-6 md:flex-row items-center justify-center">
      <div className="w-[26rem] h-[38rem] overflow-hidden rounded-xl">
        <img src="login-bg.jpg" alt="" className="w-full h-full" />
      </div>
      <div className="w-[26rem] h-[38rem] overflow-hidden rounded-xl bg-c-bg p-10 flex flex-col items-center gap-10">
        <div className="space-y-1 place-items-center">
          <p className="font-bold text-3xl text-white">Welcome back!</p>
          <p className="font-light text-sm">Log in to your Account</p>
        </div>
        <div className="space-y-7 w-full">
          <div className="flex gap-4 items-center justify-center border border-c-border px-5 w-full py-3 rounded-md hover:bg-white/5 cursor-pointer">
            <FcGoogle className="text-2xl" />
            <p className="font-light text-sm text-white">Signin with Google</p>
          </div>
          <div className="flex w-full items-center gap-3">
            <div className="h-[1px] w-full bg-white/20"></div>
            <p className="text-sm text-white">or</p>
            <div className="h-[1px] w-full bg-white/20"></div>
          </div>
          <form className="flex flex-col gap-4 w-full">
            <input
              type="email"
              placeholder="Email"
              className="p-3 rounded-md text-white bg-white/10 focus:outline-none focus:border-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="p-3 rounded-md text-white bg-white/10 focus:outline-none focus:border-none"
            />
            <button className="bg-c-color px-5 py-3 rounded-md text-white font-bold hover:bg-c-bg-2 cursor-pointer">
              Log in
            </button>
            <p className="text-sm font-light text-right">Forgot password? </p>
          </form>
          <div className="text-center w-full">
            <p className="text-sm font-light text-white">
              Don't have an account?{" "}
              <span className="text-c-color font-bold cursor-pointer">
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
