import { getUserOnServer } from "@/utils/supabase/user";
import { getOrgsForUser } from "@/utils/supabase/orgs";

export default async function Index() {
  const user = await getUserOnServer();

  if (!user) return <div>Error fething user.</div>;

  const orgs = await getOrgsForUser(user.id);

  return (
    <div className='flex-1 w-full flex flex-col gap-20 items-center'>
      <div className='animate-in opacity-0 max-w-4xl px-3 border-dashed border w-full'>
        <main className='flex-1 flex flex-col gap-6 pt-8'>
          <h2 className='text-4xl mb-4 text-zinc-700'>
            Hi <span className=''>{user?.email?.split("@")[0]}</span>{" "}
            <img
              className='size-10 inline'
              src='https://em-content.zobj.net/source/apple/96/victory-hand_270c.png'
              alt='victory-hand'
            />
          </h2>
          <h3 className='text-2xl text-zinc-500'>Let's create</h3>
          {orgs.map((orgs) => {
            return <div key={orgs.org_id}>{orgs.org_name}</div>;
          })}
        </main>
      </div>
    </div>
  );
}
