import { getServerSession } from "next-auth";

export async function getServerAuthSession() {
  return getServerSession();
}
