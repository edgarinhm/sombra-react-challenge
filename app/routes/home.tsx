import type { Route } from "./+types/home";
import { Wizard } from "../wizard/wizard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sombra React Challenge" },
    { name: "description", content: "Welcome to Wizard list!" },
  ];
}

export default function Home() {
  return <Wizard/>;
}
