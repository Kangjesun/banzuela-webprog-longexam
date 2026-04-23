import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <section className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_0.95fr]">
        <div className="flex items-center justify-center border-b-2 border-yellow-400/30 bg-blue-950 p-8 sm:p-10 lg:border-b-0 lg:border-r-2 lg:border-yellow-400/30 lg:p-16">
          <div className="flex w-full max-w-md items-center justify-center rounded-4xl border-2 border-dashed border-yellow-400/30 bg-blue-900/20 p-8 sm:p-10">
            <div
              className="relative aspect-square w-full max-w-[18rem] border-8 border-blue-950 rounded-xl bg-cover bg-center"
              style={{
                backgroundImage: "url('/src/assets/img/nubdexchange_logo.png')",
              }}
            />
          </div>
        </div>

        <main className="flex items-center bg-zinc-50 px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default AuthLayout;