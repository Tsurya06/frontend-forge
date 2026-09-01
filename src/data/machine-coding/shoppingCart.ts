import type { MachineCodingProblem } from "../../types";

export const shoppingCartProblem: MachineCodingProblem = {
  id: "mc-shopping-cart",
  title: "Shopping Cart Component",
  difficulty: "Intermediate",
  category: "Machine Coding",
  tags: [
    "react",
    "state-management",
    "e-commerce",
    "context",
    "reducer",
    "cart",
  ],

  problemStatement: `Build a Shopping Cart component in React with add, remove, update quantity, and calculate total functionality. The cart should manage a list of items with their quantities and prices, displaying a running subtotal, tax calculation, and grand total. This is a classic machine coding challenge that tests state management, derived state calculations, and component composition.

The cart should support adding items from a product list, adjusting quantities with increment/decrement buttons, removing items entirely, and applying discount codes. It should persist cart data to localStorage so the cart survives page refreshes. The component should use Context API or useReducer for state management to demonstrate scalable patterns beyond simple useState.`,

  functionalRequirements: [
    "Add items to cart from a product listing",
    "Increment/decrement item quantity in the cart",
    "Remove individual items from the cart",
    "Display subtotal, tax, discount, and grand total",
    "Apply and remove discount/promo codes",
    "Clear entire cart with confirmation",
    "Persist cart to localStorage across page refreshes",
    "Show item count badge on cart icon",
  ],

  nonFunctionalRequirements: [
    "useReducer + Context for scalable state management",
    "Derived calculations (totals) via useMemo to avoid redundant computation",
    "Optimistic UI updates with error rollback",
    "Accessible quantity controls and cart summary",
  ],

  componentHierarchy: `CartProvider (Context)
├── ProductList
│   └── ProductCard (repeated)
│       └── AddToCartButton
└── Cart
    ├── CartHeader (item count)
    ├── CartItemList
    │   └── CartItem (repeated)
    │       ├── ItemInfo (image, name, price)
    │       ├── QuantityControl (+/- buttons)
    │       └── RemoveButton
    ├── PromoCodeInput
    ├── CartSummary
    │   ├── Subtotal
    │   ├── Discount
    │   ├── Tax
    │   └── Total
    └── CheckoutButton`,

  stateDesign: `// State shape (managed by useReducer)
interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discount: number;  // percentage (0-100)
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

type CartAction =
  | { type: 'ADD_ITEM'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'APPLY_PROMO'; code: string; discount: number }
  | { type: 'REMOVE_PROMO' }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; state: CartState };

// ADD_ITEM increments quantity if item already exists.
// UPDATE_QUANTITY removes the item if quantity drops to 0.`,

  architecture: `The cart uses a Context + useReducer pattern, providing cart state and dispatch to the entire component tree via \`CartProvider\`. The reducer handles all cart mutations immutably, and derived values (subtotal, tax, total) are calculated via \`useMemo\` in the context provider.

localStorage persistence is handled with a \`useEffect\` that serializes cart state on every change and a hydration action that loads saved state on mount. The product list and cart components are siblings that communicate through the shared context. Adding an item checks if it already exists in the cart and increments quantity rather than adding a duplicate. Promo code validation is simplified to a lookup table but could be replaced with an API call.`,

  implementation: `import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback, useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'APPLY_PROMO'; code: string; discount: number }
  | { type: 'REMOVE_PROMO' }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; state: CartState };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    }
    case 'APPLY_PROMO':
      return { ...state, promoCode: action.code, discount: action.discount };
    case 'REMOVE_PROMO':
      return { ...state, promoCode: null, discount: 0 };
    case 'CLEAR_CART':
      return { items: [], promoCode: null, discount: 0 };
    case 'HYDRATE':
      return action.state;
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  subtotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const TAX_RATE = 0.08;
const STORAGE_KEY = 'shopping-cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], promoCode: null, discount: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: 'HYDRATE', state: JSON.parse(saved) });
    } catch { /* ignore parse errors */ }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const subtotal = useMemo(() => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0), [state.items]);
  const discountAmount = useMemo(() => subtotal * (state.discount / 100), [subtotal, state.discount]);
  const tax = useMemo(() => (subtotal - discountAmount) * TAX_RATE, [subtotal, discountAmount]);
  const total = useMemo(() => subtotal - discountAmount + tax, [subtotal, discountAmount, tax]);
  const itemCount = useMemo(() => state.items.reduce((sum, i) => sum + i.quantity, 0), [state.items]);

  const value = useMemo(
    () => ({ state, dispatch, subtotal, discountAmount, tax, total, itemCount }),
    [state, subtotal, discountAmount, tax, total, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

const PROMO_CODES: Record<string, number> = { SAVE10: 10, SAVE20: 20, HALF: 50 };

function Cart() {
  const { state, dispatch, subtotal, discountAmount, tax, total, itemCount } = useCart();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const applyPromo = useCallback(() => {
    const discount = PROMO_CODES[promoInput.toUpperCase()];
    if (discount) {
      dispatch({ type: 'APPLY_PROMO', code: promoInput.toUpperCase(), discount });
      setPromoInput('');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  }, [promoInput, dispatch]);

  if (itemCount === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 48, color: '#6b7280' }}>
        <p style={{ fontSize: 18 }}>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'system-ui', maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 16 }}>Cart ({itemCount} items)</h2>

      {state.items.map((item) => (
        <div key={item.id} style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '16px 0', borderBottom: '1px solid #f3f4f6',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 8, background: '#f3f4f6',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
          }}>
            {item.image ? <img src={item.image} alt="" style={{ maxWidth: '100%', borderRadius: 8 }} /> : '📦'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{item.name}</div>
            <div style={{ color: '#6b7280', fontSize: 14 }}>\${item.price.toFixed(2)} each</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity - 1 })}
              aria-label={\`Decrease \${item.name} quantity\`}
              style={{
                width: 30, height: 30, border: '1px solid #d1d5db', borderRadius: 4,
                background: '#fff', cursor: 'pointer', fontSize: 16,
              }}
            >−</button>
            <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
            <button
              onClick={() => dispatch({ type: 'UPDATE_QUANTITY', id: item.id, quantity: item.quantity + 1 })}
              aria-label={\`Increase \${item.name} quantity\`}
              style={{
                width: 30, height: 30, border: '1px solid #d1d5db', borderRadius: 4,
                background: '#fff', cursor: 'pointer', fontSize: 16,
              }}
            >+</button>
          </div>
          <div style={{ fontWeight: 700, minWidth: 70, textAlign: 'right' }}>
            \${(item.price * item.quantity).toFixed(2)}
          </div>
          <button
            onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}
            aria-label={\`Remove \${item.name} from cart\`}
            style={{
              background: 'none', border: 'none', color: '#ef4444',
              cursor: 'pointer', fontSize: 18, padding: 4,
            }}
          >×</button>
        </div>
      ))}

      <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={promoInput}
          onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
          placeholder="Promo code"
          style={{
            flex: 1, padding: '8px 12px', border: '1px solid #d1d5db',
            borderRadius: 6, fontSize: 14,
          }}
        />
        <button
          onClick={applyPromo}
          style={{
            padding: '8px 16px', background: '#111827', color: '#fff',
            border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14,
          }}
        >Apply</button>
      </div>
      {promoError && <p style={{ color: '#ef4444', fontSize: 13, margin: '4px 0 0' }}>{promoError}</p>}
      {state.promoCode && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 14 }}>
          <span style={{ color: '#22c55e' }}>✓ {state.promoCode} applied ({state.discount}% off)</span>
          <button onClick={() => dispatch({ type: 'REMOVE_PROMO' })} style={{
            background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12,
          }}>Remove</button>
        </div>
      )}

      <div style={{ marginTop: 24, padding: '20px', background: '#f9fafb', borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 15 }}>
          <span>Subtotal</span><span>\${subtotal.toFixed(2)}</span>
        </div>
        {state.discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 15, color: '#22c55e' }}>
            <span>Discount ({state.discount}%)</span><span>-\${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15 }}>
          <span>Tax (8%)</span><span>\${tax.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, borderTop: '2px solid #e5e7eb', paddingTop: 12 }}>
          <span>Total</span><span>\${total.toFixed(2)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button
          onClick={() => { if (window.confirm('Clear entire cart?')) dispatch({ type: 'CLEAR_CART' }); }}
          style={{
            padding: '12px 24px', border: '1px solid #d1d5db', borderRadius: 8,
            background: '#fff', cursor: 'pointer', fontSize: 15,
          }}
        >Clear Cart</button>
        <button style={{
          flex: 1, padding: '12px 24px', background: '#2563eb', color: '#fff',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 600,
        }}>Checkout</button>
      </div>
    </div>
  );
}

export default Cart;`,

  accessibility: `Quantity controls have descriptive \`aria-label\` attributes including the item name (e.g., "Decrease Widget quantity"). Remove buttons similarly include the item name for context. The promo code input has a visible label (placeholder) and could be enhanced with a \`<label>\` element. Cart totals use semantic structure for screen reader comprehension. The clear cart button triggers a confirmation dialog. All interactive elements are keyboard accessible with proper focus styles.`,

  performance: `Derived values (subtotal, discount, tax, total, item count) are calculated via \`useMemo\` to avoid recalculation on unrelated state changes. The context value is memoized to prevent unnecessary re-renders of consuming components. localStorage serialization happens in a \`useEffect\` after render, not synchronously during state updates. The reducer performs immutable updates using spread operators, which are efficient for small-to-medium cart sizes. For very large carts, normalized state (items as a map by ID) would be more efficient for lookups.`,

  edgeCases: [
    "Adding the same item twice should increment quantity, not duplicate",
    "Decrementing quantity to 0 should remove the item",
    "Invalid promo code should show error without affecting cart",
    "localStorage with corrupted data should fallback gracefully",
    "Floating point price calculations should round to 2 decimal places",
  ],

  testingStrategy: [
    "Unit test: ADD_ITEM adds new item or increments existing quantity",
    "Unit test: REMOVE_ITEM removes item by ID",
    "Unit test: UPDATE_QUANTITY to 0 removes the item",
    "Unit test: APPLY_PROMO sets discount percentage correctly",
    "Integration test: total calculation with multiple items, discount, and tax",
    "Integration test: cart persists and rehydrates from localStorage",
  ],

  improvements: [
    "Add item stock validation before adding to cart",
    "Support multiple discount types (percentage, fixed amount, free shipping)",
    "Add cart item notes or customization options",
    "Implement saved carts / wishlists",
    "Add animated item add/remove transitions",
  ],

  followUpQuestions: [
    "How would you handle concurrent cart modifications from multiple tabs?",
    "When would you choose Context + useReducer vs Redux for cart state?",
    "How would you implement server-side cart synchronization?",
    "What strategy would you use for handling out-of-stock items?",
  ],
};
