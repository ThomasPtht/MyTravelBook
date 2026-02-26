import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HomeTabs from "./components/HomeTabs";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function HomeRootPage() {
  let session;
  try {
    session = await getServerSession(authOptions);
    console.error('Session:', session);
  } catch (error) {
    console.error('HomeRootPage error:', error);
    throw error;
  }

  if (!session) {
    redirect("/login");
  }

  return <HomeTabs />;
}