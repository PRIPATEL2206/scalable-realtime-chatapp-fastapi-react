import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      Home
      <Link to={"login"}>Login</Link>
    </div>
  )
}
