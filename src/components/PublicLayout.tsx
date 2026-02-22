import { Outlet } from "react-router-dom";
import Header from "./view/Header";

/**
 * Layout pubblico con header per le pagine accessibili senza autenticazione.
 * L'header gestisce internamente la visualizzazione differente per utenti loggati e non.
 */
export default function PublicLayout() {
  return <Header />;
}
