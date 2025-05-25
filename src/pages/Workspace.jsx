import React from "react";
import Tabbar from "../components/layouts/Tabbar";
import { useParams } from "react-router-dom";

export default function Workspace() {

    const { slug } = useParams();

  return (
    <div className="w-full space-y-5">
      <div className="space-y-6 w-full">
        <div className="w-full flex items-center justify-between gap-6">
          <h1 className="text-2xl font-semibold">Bright Team</h1>
        </div>
        <Tabbar slug={slug} />
      </div>
    </div>
  );
}
