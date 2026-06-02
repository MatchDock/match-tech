import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

import { isAppError, getUserErrorMessage } from "@/shared/lib/AppError";

export function ErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : isAppError(error)
      ? getUserErrorMessage(error.code)
      : "Algo deu errado. Tente novamente.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-neo-bg">
      <div className="border-[4px] border-neo-black bg-white shadow-[8px_8px_0_0_#000] p-10 max-w-md w-full">
        <div className="bg-neo-pink text-white border-[3px] border-neo-black px-3 py-1 font-heading font-black uppercase text-xs inline-block mb-6 shadow-[3px_3px_0_0_#000]">
          ERRO DE SISTEMA ⚠️
        </div>
        <h1 className="font-heading font-black text-4xl uppercase tracking-tighter text-neo-black mb-4">
          Oops!
        </h1>
        <p className="font-bold text-sm text-neo-black/70 mb-8">{message}</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-neo-lime text-neo-black font-heading font-bold uppercase border-[3px] border-neo-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#000] active:translate-y-[1px] active:shadow-none transition-all"
        >
          VOLTAR AO INÍCIO
        </Link>
      </div>
    </div>
  );
}
