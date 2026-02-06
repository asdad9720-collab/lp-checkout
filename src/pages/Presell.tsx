import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { captureUtmFromUrl, saveTrackingParameters, navigateWithTracking } from "@/lib/tracking";

const Presell = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const utmParams = captureUtmFromUrl();
    saveTrackingParameters(utmParams);

    const timer = setTimeout(() => {
      navigateWithTracking(navigate, "/oferta", { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleContinue = () => {
    navigateWithTracking(navigate, "/oferta", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg max-w-md w-full text-center">
        <div className="flex items-center justify-center gap-2 text-primary mb-4">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-semibold">Preparando sua oferta...</span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Aguarde alguns instantes. Estamos redirecionando voc&#234; para a p&#225;gina de oferta.
        </p>
        <button
          onClick={handleContinue}
          className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Presell;
