export const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return score;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export const strengthColors = [
  "bg-red-500",
  "bg-orange-400",
  "bg-yellow-400",
  "bg-green-400",
  "bg-green-600",
];

export const requirements = [
  {
    label: "8+ characters",
    test: /.{8,}/,
    key: "length",
  },
  {
    label: "Number",
    test: /[0-9]/,
    key: "number",
  },
  {
    label: "Uppercase letter",
    test: /[A-Z]/,
    key: "upper",
  },
  {
    label: "Lowercase letter",
    test: /[a-z]/,
    key: "lower",
  },
];
