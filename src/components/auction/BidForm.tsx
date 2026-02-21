import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";

interface BidFormProps {
  currentBid: number;
  startingPrice: number;
  isAuthenticated: boolean;
  isOwner: boolean;
  isExpired: boolean;
  onPlaceBid: (amount: number) => Promise<void>;
  onWithdraw: () => Promise<void>;
}

export default function BidForm({
  currentBid,
  startingPrice,
  isAuthenticated,
  isOwner,
  isExpired,
  onPlaceBid,
  onWithdraw,
}: BidFormProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minBid = currentBid > 0 ? currentBid + 1 : startingPrice;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("it-IT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleSubmit = async () => {
    const amount = parseFloat(bidAmount);

    if (isNaN(amount)) {
      setError("Inserisci un importo valido");
      return;
    }

    if (amount < minBid) {
      setError(`L'offerta minima è €${formatCurrency(minBid)}`);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onPlaceBid(amount);
      setBidAmount("");
    } catch (err: any) {
      setError(err.message || "Errore durante l'invio dell'offerta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    setIsSubmitting(true);
    try {
      await onWithdraw();
    } catch (err: any) {
      setError(err.message || "Errore durante il ritiro dell'asta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fai un'offerta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info prezzi */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Base d'asta</span>
            <span className="font-semibold">
              €{formatCurrency(startingPrice)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Offerta attuale</span>
            <span className="text-2xl font-bold text-primary">
              €{formatCurrency(currentBid > 0 ? currentBid : startingPrice)}
            </span>
          </div>
        </div>

        {/* Azioni */}
        {!isExpired && (
          <>
            {isOwner ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Ritira asta
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Conferma ritiro asta</DialogTitle>
                    <DialogDescription>
                      Sei sicuro di voler ritirare questa asta? L'asta non sarà
                      più visibile agli altri utenti e tutte le offerte saranno
                      annullate.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Annulla</Button>
                    <Button
                      variant="destructive"
                      onClick={handleWithdraw}
                      disabled={isSubmitting}>
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Conferma ritiro
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder={`Min. €${formatCurrency(minBid)}`}
                    value={bidAmount}
                    onChange={(e) => {
                      setBidAmount(e.target.value);
                      setError(null);
                    }}
                    min={minBid}
                    step="0.01"
                    disabled={isSubmitting}
                  />
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Offri"
                    )}
                  </Button>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <p className="text-xs text-gray-500">
                  L'offerta minima è €{formatCurrency(minBid)}
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">
                  Accedi per fare un'offerta
                </p>
                <Link to="/login">
                  <Button className="w-full">Accedi</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
