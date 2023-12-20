import PdfRenderer from "@/src/components/PdfRenderer";
import { db } from "@/src/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: {
    id: string;
  };
}

async function Page({ params }: PageProps) {
  // retrieve the file id
  const { id } = params;

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Ensure that the user is logged in
  if (!user || !user.id) redirect(`auth-callback?origin=dashboard/${id}`);

  // make the api call
  const file = await db.file.findFirst({
    where: {
      id: id,
      userId: user.id,
    },
  });

  // handle file not found error
  if (!file) notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[100vh-3rem]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* left side */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRenderer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
