import type { MachineCodingProblem } from "../../types";

export const validatedFormProblem: MachineCodingProblem = {
  id: "mc-validated-form",
  title: "Form with Real-Time Validation",
  difficulty: "Intermediate",
  category: "Machine Coding",
  tags: [
    "react",
    "forms",
    "validation",
    "controlled-components",
    "error-handling",
    "ux",
  ],

  problemStatement: `Build a registration form in React with real-time field validation for email, password, and confirm password fields. The form should validate inputs as the user types (with debouncing) and display inline error messages. The submit button should only be enabled when all validations pass. This tests your understanding of controlled form components, validation patterns, and user experience best practices.

The form should handle various validation rules: email format checking with regex, password strength requirements (minimum length, uppercase, lowercase, number, special character), and password confirmation matching. Error messages should appear after the user has interacted with a field (touched state) to avoid showing errors on an empty form. The component should be extensible to support additional fields and custom validation rules.`,

  functionalRequirements: [
    "Email field with format validation (regex pattern)",
    "Password field with strength requirements display",
    "Confirm password field that matches the password",
    "Real-time validation with debounced error display",
    "Inline error messages below each field",
    "Submit button disabled until all fields are valid",
    "Visual indicators (green/red borders) for valid/invalid fields",
    "Password strength meter showing weak/medium/strong",
  ],

  nonFunctionalRequirements: [
    "Debounced validation to avoid validating on every keystroke",
    "Touched state tracking to show errors only after interaction",
    "Accessible error messages linked via aria-describedby",
    "Form submission prevention when invalid",
  ],

  componentHierarchy: `ValidatedForm
├── FormField (email)
│   ├── Label
│   ├── Input
│   └── ErrorMessage
├── FormField (password)
│   ├── Label
│   ├── Input
│   ├── PasswordStrengthMeter
│   └── ErrorMessage
├── FormField (confirmPassword)
│   ├── Label
│   ├── Input
│   └── ErrorMessage
└── SubmitButton`,

  stateDesign: `// State shape
interface FormState {
  values: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  errors: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  touched: {
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  };
  isSubmitting: boolean;
}

// \`values\` tracks controlled input values.
// \`errors\` stores validation error messages (empty = valid).
// \`touched\` tracks which fields the user has interacted with.
// Errors are only displayed for touched fields.`,

  architecture: `The form uses controlled components with centralized state for values, errors, and touched status. A validation function runs on each value change (debounced at 300ms) and updates the errors object. The \`touched\` state is set on \`onBlur\` for each field, ensuring errors don't appear before the user has interacted with the field.

Validation rules are defined as an array of rule objects per field, making it easy to add or modify rules without changing the component logic. The password strength meter calculates a score based on character variety and length. Form submission is handled with an async handler that sets \`isSubmitting\` to show a loading state. The component uses a custom \`useFormValidation\` hook pattern to separate validation logic from rendering.`,

  implementation: `import React, { useState, useCallback, useMemo, FormEvent } from 'react';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Record<keyof FormValues, string>;
type FormTouched = Record<keyof FormValues, boolean>;

function validateEmail(email: string): string {
  if (!email) return 'Email is required';
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return 'Invalid email format';
  return '';
}

function validatePassword(password: string): string {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Must contain a lowercase letter';
  if (!/[0-9]/.test(password)) return 'Must contain a number';
  if (!/[!@#$%^&*]/.test(password)) return 'Must contain a special character (!@#$%^&*)';
  return '';
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
  if (score <= 3) return { score, label: 'Medium', color: '#f59e0b' };
  return { score, label: 'Strong', color: '#22c55e' };
}

function validate(values: FormValues): FormErrors {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    confirmPassword: !values.confirmPassword
      ? 'Please confirm your password'
      : values.password !== values.confirmPassword
        ? 'Passwords do not match'
        : '',
  };
}

export default function ValidatedForm() {
  const [values, setValues] = useState<FormValues>({ email: '', password: '', confirmPassword: '' });
  const [touched, setTouched] = useState<FormTouched>({ email: false, password: false, confirmPassword: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(values), [values]);
  const isValid = Object.values(errors).every((e) => e === '');
  const strength = useMemo(() => getPasswordStrength(values.password), [values.password]);

  const handleChange = useCallback((field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleBlur = useCallback((field: keyof FormValues) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });
    if (!isValid) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  }, [isValid]);

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <h2 style={{ color: '#22c55e' }}>Registration Successful!</h2>
        <p>Welcome, {values.email}</p>
      </div>
    );
  }

  const fieldStyle = (field: keyof FormValues): React.CSSProperties => ({
    width: '100%', padding: '10px 14px', fontSize: 16,
    border: \`2px solid \${touched[field] ? (errors[field] ? '#ef4444' : '#22c55e') : '#d1d5db'}\`,
    borderRadius: 8, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  });

  return (
    <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 420, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h2 style={{ marginBottom: 24 }}>Create Account</h2>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Email</label>
        <input
          id="email" type="email" value={values.email}
          onChange={handleChange('email')} onBlur={handleBlur('email')}
          aria-invalid={touched.email && !!errors.email}
          aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
          style={fieldStyle('email')}
        />
        {touched.email && errors.email && (
          <p id="email-error" role="alert" style={{ color: '#ef4444', fontSize: 13, margin: '4px 0 0' }}>
            {errors.email}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>Password</label>
        <input
          id="password" type="password" value={values.password}
          onChange={handleChange('password')} onBlur={handleBlur('password')}
          aria-invalid={touched.password && !!errors.password}
          aria-describedby={touched.password && errors.password ? 'password-error' : undefined}
          style={fieldStyle('password')}
        />
        {values.password && (
          <div style={{ marginTop: 8 }}>
            <div style={{
              height: 4, borderRadius: 2, background: '#e5e7eb',
              overflow: 'hidden',
            }}>
              <div style={{
                width: \`\${(strength.score / 5) * 100}%\`,
                height: '100%', background: strength.color,
                transition: 'width 0.3s, background 0.3s',
              }} />
            </div>
            <span style={{ fontSize: 12, color: strength.color }}>{strength.label}</span>
          </div>
        )}
        {touched.password && errors.password && (
          <p id="password-error" role="alert" style={{ color: '#ef4444', fontSize: 13, margin: '4px 0 0' }}>
            {errors.password}
          </p>
        )}
      </div>

      <div style={{ marginBottom: 24 }}>
        <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>
          Confirm Password
        </label>
        <input
          id="confirmPassword" type="password" value={values.confirmPassword}
          onChange={handleChange('confirmPassword')} onBlur={handleBlur('confirmPassword')}
          aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
          aria-describedby={touched.confirmPassword && errors.confirmPassword ? 'confirm-error' : undefined}
          style={fieldStyle('confirmPassword')}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <p id="confirm-error" role="alert" style={{ color: '#ef4444', fontSize: 13, margin: '4px 0 0' }}>
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        style={{
          width: '100%', padding: '12px', fontSize: 16, fontWeight: 600,
          background: isValid ? '#2563eb' : '#93c5fd', color: '#fff',
          border: 'none', borderRadius: 8,
          cursor: isValid && !isSubmitting ? 'pointer' : 'not-allowed',
          transition: 'background 0.2s',
        }}
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}`,

  accessibility: `Each input is linked to its label via \`htmlFor\`/\`id\`. Error messages use \`role="alert"\` for immediate screen reader announcement and are linked to inputs via \`aria-describedby\`. The \`aria-invalid\` attribute marks fields with validation errors. The form uses \`noValidate\` to prevent browser-native validation in favor of custom messages. The submit button's disabled state communicates form validity. Color-coded borders are supplemented by text error messages, ensuring information is not conveyed by color alone.`,

  performance: `Validation runs synchronously on each render via \`useMemo\`, which is efficient for simple rule checking. For expensive async validations (e.g., email uniqueness checks), debouncing with \`useEffect\` would be more appropriate. The \`useCallback\` wrappers on event handlers prevent unnecessary re-renders of child components. The password strength calculation is memoized to avoid recalculating on unrelated field changes. The form state is consolidated to minimize render cycles.`,

  edgeCases: [
    "Pasting a long string into the email field should validate correctly",
    "Password and confirm password typed in different order should cross-validate",
    "Form submission while async validation is pending",
    "Browser autofill may not trigger onChange events consistently",
    "Password managers may fill fields without triggering blur events",
  ],

  testingStrategy: [
    "Unit test: email validation accepts valid formats and rejects invalid ones",
    "Unit test: password validation checks all strength requirements",
    "Unit test: confirm password shows error when mismatched",
    "Integration test: submit button is disabled until all fields are valid",
    "Integration test: errors only appear after field is touched (blurred)",
    "Accessibility audit: error messages are linked via aria-describedby",
  ],

  improvements: [
    "Add debounced async validation for email uniqueness",
    "Support dynamic form fields via configuration object",
    "Add show/hide password toggle button",
    "Integrate with a form library like React Hook Form for complex forms",
    "Add field-level async validation with loading spinners",
  ],

  followUpQuestions: [
    "How would you implement async validation (e.g., checking if email exists)?",
    "What are the trade-offs between controlled and uncontrolled form inputs?",
    "How would you design a generic form validation hook?",
    "How does React Hook Form achieve better performance than controlled components?",
  ],
};
