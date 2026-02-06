export const formatCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, "").slice(0, 11); // Limit to 11 digits
  return numbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  return numbers
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);
};

export const formatCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, "");
  return numbers.replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
};

export const validateCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, "");
  if (numbers.length !== 11) return false;
  if (/^(\d)\1+$/.test(numbers)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers[10])) return false;

  return true;
};

export const validatePhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, "");
  return numbers.length >= 10 && numbers.length <= 11;
};

export const validateCEP = (cep: string): boolean => {
  const numbers = cep.replace(/\D/g, "");
  return numbers.length === 8;
};
