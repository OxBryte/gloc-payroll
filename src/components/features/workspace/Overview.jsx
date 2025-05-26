import React from "react";
import { useParams } from "react-router-dom";
import { useGetSingleWorkspace } from "../../hooks/useWorkspace";

export default function Overview() {
  const { slug } = useParams();

  const { singleWorkspace } = useGetSingleWorkspace(slug);

  return <div>Overview {singleWorkspace?.name}  </div>;
}
