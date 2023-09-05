import { Application } from "@/lib/types";
import { Link, useLoaderData } from "react-router-dom";

export default function Home() {
  const { applications } = useLoaderData() as { applications: Application[] };
  return (
    <>
      <h1>Applications</h1>
      <ul>
        {applications.map((application) => (
          <li className="text-blue-600 hover:underline" key={application.id}>
            <Link to={`/applications/${application.id}`}>
              {application.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

Home.loader = async () => {
  const response = await fetch("http://localhost:3000/api/applications");
  const applications = await response.json();
  return { applications };
};
