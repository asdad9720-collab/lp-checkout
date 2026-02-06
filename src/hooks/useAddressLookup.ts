import { useState } from "react";

interface AddressData {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const useAddressLookup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupAddress = async (cep: string): Promise<AddressData | null> => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError("CEP não encontrado");
        return null;
      }

      return {
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      };
    } catch {
      setError("Erro ao buscar CEP");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { lookupAddress, loading, error };
};
