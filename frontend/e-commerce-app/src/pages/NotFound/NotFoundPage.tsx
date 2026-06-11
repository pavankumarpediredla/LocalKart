import { Link } from "react-router-dom";
import BrandMark from "../../components/BrandMark";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f7f8] px-4 py-10 text-slate-900">
      <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <BrandMark />
        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-700">404</p>
          <h1 className="mt-3 text-3xl font-semibold">Page not found</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            The page you opened does not exist or was moved. Return to Localkart and continue shopping.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/dashboard"
            className="bg-teal-600 px-5 py-3 text-sm font-semibold text-white"
          >
            Go to dashboard
          </Link>
          <Link
            to="/login"
            className="border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
