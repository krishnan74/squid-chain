"use client";
import { usePrivy, useLogin } from "@privy-io/react-auth";

export default function ConnectButton() {
  const { login, logout, ready, authenticated } = usePrivy(); // Get authentication state

  const { login: loginUser } = useLogin({
    onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod }) => {
      console.log(user.wallet?.address); //debugging purposes
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div className="">
      {!authenticated ? (
        <button
          className="text-[#FF5159] bg-transparent border-[#FF5159] border hover:bg-[#FF5159] hover:text-white px-3"
          onClick={login}
        >
          Login
        </button>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  );
}
