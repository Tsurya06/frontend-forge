import type { MachineCodingProblem } from "../../types";

export const accessibleFormProblem: MachineCodingProblem = {
  id: "mc-accessible-form",
  title: "Fully Accessible Form",
  difficulty: "Intermediate",
  category: "Machine Coding",
  tags: [
    "form",
    "accessibility",
    "aria",
    "validation",
    "focus-management",
    "semantic-html",
    "error-announcements",
  ],
  problemStatement: `Build a fully accessible registration form in React that demonstrates best practices for form accessibility. The form should include text inputs, a select dropdown, radio buttons, checkboxes, and a submit button. Every field must have proper label associations, validation with inline error messages, and ARIA attributes for error states.

The form should validate on submission, show inline error messages next to invalid fields, move focus to the first error field, and announce errors to screen readers via aria-live regions. Required fields should be marked both visually and with aria-required. The form should work entirely via keyboard, with logical tab order and visible focus indicators.

This problem tests understanding of semantic HTML, ARIA authoring practices, focus management, form validation patterns, and building truly inclusive user interfaces.`,
  functionalRequirements: [
    "Form fields: name (text), email (email), password (password with requirements), role (select), experience level (radio group), agree to terms (checkbox)",
    "All fields have associated <label> elements or aria-label",
    'Required fields show visual indicator (*) and have aria-required="true"',
    "Client-side validation on submit with inline error messages below each invalid field",
    "Errors linked to fields via aria-describedby pointing to the error message element",
    "Focus moves to the first invalid field on submit",
    "Error summary announced via aria-live region at the top of the form",
    "Success state shown after valid submission",
    "Keyboard-only operation: Tab through fields, Space/Enter to submit, Space for checkboxes/radios",
  ],
  nonFunctionalRequirements: [
    "Semantic HTML: use <form>, <fieldset>, <legend> for grouping related fields",
    "Visible focus indicators on all interactive elements",
    'Error messages use role="alert" or are in an aria-live region',
    "Responsive layout with single-column form on mobile",
    "Color is not the only indicator of errors — include text and icons",
  ],
  componentHierarchy: `AccessibleForm
├── ErrorSummary (aria-live region, shown on submit with errors)
├── FormField (reusable wrapper)
│   ├── Label (with required indicator)
│   ├── Input / Select / RadioGroup / Checkbox
│   └── ErrorMessage (linked via aria-describedby)
├── FieldGroup (fieldset + legend for radio buttons)
├── SubmitButton
└── SuccessMessage`,
  stateDesign: `interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  experience: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  experience?: string;
  agreeToTerms?: string;
}

const [formData, setFormData] = useState<FormData>({
  name: '', email: '', password: '', role: '', experience: '', agreeToTerms: false,
});
const [errors, setErrors] = useState<FormErrors>({});
const [submitted, setSubmitted] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const fieldRefs = useRef<Record<string, HTMLElement | null>>({});`,
  architecture: `The form uses semantic HTML elements throughout: <form> with onSubmit, <fieldset>/<legend> for the radio group, <label> elements associated via htmlFor. A reusable FormField wrapper renders the label, input, and error message, connecting them with id/htmlFor/aria-describedby attributes.

On submit, a validate function checks all fields and returns a FormErrors object. If errors exist, an error summary is rendered in an aria-live="assertive" region at the top, focus is moved to the first invalid field, and inline error messages appear. The error messages are connected to their fields via aria-describedby so screen readers announce "field name, error message" when the field receives focus. aria-invalid is set on errored fields.`,
  implementation: `import React, { useState, useRef, useCallback } from 'react';

interface FormData {
  name: string;
  email: string;
  password: string;
  role: string;
  experience: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  experience?: string;
  agreeToTerms?: string;
}

type FieldName = keyof FormData;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) errors.name = 'Name is required.';
  else if (data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';

  if (!data.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email)) errors.email = 'Enter a valid email address.';

  if (!data.password) errors.password = 'Password is required.';
  else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  else if (!/[A-Z]/.test(data.password)) errors.password = 'Password must include an uppercase letter.';
  else if (!/[0-9]/.test(data.password)) errors.password = 'Password must include a number.';

  if (!data.role) errors.role = 'Please select a role.';
  if (!data.experience) errors.experience = 'Please select your experience level.';
  if (!data.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms.';

  return errors;
}

const FIELD_ORDER: FieldName[] = ['name', 'email', 'password', 'role', 'experience', 'agreeToTerms'];

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', fontSize: 14,
  border: '2px solid #e2e8f0', borderRadius: 6, outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.15s',
};

const errorFieldStyle: React.CSSProperties = { ...fieldStyle, borderColor: '#ef4444' };
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 4, fontSize: 14, fontWeight: 500 };
const errorMsgStyle: React.CSSProperties = { color: '#ef4444', fontSize: 13, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 };

export default function AccessibleForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', password: '', role: '', experience: '', agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const updateField = useCallback(<K extends FieldName>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (submitted) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [submitted]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    const errorFields = FIELD_ORDER.filter((f) => validationErrors[f]);
    if (errorFields.length > 0) {
      const firstErrorField = fieldRefs.current[errorFields[0]];
      firstErrorField?.focus();
      return;
    }

    setIsSuccess(true);
  }, [formData]);

  const errorList = FIELD_ORDER.filter((f) => errors[f]);

  if (isSuccess) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
        <h2 style={{ color: '#16a34a', margin: '0 0 8px' }}>Registration Successful!</h2>
        <p style={{ color: '#64748b' }}>Welcome, {formData.name}. Your account has been created.</p>
        <button
          onClick={() => {
            setFormData({ name: '', email: '', password: '', role: '', experience: '', agreeToTerms: false });
            setErrors({});
            setSubmitted(false);
            setIsSuccess(false);
          }}
          style={{ marginTop: 16, padding: '8px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Register Another
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 16 }}>
      <h2 style={{ margin: '0 0 16px' }}>Create Account</h2>

      {submitted && errorList.length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: 8, marginBottom: 16,
          }}
        >
          <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#dc2626', fontSize: 14 }}>
            Please fix {errorList.length} error{errorList.length > 1 ? 's' : ''} below:
          </p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {errorList.map((field) => (
              <li key={field} style={{ color: '#dc2626', fontSize: 13 }}>
                <a
                  href={\`#field-\${field}\`}
                  onClick={(e) => { e.preventDefault(); fieldRefs.current[field]?.focus(); }}
                  style={{ color: '#dc2626', textDecoration: 'underline' }}
                >
                  {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="field-name" style={labelStyle}>
            Full Name <span aria-hidden="true" style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="field-name"
            ref={(el) => { fieldRefs.current.name = el; }}
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'error-name' : undefined}
            style={errors.name ? errorFieldStyle : fieldStyle}
          />
          {errors.name && (
            <div id="error-name" style={errorMsgStyle}>
              <span aria-hidden="true">⚠</span> {errors.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="field-email" style={labelStyle}>
            Email <span aria-hidden="true" style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="field-email"
            ref={(el) => { fieldRefs.current.email = el; }}
            type="email"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'error-email' : undefined}
            style={errors.email ? errorFieldStyle : fieldStyle}
            autoComplete="email"
          />
          {errors.email && (
            <div id="error-email" style={errorMsgStyle}>
              <span aria-hidden="true">⚠</span> {errors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="field-password" style={labelStyle}>
            Password <span aria-hidden="true" style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="field-password"
            ref={(el) => { fieldRefs.current.password = el; }}
            type="password"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.password}
            aria-describedby={\`password-hint\${errors.password ? ' error-password' : ''}\`}
            style={errors.password ? errorFieldStyle : fieldStyle}
            autoComplete="new-password"
          />
          <div id="password-hint" style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            At least 8 characters, one uppercase letter, one number.
          </div>
          {errors.password && (
            <div id="error-password" style={errorMsgStyle}>
              <span aria-hidden="true">⚠</span> {errors.password}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="field-role" style={labelStyle}>
            Role <span aria-hidden="true" style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            id="field-role"
            ref={(el) => { fieldRefs.current.role = el; }}
            value={formData.role}
            onChange={(e) => updateField('role', e.target.value)}
            aria-required="true"
            aria-invalid={!!errors.role}
            aria-describedby={errors.role ? 'error-role' : undefined}
            style={errors.role ? errorFieldStyle : fieldStyle}
          >
            <option value="">Select a role…</option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Product Manager</option>
            <option value="qa">QA Engineer</option>
          </select>
          {errors.role && (
            <div id="error-role" style={errorMsgStyle}>
              <span aria-hidden="true">⚠</span> {errors.role}
            </div>
          )}
        </div>

        <fieldset style={{ border: '1px solid #e2e8f0', borderRadius: 6, padding: '12px 16px', marginBottom: 16 }}>
          <legend style={{ fontWeight: 500, fontSize: 14, padding: '0 4px' }}>
            Experience Level <span aria-hidden="true" style={{ color: '#ef4444' }}>*</span>
          </legend>
          {['junior', 'mid', 'senior', 'lead'].map((level) => (
            <label key={level} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', cursor: 'pointer' }}>
              <input
                type="radio"
                name="experience"
                value={level}
                checked={formData.experience === level}
                onChange={(e) => updateField('experience', e.target.value)}
                ref={level === 'junior' ? (el) => { fieldRefs.current.experience = el; } : undefined}
                aria-describedby={errors.experience ? 'error-experience' : undefined}
                style={{ width: 16, height: 16 }}
              />
              <span style={{ fontSize: 14, textTransform: 'capitalize' }}>{level}</span>
            </label>
          ))}
          {errors.experience && (
            <div id="error-experience" style={errorMsgStyle}>
              <span aria-hidden="true">⚠</span> {errors.experience}
            </div>
          )}
        </fieldset>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => updateField('agreeToTerms', e.target.checked)}
              ref={(el) => { fieldRefs.current.agreeToTerms = el; }}
              aria-required="true"
              aria-invalid={!!errors.agreeToTerms}
              aria-describedby={errors.agreeToTerms ? 'error-terms' : undefined}
              style={{ width: 16, height: 16, marginTop: 2 }}
            />
            <span style={{ fontSize: 14 }}>
              I agree to the <a href="#terms" style={{ color: '#3b82f6' }}>Terms of Service</a> and{' '}
              <a href="#privacy" style={{ color: '#3b82f6' }}>Privacy Policy</a>{' '}
              <span aria-hidden="true" style={{ color: '#ef4444' }}>*</span>
            </span>
          </label>
          {errors.agreeToTerms && (
            <div id="error-terms" style={{ ...errorMsgStyle, marginLeft: 24 }}>
              <span aria-hidden="true">⚠</span> {errors.agreeToTerms}
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            width: '100%', padding: '12px 0', background: '#3b82f6', color: '#fff',
            border: 'none', borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}`,
  accessibility: `This form implements comprehensive accessibility: every input has an associated <label> via htmlFor/id. Required fields have aria-required="true" and a visual asterisk (aria-hidden). Invalid fields have aria-invalid="true" and aria-describedby linking to error messages. The error summary uses role="alert" with aria-live="assertive" for immediate announcement. Radio buttons use <fieldset>/<legend> for grouping. Password field uses aria-describedby for both the hint and error. Focus moves to the first invalid field on submit. The error icon is aria-hidden since the text conveys the meaning.`,
  performance: `Validation runs only on submit (not on every keystroke) to avoid distracting users while typing. After initial submission, errors clear on a per-field basis as the user corrects them. Refs are used for focus management instead of DOM queries. The form uses native HTML validation attributes (type="email") as progressive enhancement but relies on custom validation (noValidate) for consistent cross-browser behavior.`,
  edgeCases: [
    "All fields empty on submit — all errors shown, focus moves to name field",
    "Email with valid format but unreachable domain — passes client validation; server must verify",
    "Password with only lowercase — specific error message about uppercase requirement",
    "Rapid form submission (double-click) — prevent with disabled state or debounce",
    "Screen reader in forms mode — all fields, labels, and errors are read correctly",
    "Very long input values — layout should handle gracefully without overflow",
    "JavaScript disabled — form can still submit to server with native HTML validation",
  ],
  testingStrategy: [
    "Unit test: validate function returns correct errors for each invalid field",
    "Unit test: validate returns empty object for valid form data",
    "Integration test: submitting empty form shows all error messages",
    "Integration test: focus moves to first invalid field on submit",
    "Integration test: fixing a field clears its error in real-time",
    "Integration test: valid submission shows success state",
    "Accessibility test: all inputs have associated labels (axe/jest-axe)",
    "Accessibility test: error messages linked via aria-describedby",
    "Accessibility test: error summary announced via aria-live",
    "Keyboard test: form is fully operable with Tab, Space, Enter",
  ],
  improvements: [
    "Add real-time validation with debounce (validate as user types after first submit)",
    "Add password strength meter with visual indicator",
    "Implement field-level async validation (e.g., check email uniqueness via API)",
    "Add form state persistence in sessionStorage for page refresh recovery",
    "Support form submission via API with loading state and error handling",
  ],
  followUpQuestions: [
    "What is the difference between aria-describedby and aria-errormessage for form errors?",
    "How would you implement async field validation (e.g., checking if email is already taken)?",
    "What ARIA live region politeness level is appropriate for form errors and why?",
    "How would you handle form accessibility with complex custom components (date pickers, comboboxes)?",
  ],
};
