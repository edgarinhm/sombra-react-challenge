import type { Route } from "./+types/home";
import { Wizard } from "../wizard/wizard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Wizard/>;
}
