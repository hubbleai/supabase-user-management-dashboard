import { getUserOnServer } from "@/utils/supabase/user";
import CreateOrg from "@/components/CreateOrg";

export default async function Index() {
  const user = await getUserOnServer();

  if (!user) return <div>Error fething user.</div>;

  return (
    <div className='flex-1 w-full flex flex-col items-center'>
      <div className='animate-in opacity-0 max-w-4xl px-3 w-full'>
        <main className='flex-1 flex flex-col pt-8'>
          <h2 className='text-4xl text-zinc-700 mb-2'>
            Hi <span className=''>{user?.email?.split("@")[0]}</span>{" "}
            <img
              className='size-10 inline'
              src='https://em-content.zobj.net/source/apple/96/victory-hand_270c.png'
              alt='victory-hand'
            />
          </h2>
          <h3 className='text-2xl text-zinc-500'>Welcome Back.</h3>
          <CreateOrg userId={user.id} />
        </main>
      </div>
    </div>
  );
}
