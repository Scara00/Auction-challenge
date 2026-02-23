import { Link } from "react-router-dom";
import { Gavel, ArrowRight } from "lucide-react";

export default function AuthSidebar() {
  return (
    <>
      {/* Versione Mobile - sotto al form */}
      <div className="lg:hidden bg-gray-50 py-8 px-6 text-center border-t">
        <div className="max-w-sm mx-auto">
          <h2 className="text-gray-800 text-lg font-semibold mb-2">
            Non hai ancora un account?
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Puoi esplorare tutte le aste attive e scoprire le offerte più
            interessanti senza registrarti.
          </p>
          <Link
            to="/home"
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 rounded-full text-white font-medium transition-all duration-300">
            <span className="text-white">Esplora le aste</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Versione Desktop - sidebar */}
      <div className="hidden lg:flex bg-black flex-col gap-4 items-center justify-center px-8">
        <Gavel className="h-12 w-12" color="white" />
        <img
          src="/LOGO_ICB_BIANCO_ORIZZONTALE.png"
          alt="ICB Auctions"
          className="h-30 w-auto mb-4"
        />

        {/* Descrizione e CTA per navigare senza account */}
        <div className="max-w-sm text-center mt-4">
          <h2 className="text-white text-xl font-semibold mb-3">
            Non hai ancora un account?
          </h2>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Nessun problema! Puoi esplorare tutte le aste attive, vedere i
            dettagli dei prodotti e scoprire le offerte più interessanti. Crea
            un account solo quando vorrai partecipare alle aste o aggiungere
            articoli ai preferiti.
          </p>
          <Link
            to="/home"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-100 rounded-full text-gray-900 font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
            <span>Esplora le aste</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </>
  );
}
