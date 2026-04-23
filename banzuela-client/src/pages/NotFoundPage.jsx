import Button from '../components/Button';
import Logo from '../assets/img/NUBulldogsLogo.png';

const NotFoundPage = () => {
  return (
    <div className="flex w-full flex-col gap-10 bg-[#0f172a] px-4 py-10">

      <section className="border-y-2 border-yellow-400 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <img
  src={Logo}
  alt="BulldogEx Branding"
  className="h-40 w-40 sm:h-48 sm:w-48 object-contain rounded-[1.25rem] border-2 border-[#0f172a] mb-6 transition hover:scale-105"
/>

          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
            Error
          </p>

          <h1 className="text-6xl font-bold leading-tight text-white sm:text-7xl">
            404
          </h1>

          <p className="mt-4 text-lg leading-7 text-zinc-300">
            Page not found. The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="mt-6 flex gap-3">
            <Button to="/"  variant="primary" >Back Home</Button>
            <Button to="/products"  variant="primary">View Products</Button>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-yellow-400 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
            Quick Links
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Explore the site
          </h2>

          <div className="mt-6 space-y-3">
            <div className="rounded-3xl border-2 border-zinc-700 bg-white p-6 text-center">
              <h3 className="font-semibold text-balck">Home</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Return to the homepage
              </p>
              <Button to="/" variant="primary" className="mt-4 w-full">
                Go Home
              </Button>
            </div>

            <div className="rounded-3xl border-2 border-zinc-700 bg-white p-6 text-center">
              <h3 className="font-semibold text-black">Products</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Browse all featured store items
              </p>
              <Button to="/products" variant="primary" className="mt-4 w-full">
                View Products
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default NotFoundPage;