import Button from '../../components/Button';
import banner from '../../assets/img/nu_bulldogex_banner.jpg';

const HomePage = () => {
    return (
        <div className="flex w-full flex-col gap-6">
            <section className="relative min-h-[28rem] overflow-hidden border-y-2 border-yellow-400 bg-zinc-900 px-4 py-10 sm:px-6 lg:px-8">
                <img
                    src={banner}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-zinc-900/55" />

                <div className="relative z-10 flex min-h-[22rem] items-start justify-end text-right sm:min-h-[24rem]">
                    <div className="max-w-xl">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-200">
                            Campus Marketplace
                        </p>

                        <h1 className="text-3xl font-bold leading-tight text-yellow-400 sm:text-4xl">
                            Welcome to BulldogEx Shop
                        </h1>

                        <p className="mt-4 text-sm leading-7 text-zinc-100 sm:text-base">
                            Explore campus uniforms, student essentials, and school merch in one quick storefront.
                        </p>

                        <div className="mt-6 flex flex-wrap justify-end gap-3">
                            <Button to="/products">
                                Shop Now
                            </Button>
                            <Button to="/about" variant="primary">
                                About Store
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
                <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
                        Store Overview
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                        Quick shopping blocks
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-3xl border-2 border-yellow-400 bg-white p-5">
                        <p className="text-2xl font-bold text-zinc-900">08</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                            Products
                        </p>
                    </div>

                    <div className="rounded-3xl border-2 border-yellow-400 bg-white p-5">
                        <p className="text-2xl font-bold text-zinc-900">06</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                            Categories
                        </p>
                    </div>

                    <div className="rounded-3xl border-2 border-yellow-400 bg-white p-5">
                        <p className="text-2xl font-bold text-zinc-900">24</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                            Orders
                        </p>
                    </div>

                    <div className="rounded-3xl border-2 border-yellow-400 bg-white p-5">
                        <p className="text-2xl font-bold text-zinc-900">03</p>
                        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                            Pickup Slots
                        </p>
                    </div>

                </div>
            </section>

            {/* PRODUCTS */}
            <section className="border-y-2 border-yellow-400 bg-blue-950/95 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

                <div className="mb-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-400">
                        Shop Sections
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                        Simple store cards
                    </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">

                    <article className="rounded-3xl border-2 border-yellow-400 bg-white p-4">
                        <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-zinc-100">
                            <img src="/src/assets/img/nu_lanyard.png" alt="" className="h-flex w-flex object-cover rounded-xl" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900">Daily Essentials</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                            Bags, tumblers, lanyards, and items used every school day.
                        </p>
                        <Button to="/products" className="mt-4" variant="primary">
                            View Products
                        </Button>
                    </article>

                    <article className="rounded-3xl border-2 border-yellow-400 bg-white p-4">
                        <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-zinc-100">
                            <img src="/src/assets/img/nu_volleyball_sticker.png" alt="" className="h-flex w-flex object-cover rounded-xl" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900">Study Supplies</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                            Notes, desk tools, and study kits for class and review weeks.
                        </p>
                        <Button to="/products" className="mt-4" variant="primary">
                            Shop Supplies
                        </Button>
                    </article>

                    <article className="rounded-3xl border-2 border-yellow-400 bg-white p-4">
                        <div className="flex aspect-4/3 items-center justify-center rounded-[1.25rem] bg-zinc-100">
                            <img src="/src/assets/img/nu_lady_bulldogs_tshirt.png" alt="" className="h-flex w-flex object-cover rounded-xl" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-zinc-900">Campus Apparel</h3>
                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                            Comfortable pieces for class days, commute days, and weekends.
                        </p>
                        <Button to="/products" className="mt-4" variant="primary">
                            View Apparel
                        </Button>
                    </article>

                </div>
            </section>

        </div>
    );
};

export default HomePage;