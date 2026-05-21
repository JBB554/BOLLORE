import { useState, useEffect, useRef } from "react";

const PRODUCTS = [
  { id: 1, name: "Midnight Velvet Gown", price: 85000, category: "Evening Wear", style: "Western", color: "Black", size: ["XS","S","M","L"], tag: "New", img: "👗", desc: "Floor-length velvet with open back. Perfect for galas.", occasion: ["gala","evening","formal"] },
  { id: 2, name: "Ankara Bloom Midi", price: 42000, category: "African Atelier", style: "African", color: "Multicolor", size: ["S","M","L","XL"], tag: "Bestseller", img: "🌺", desc: "Vibrant wax print midi wrap. Office to dinner seamlessly.", occasion: ["casual","office","dinner"] },
  { id: 3, name: "Istanbul Lace Set", price: 67000, category: "Turkish Collection", style: "Turkish", color: "Cream", size: ["XS","S","M","L"], tag: "New", img: "✨", desc: "Intricate Turkish lace co-ord. Blouse + wide-leg trousers.", occasion: ["evening","formal","wedding"] },
  { id: 4, name: "Sahel Linen Dress", price: 38000, category: "Mediterranean", style: "Mediterranean", color: "Sand", size: ["S","M","L","XL"], tag: "", img: "🌿", desc: "Breathable linen slip dress. Made for Yaoundé's warmth.", occasion: ["casual","brunch","travel"] },
  { id: 5, name: "Power Blazer Set", price: 72000, category: "Western Contemporary", style: "Western", color: "Camel", size: ["XS","S","M","L","XL"], tag: "Limited", img: "💼", desc: "Tailored double-breasted blazer + matching trousers.", occasion: ["office","formal","interview"] },
  { id: 6, name: "Kaba Royale", price: 55000, category: "African Atelier", style: "African", color: "Royal Blue", size: ["S","M","L","XL","2XL"], tag: "Exclusive", img: "👑", desc: "Premium Cameroonian kaba with gold embroidery detail.", occasion: ["traditional","gala","ceremony"] },
  { id: 7, name: "Côte d'Azur Sundress", price: 33000, category: "Mediterranean", style: "Mediterranean", color: "White", size: ["XS","S","M","L"], tag: "New", img: "🤍", desc: "Breezy cotton sundress with ruched waist. Pure elegance.", occasion: ["casual","brunch","travel","beach"] },
  { id: 8, name: "Bosphorus Evening Gown", price: 120000, category: "Turkish Collection", style: "Turkish", color: "Emerald", size: ["XS","S","M","L"], tag: "Premium", img: "💎", desc: "Beaded Turkish formal gown. For when you must be remembered.", occasion: ["gala","evening","wedding","formal"] },
  { id: 9, name: "Lagos Street Crop Set", price: 29000, category: "African Atelier", style: "African", color: "Terracotta", size: ["XS","S","M","L"], tag: "Trending", img: "🔥", desc: "Modern African print crop top + high-waist skirt.", occasion: ["casual","brunch","weekend"] },
  { id: 10, name: "Executive Column Dress", price: 58000, category: "Western Contemporary", style: "Western", color: "Navy", size: ["XS","S","M","L","XL"], tag: "", img: "🌊", desc: "Sleek column dress with back slit. Boardroom to gala.", occasion: ["office","formal","dinner","gala"] },
  { id: 11, name: "Marrakech Kaftan", price: 48000, category: "Mediterranean", style: "Mediterranean", color: "Gold", size: ["S","M","L","XL","2XL"], tag: "Bestseller", img: "⭐", desc: "Flowing kaftan with hand-embroidered neckline. Timeless.", occasion: ["casual","evening","dinner"] },
  { id: 12, name: "Red Carpet Trumpet", price: 95000, category: "Western Contemporary", style: "Western", color: "Red", size: ["XS","S","M","L"], tag: "New", img: "🌹", desc: "Fitted trumpet silhouette. For the woman who owns every room.", occasion: ["gala","evening","formal","wedding"] },
];

const STYLES = ["All","African","Turkish","Mediterranean","Western"];
const OCCASIONS = ["All","Gala & Evening","Office","Casual","Wedding","Traditional"];

const BOT_SUGGESTIONS = {
  "evening gala": [1,8,12,10],
  "gala": [1,8,12,10],
  "kaba": [6],
  "office": [5,10,2],
  "wedding": [3,8,12],
  "casual": [2,4,7,9,11],
  "ankara": [2,9],
  "turkish": [3,8],
  "linen": [4,7],
  "african": [2,6,9],
  "something new": [12,1,8,3],
  "surprise me": [11,5,7,4],
  "red carpet": [12,8,1],
  "traditional": [6,2],
  "kaba or": [6],
};

const QUICK_REPLIES = ["Evening gala look 🌙","Something new ✨","Office outfit 💼","Wedding guest 💍","Casual day 🌿","Traditional kaba 👑","Surprise me 🎲"];

export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [filter, setFilter] = useState({ style: "All", occasion: "All", search: "" });
  const [botOpen, setBotOpen] = useState(false);
  const [botMessages, setBotMessages] = useState([{ from: "bot", text: "Bonjour! 👋 I'm your personal stylist at La Maison Joan. Tell me what you're looking for — an evening gala look, a kaba, office wear, or just say 'Surprise me'!" }]);
  const [botInput, setBotInput] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [account, setAccount] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [payMethod, setPayMethod] = useState("momo");
  const [loyaltyPoints, setLoyaltyPoints] = useState(240);
  const botEndRef = useRef(null);

  useEffect(() => { botEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [botMessages]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  const addToCart = (product, size) => {
    const s = size || product.size[1] || product.size[0];
    setCart(c => { const ex = c.find(i => i.id === product.id && i.size === s); return ex ? c.map(i => i.id === product.id && i.size === s ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...product, size: s, qty: 1 }]; });
    showToast(`${product.name} added to cart ✓`);
  };

  const toggleWishlist = (id) => {
    setWishlist(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);
    showToast(wishlist.includes(id) ? "Removed from wishlist" : "Saved to wishlist ♡");
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleBot = (input) => {
    const msg = (input || botInput).toLowerCase().trim();
    if (!msg) return;
    setBotMessages(m => [...m, { from: "user", text: input || botInput }]);
    setBotInput("");
    setTimeout(() => {
      let ids = [];
      for (const [key, val] of Object.entries(BOT_SUGGESTIONS)) {
        if (msg.includes(key)) { ids = val; break; }
      }
      if (!ids.length) ids = [1, 3, 5, 8];
      const picks = PRODUCTS.filter(p => ids.includes(p.id));
      const reply = picks.length === 1
        ? `For "${msg}", I love this for you: **${picks[0].name}** at ${picks[0].price.toLocaleString()} XAF — ${picks[0].desc}`
        : `Here are my top picks for you 💫`;
      setBotMessages(m => [...m, { from: "bot", text: reply, products: picks.length > 1 ? picks : [] }]);
    }, 600);
  };

  const filtered = PRODUCTS.filter(p => {
    const s = filter.style === "All" || p.style === filter.style;
    const o = filter.occasion === "All" ||
      (filter.occasion === "Gala & Evening" && p.occasion.some(x => ["gala","evening"].includes(x))) ||
      (filter.occasion === "Office" && p.occasion.includes("office")) ||
      (filter.occasion === "Casual" && p.occasion.includes("casual")) ||
      (filter.occasion === "Wedding" && p.occasion.includes("wedding")) ||
      (filter.occasion === "Traditional" && p.occasion.includes("traditional"));
    const q = !filter.search || p.name.toLowerCase().includes(filter.search.toLowerCase()) || p.category.toLowerCase().includes(filter.search.toLowerCase());
    return s && o && q;
  });

  const fmtXAF = (n) => n.toLocaleString() + " XAF";

  // PRODUCT MODAL
  if (selectedProduct) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Georgia', serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 32px", borderBottom: "1px solid #2a2a2a", background: "#111" }}>
        <button onClick={() => setSelectedProduct(null)} style={{ background: "none", border: "1px solid #444", color: "#c9a84c", padding: "8px 16px", cursor: "pointer", borderRadius: 2, fontFamily: "inherit" }}>← Back</button>
        <span style={{ color: "#c9a84c", fontSize: 13, letterSpacing: 3 }}>LA MAISON JOAN</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, maxWidth: 1100, margin: "0 auto", padding: 40 }}>
        <div style={{ background: "#1a1a1a", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 120, minHeight: 480, position: "relative" }}>
          {selectedProduct.img}
          {selectedProduct.tag && <div style={{ position: "absolute", top: 20, left: 20, background: "#c9a84c", color: "#000", fontSize: 11, fontFamily: "sans-serif", fontWeight: 700, padding: "4px 10px", letterSpacing: 1 }}>{selectedProduct.tag.toUpperCase()}</div>}
        </div>
        <div style={{ padding: "0 0 0 48px" }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#c9a84c", fontFamily: "sans-serif", marginBottom: 12 }}>{selectedProduct.category.toUpperCase()}</div>
          <h1 style={{ fontSize: 32, fontWeight: 400, margin: "0 0 16px", lineHeight: 1.2 }}>{selectedProduct.name}</h1>
          <div style={{ fontSize: 24, color: "#c9a84c", marginBottom: 20, fontFamily: "sans-serif" }}>{fmtXAF(selectedProduct.price)}</div>
          <p style={{ color: "#aaa", lineHeight: 1.7, marginBottom: 28, fontFamily: "sans-serif", fontSize: 14 }}>{selectedProduct.desc}</p>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, letterSpacing: 2, color: "#888", fontFamily: "sans-serif", marginBottom: 10 }}>SELECT SIZE</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {selectedProduct.size.map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} style={{ padding: "10px 18px", border: `1px solid ${selectedSize === s ? "#c9a84c" : "#444"}`, background: selectedSize === s ? "#c9a84c" : "transparent", color: selectedSize === s ? "#000" : "#fff", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13, borderRadius: 2 }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 4, padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 12, color: "#c9a84c", fontFamily: "sans-serif", marginBottom: 8, fontWeight: 700 }}>💡 STYLIST TIP</div>
            <div style={{ fontSize: 13, color: "#aaa", fontFamily: "sans-serif", lineHeight: 1.6 }}>Pair with nude heels and a gold clutch for maximum impact. This piece works beautifully with your natural complexion — add one bold accessory and let the garment speak.</div>
          </div>
          <button onClick={() => { addToCart(selectedProduct, selectedSize); }} style={{ width: "100%", padding: "16px", background: "#c9a84c", border: "none", color: "#000", fontSize: 14, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 2, cursor: "pointer", borderRadius: 2, marginBottom: 12 }}>ADD TO CART</button>
          <button onClick={() => { window.open("https://wa.me/237600000000?text=Hi!%20I'm%20interested%20in%20" + encodeURIComponent(selectedProduct.name), "_blank"); }} style={{ width: "100%", padding: "14px", background: "transparent", border: "1px solid #25D366", color: "#25D366", fontSize: 13, fontFamily: "sans-serif", cursor: "pointer", borderRadius: 2, letterSpacing: 1 }}>📱 ASK ON WHATSAPP</button>
          <div style={{ marginTop: 20, display: "flex", gap: 20, fontSize: 12, color: "#666", fontFamily: "sans-serif" }}>
            <span>🚚 Free delivery Yaoundé 50k+</span>
            <span>↩ 7-day returns</span>
          </div>
        </div>
      </div>
    </div>
  );

  // CHECKOUT
  if (cartOpen && cart.length) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 32px", borderBottom: "1px solid #2a2a2a", background: "#111" }}>
        <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "1px solid #444", color: "#c9a84c", padding: "8px 16px", cursor: "pointer", borderRadius: 2 }}>← Back</button>
        <span style={{ color: "#c9a84c", fontSize: 13, letterSpacing: 3, fontFamily: "'Georgia', serif" }}>LA MAISON JOAN</span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#888" }}>
          {["Cart","Details","Payment","Confirm"].map((s, i) => (
            <span key={s}><span style={{ color: checkoutStep >= i + 1 ? "#c9a84c" : "#555", fontWeight: checkoutStep === i + 1 ? 700 : 400 }}>{s}</span>{i < 3 && <span style={{ color: "#333", margin: "0 8px" }}>›</span>}</span>
          ))}
        </span>
      </div>
      {orderPlaced ? (
        <div style={{ textAlign: "center", padding: 80 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>✨</div>
          <h2 style={{ fontSize: 28, fontWeight: 400, fontFamily: "'Georgia', serif", color: "#c9a84c", marginBottom: 12 }}>Order Confirmed!</h2>
          <p style={{ color: "#aaa", marginBottom: 8 }}>Order #LMJ-{Math.floor(Math.random()*90000+10000)}</p>
          <p style={{ color: "#aaa", marginBottom: 32 }}>You've earned <span style={{ color: "#c9a84c" }}>+{Math.floor(cartTotal/1000)} loyalty points!</span></p>
          <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 24, maxWidth: 360, margin: "0 auto 32px" }}>
            <div style={{ fontSize: 13, color: "#c9a84c", marginBottom: 12 }}>💡 WHILE YOU WAIT</div>
            <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.7 }}>Steam your garment before wearing. Use a cool iron on delicate fabrics. Your order will be delivered within 24–48 hours in Yaoundé.</p>
          </div>
          <button onClick={() => { setCart([]); setCartOpen(false); setOrderPlaced(false); setCheckoutStep(1); setPage("home"); }} style={{ padding: "14px 32px", background: "#c9a84c", border: "none", color: "#000", fontWeight: 700, letterSpacing: 1, cursor: "pointer", borderRadius: 2 }}>CONTINUE SHOPPING</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 0, maxWidth: 1100, margin: "40px auto", padding: "0 32px" }}>
          <div style={{ paddingRight: 48 }}>
            {checkoutStep === 1 && (
              <div>
                <h2 style={{ fontFamily: "'Georgia', serif", fontWeight: 400, fontSize: 24, marginBottom: 24, color: "#fff" }}>Your Cart</h2>
                {cart.map(item => (
                  <div key={item.id + item.size} style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 0", borderBottom: "1px solid #222" }}>
                    <div style={{ fontSize: 48, background: "#1a1a1a", width: 80, height: 80, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4 }}>{item.img}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>Size: {item.size} · {item.category}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button onClick={() => setCart(c => c.map(i => i.id === item.id && i.size === item.size ? { ...i, qty: Math.max(1, i.qty - 1) } : i))} style={{ width: 28, height: 28, background: "#222", border: "1px solid #444", color: "#fff", cursor: "pointer", borderRadius: 2 }}>-</button>
                      <span style={{ minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => setCart(c => c.map(i => i.id === item.id && i.size === item.size ? { ...i, qty: i.qty + 1 } : i))} style={{ width: 28, height: 28, background: "#222", border: "1px solid #444", color: "#fff", cursor: "pointer", borderRadius: 2 }}>+</button>
                    </div>
                    <div style={{ minWidth: 100, textAlign: "right", color: "#c9a84c" }}>{fmtXAF(item.price * item.qty)}</div>
                    <button onClick={() => setCart(c => c.filter(i => !(i.id === item.id && i.size === item.size)))} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 18 }}>×</button>
                  </div>
                ))}
                <button onClick={() => setCheckoutStep(2)} style={{ marginTop: 32, width: "100%", padding: "16px", background: "#c9a84c", border: "none", color: "#000", fontWeight: 700, letterSpacing: 2, cursor: "pointer", borderRadius: 2 }}>PROCEED TO CHECKOUT →</button>
              </div>
            )}
            {checkoutStep === 2 && (
              <div>
                <h2 style={{ fontFamily: "'Georgia', serif", fontWeight: 400, fontSize: 24, marginBottom: 24 }}>Delivery Details</h2>
                {[["Full Name","Name"],["Phone / WhatsApp","e.g. +237 6XX XXX XXX"],["Delivery Address","Quartier, Yaoundé"],["City","Yaoundé"]].map(([label, ph]) => (
                  <div key={label} style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 11, letterSpacing: 2, color: "#888", marginBottom: 6 }}>{label.toUpperCase()}</label>
                    <input placeholder={ph} style={{ width: "100%", padding: "12px 14px", background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: 2, fontSize: 14, boxSizing: "border-box" }} />
                  </div>
                ))}
                <div style={{ background: "#111", border: "1px solid #c9a84c44", borderRadius: 4, padding: 16, marginTop: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: "#c9a84c", marginBottom: 8 }}>💡 DELIVERY TIP</div>
                  <p style={{ fontSize: 13, color: "#aaa", margin: 0, lineHeight: 1.6 }}>We deliver within 24–48 hours in Yaoundé. For other cities, 3–5 business days via Campost or private courier. Always include a WhatsApp number — our delivery team will confirm with you before arrival.</p>
                </div>
                <button onClick={() => setCheckoutStep(3)} style={{ width: "100%", padding: "16px", background: "#c9a84c", border: "none", color: "#000", fontWeight: 700, letterSpacing: 2, cursor: "pointer", borderRadius: 2 }}>CONTINUE TO PAYMENT →</button>
              </div>
            )}
            {checkoutStep === 3 && (
              <div>
                <h2 style={{ fontFamily: "'Georgia', serif", fontWeight: 400, fontSize: 24, marginBottom: 24 }}>Payment Method</h2>
                {[
                  { id: "momo", label: "MTN Mobile Money", icon: "📱", detail: "Pay securely with MTN MoMo. Instant confirmation." },
                  { id: "om", label: "Orange Money", icon: "🟠", detail: "Pay with Orange Money. Fast and secure." },
                  { id: "card", label: "Credit / Debit Card", icon: "💳", detail: "Visa, Mastercard. Processed securely." },
                  { id: "cod", label: "Cash on Delivery", icon: "💵", detail: "Pay when your order arrives. Available in Yaoundé only." },
                ].map(m => (
                  <div key={m.id} onClick={() => setPayMethod(m.id)} style={{ padding: 20, marginBottom: 12, border: `1px solid ${payMethod === m.id ? "#c9a84c" : "#2a2a2a"}`, borderRadius: 4, cursor: "pointer", background: payMethod === m.id ? "#1a1500" : "#111", display: "flex", alignItems: "center", gap: 16 }}>
                    <span style={{ fontSize: 28 }}>{m.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{m.label}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{m.detail}</div>
                    </div>
                    {payMethod === m.id && <div style={{ marginLeft: "auto", color: "#c9a84c", fontSize: 20 }}>✓</div>}
                  </div>
                ))}
                {loyaltyPoints > 0 && (
                  <div style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 4, padding: 16, marginTop: 16, marginBottom: 20 }}>
                    <div style={{ fontSize: 12, color: "#c9a84c", marginBottom: 6 }}>⭐ LOYALTY POINTS</div>
                    <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 8px" }}>You have {loyaltyPoints} points = {fmtXAF(loyaltyPoints * 10)} discount available</p>
                    <button style={{ fontSize: 12, background: "none", border: "1px solid #c9a84c", color: "#c9a84c", padding: "6px 14px", cursor: "pointer", borderRadius: 2 }}>Apply Points</button>
                  </div>
                )}
                <button onClick={() => setCheckoutStep(4)} style={{ width: "100%", padding: "16px", background: "#c9a84c", border: "none", color: "#000", fontWeight: 700, letterSpacing: 2, cursor: "pointer", borderRadius: 2 }}>REVIEW ORDER →</button>
              </div>
            )}
            {checkoutStep === 4 && (
              <div>
                <h2 style={{ fontFamily: "'Georgia', serif", fontWeight: 400, fontSize: 24, marginBottom: 24 }}>Confirm Order</h2>
                {cart.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #222", fontSize: 14 }}>
                    <span style={{ color: "#ccc" }}>{item.name} × {item.qty} (Size {item.size})</span>
                    <span style={{ color: "#c9a84c" }}>{fmtXAF(item.price * item.qty)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #222", fontSize: 13, color: "#888" }}>
                  <span>Delivery (Yaoundé)</span><span>2,000 XAF</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", fontSize: 18, fontWeight: 700 }}>
                  <span>Total</span><span style={{ color: "#c9a84c" }}>{fmtXAF(cartTotal + 2000)}</span>
                </div>
                <button onClick={() => { setOrderPlaced(true); setLoyaltyPoints(p => p + Math.floor(cartTotal / 1000)); }} style={{ width: "100%", padding: "18px", background: "#c9a84c", border: "none", color: "#000", fontWeight: 700, letterSpacing: 2, cursor: "pointer", borderRadius: 2, fontSize: 15 }}>PLACE ORDER ✓</button>
              </div>
            )}
          </div>
          <div style={{ background: "#111", borderRadius: 4, border: "1px solid #2a2a2a", padding: 28, height: "fit-content", position: "sticky", top: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: "#888", marginBottom: 16 }}>ORDER SUMMARY</div>
            {cart.map(i => <div key={i.id + i.size} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10, color: "#ccc" }}><span>{i.name} × {i.qty}</span><span>{fmtXAF(i.price * i.qty)}</span></div>)}
            <div style={{ borderTop: "1px solid #2a2a2a", marginTop: 16, paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}><span>Total</span><span style={{ color: "#c9a84c" }}>{fmtXAF(cartTotal)}</span></div>
            </div>
            <div style={{ marginTop: 20, padding: 14, background: "#1a1a1a", borderRadius: 4 }}>
              <div style={{ fontSize: 11, color: "#c9a84c", marginBottom: 6 }}>⭐ EARN LOYALTY POINTS</div>
              <div style={{ fontSize: 12, color: "#888" }}>This order earns you +{Math.floor(cartTotal / 1000)} points toward your next reward.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // MAIN SITE
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Georgia', serif", position: "relative" }}>
      {toast && <div style={{ position: "fixed", bottom: 32, right: 32, background: "#c9a84c", color: "#000", padding: "12px 24px", borderRadius: 4, fontFamily: "sans-serif", fontWeight: 700, fontSize: 13, zIndex: 9999, letterSpacing: 1 }}>{toast}</div>}

      {/* NAV */}
      <nav style={{ background: "#000", borderBottom: "1px solid #1a1a1a", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", gap: 32, fontSize: 11, letterSpacing: 2, color: "#aaa" }}>
          {["New In","African","Turkish","Mediterranean","Western","Occasions"].map(l => (
            <button key={l} onClick={() => { setFilter(f => ({ ...f, style: ["African","Turkish","Mediterranean","Western"].includes(l) ? l : "All" })); setPage("shop"); }} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontFamily: "sans-serif", fontSize: 11, letterSpacing: 2, padding: "0 0 2px", borderBottom: "1px solid transparent" }}>{l.toUpperCase()}</button>
          ))}
        </div>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 20, color: "#c9a84c", letterSpacing: 4, fontWeight: 400 }}>LA MAISON JOAN</div>
        </button>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <button onClick={() => setLoginOpen(true)} style={{ background: "none", border: "none", color: "#aaa", cursor: "pointer", fontSize: 11, letterSpacing: 1, fontFamily: "sans-serif" }}>{account ? `✓ ${account}` : "ACCOUNT"}</button>
          <button onClick={() => setPage("wishlist")} style={{ background: "none", border: "none", color: wishlist.length ? "#c9a84c" : "#aaa", cursor: "pointer", fontSize: 11, letterSpacing: 1, fontFamily: "sans-serif" }}>WISHLIST {wishlist.length > 0 && `(${wishlist.length})`}</button>
          <button onClick={() => { if (cart.length) setCartOpen(true); else showToast("Your cart is empty"); }} style={{ padding: "8px 20px", background: cartCount > 0 ? "#c9a84c" : "transparent", border: "1px solid #c9a84c", color: cartCount > 0 ? "#000" : "#c9a84c", cursor: "pointer", fontFamily: "sans-serif", fontSize: 11, letterSpacing: 2, borderRadius: 2, fontWeight: cartCount > 0 ? 700 : 400 }}>BAG {cartCount > 0 && `(${cartCount})`}</button>
        </div>
      </nav>

      {/* LOGIN MODAL */}
      {loginOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 4, padding: 40, width: 380 }}>
            <div style={{ fontSize: 18, marginBottom: 24, color: "#c9a84c", fontFamily: "'Georgia', serif" }}>Welcome Back</div>
            <input placeholder="Email address" style={{ width: "100%", padding: "12px 14px", background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: 2, fontSize: 14, boxSizing: "border-box", marginBottom: 12, display: "block" }} />
            <input type="password" placeholder="Password" style={{ width: "100%", padding: "12px 14px", background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: 2, fontSize: 14, boxSizing: "border-box", marginBottom: 20, display: "block" }} />
            <div style={{ background: "#1a1500", border: "1px solid #c9a84c44", borderRadius: 4, padding: 14, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#c9a84c", marginBottom: 6 }}>⭐ LOYALTY PROGRAM</div>
              <div style={{ fontSize: 12, color: "#aaa" }}>Sign in to access your {loyaltyPoints} points, order history, wishlist, and exclusive member-only deals.</div>
            </div>
            <button onClick={() => { setAccount("Joan"); setLoginOpen(false); showToast("Welcome back, Joan! ✓"); }} style={{ width: "100%", padding: "14px", background: "#c9a84c", border: "none", color: "#000", fontWeight: 700, letterSpacing: 2, cursor: "pointer", borderRadius: 2, marginBottom: 12, boxSizing: "border-box" }}>SIGN IN</button>
            <button onClick={() => setLoginOpen(false)} style={{ width: "100%", padding: "10px", background: "none", border: "1px solid #333", color: "#888", cursor: "pointer", borderRadius: 2, fontSize: 13, boxSizing: "border-box" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* HOME PAGE */}
      {page === "home" && (
        <div>
          {/* HERO */}
          <div style={{ height: 600, background: "linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(201,168,76,0.03) 60px, rgba(201,168,76,0.03) 61px)" }}></div>
            <div style={{ textAlign: "center", zIndex: 1 }}>
              <div style={{ fontSize: 11, letterSpacing: 6, color: "#c9a84c", marginBottom: 24, fontFamily: "sans-serif" }}>YAOUNDÉ · CAMEROUN · WORLDWIDE</div>
              <h1 style={{ fontSize: 72, fontWeight: 400, margin: "0 0 16px", lineHeight: 1, letterSpacing: 2 }}>La Maison Joan</h1>
              <p style={{ color: "#888", fontSize: 16, fontFamily: "sans-serif", marginBottom: 40, letterSpacing: 1 }}>African Grace. Global Elegance. Delivered.</p>
              <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                <button onClick={() => setPage("shop")} style={{ padding: "16px 40px", background: "#c9a84c", border: "none", color: "#000", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 3, cursor: "pointer", fontSize: 13, borderRadius: 2 }}>SHOP NOW</button>
                <button onClick={() => setBotOpen(true)} style={{ padding: "16px 40px", background: "transparent", border: "1px solid #c9a84c", color: "#c9a84c", fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 2, cursor: "pointer", fontSize: 13, borderRadius: 2 }}>STYLE ME ✨</button>
              </div>
            </div>
          </div>

          {/* CATEGORIES STRIP */}
          <div style={{ display: "flex", gap: 2, padding: "2px" }}>
            {[["Turkish Collection","Turkish","🇹🇷"],["African Atelier","African","🌍"],["Mediterranean","Mediterranean","🌊"],["Western Contemporary","Western","💫"]].map(([label, style, icon]) => (
              <div key={style} onClick={() => { setFilter(f => ({ ...f, style })); setPage("shop"); }} style={{ flex: 1, background: "#111", padding: "28px 20px", textAlign: "center", cursor: "pointer", borderBottom: "3px solid transparent" }}
                onMouseEnter={e => e.currentTarget.style.borderBottomColor = "#c9a84c"}
                onMouseLeave={e => e.currentTarget.style.borderBottomColor = "transparent"}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 12, letterSpacing: 2, color: "#ccc", fontFamily: "sans-serif" }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* FEATURED */}
          <div style={{ padding: "60px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
              <h2 style={{ fontWeight: 400, fontSize: 28, margin: 0 }}>New Arrivals</h2>
              <button onClick={() => setPage("shop")} style={{ background: "none", border: "none", color: "#c9a84c", cursor: "pointer", fontFamily: "sans-serif", fontSize: 12, letterSpacing: 2 }}>VIEW ALL →</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {PRODUCTS.filter(p => p.tag).slice(0, 4).map(p => (
                <div key={p.id} style={{ cursor: "pointer", position: "relative" }}>
                  <div onClick={() => setSelectedProduct(p)} style={{ background: "#1a1a1a", aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 80, marginBottom: 12, borderRadius: 2, position: "relative", overflow: "hidden" }}>
                    {p.img}
                    {p.tag && <div style={{ position: "absolute", top: 12, left: 12, background: "#c9a84c", color: "#000", fontSize: 10, fontFamily: "sans-serif", fontWeight: 700, padding: "3px 8px", letterSpacing: 1 }}>{p.tag.toUpperCase()}</div>}
                    <button onClick={e => { e.stopPropagation(); toggleWishlist(p.id); }} style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.5)", border: "none", color: wishlist.includes(p.id) ? "#c9a84c" : "#fff", cursor: "pointer", fontSize: 18, borderRadius: "50%", width: 32, height: 32 }}>♡</button>
                  </div>
                  <div style={{ fontSize: 13, marginBottom: 4, fontFamily: "sans-serif", color: "#ddd" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#888", fontFamily: "sans-serif", marginBottom: 6 }}>{p.category}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#c9a84c", fontFamily: "sans-serif", fontSize: 13 }}>{fmtXAF(p.price)}</span>
                    <button onClick={() => addToCart(p)} style={{ padding: "6px 12px", background: "transparent", border: "1px solid #444", color: "#ccc", cursor: "pointer", fontFamily: "sans-serif", fontSize: 11, borderRadius: 2 }}>ADD</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRUST STRIP */}
          <div style={{ background: "#111", padding: "32px 40px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
            {[["🚚","Nationwide Delivery","24–48h in Yaoundé"],["💳","Secure Payment","MoMo · Orange Money · Card · COD"],["↩","Easy Returns","7-day return policy"],["💬","WhatsApp Support","Always here for you"]].map(([icon, title, sub]) => (
              <div key={title} style={{ textAlign: "center", padding: "12px 20px", borderRight: "1px solid #2a2a2a" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 13, fontFamily: "sans-serif", fontWeight: 600, marginBottom: 4, color: "#ddd" }}>{title}</div>
                <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "#666" }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* PRESS / REVIEWS */}
          <div style={{ padding: "60px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#888", fontFamily: "sans-serif", marginBottom: 40 }}>LOVED BY OUR CLIENTS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 860, margin: "0 auto" }}>
              {[["Aissatou M.","The Kaba Royale is the most beautiful thing I've ever worn. Delivered next day, perfect fit. La Maison Joan is my new obsession.","⭐⭐⭐⭐⭐"],["Francine T.","I ordered the Istanbul Lace Set for my company dinner and got stopped by 5 people asking where I bought it!","⭐⭐⭐⭐⭐"],["Nadège B.","Finally a Cameroonian boutique that matches international quality. The Midnight Velvet Gown is STUNNING.","⭐⭐⭐⭐⭐"]].map(([name, review, stars]) => (
                <div key={name} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: 4, padding: 28, textAlign: "left" }}>
                  <div style={{ marginBottom: 12, fontSize: 14 }}>{stars}</div>
                  <p style={{ fontFamily: "sans-serif", fontSize: 13, color: "#aaa", lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>"{review}"</p>
                  <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#c9a84c", fontWeight: 600 }}>— {name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SHOP PAGE */}
      {(page === "shop" || page === "wishlist") && (
        <div style={{ padding: "40px" }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
            <h2 style={{ fontWeight: 400, fontSize: 24, margin: 0, marginRight: "auto" }}>{page === "wishlist" ? "My Wishlist" : "Shop All"}</h2>
            <input value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} placeholder="Search pieces..." style={{ padding: "10px 16px", background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: 2, fontFamily: "sans-serif", fontSize: 13, width: 200 }} />
            <select value={filter.style} onChange={e => setFilter(f => ({ ...f, style: e.target.value }))} style={{ padding: "10px 16px", background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: 2, fontFamily: "sans-serif", fontSize: 13 }}>
              {STYLES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={filter.occasion} onChange={e => setFilter(f => ({ ...f, occasion: e.target.value }))} style={{ padding: "10px 16px", background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: 2, fontFamily: "sans-serif", fontSize: 13 }}>
              {OCCASIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {(page === "wishlist" ? PRODUCTS.filter(p => wishlist.includes(p.id)) : filtered).map(p => (
              <div key={p.id} style={{ cursor: "pointer" }}>
                <div onClick={() => setSelectedProduct(p)} style={{ background: "#1a1a1a", aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, marginBottom: 10, borderRadius: 2, position: "relative", overflow: "hidden" }}>
                  {p.img}
                  {p.tag && <div style={{ position: "absolute", top: 10, left: 10, background: p.tag === "Limited" ? "#ff4444" : "#c9a84c", color: "#000", fontSize: 9, fontFamily: "sans-serif", fontWeight: 700, padding: "2px 6px" }}>{p.tag.toUpperCase()}</div>}
                  <button onClick={e => { e.stopPropagation(); toggleWishlist(p.id); }} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", color: wishlist.includes(p.id) ? "#c9a84c" : "#fff", cursor: "pointer", fontSize: 16, borderRadius: "50%", width: 30, height: 30 }}>♡</button>
                </div>
                <div style={{ fontSize: 12, marginBottom: 3, fontFamily: "sans-serif", color: "#ccc" }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "#666", fontFamily: "sans-serif", marginBottom: 6 }}>{p.category}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#c9a84c", fontFamily: "sans-serif", fontSize: 12 }}>{fmtXAF(p.price)}</span>
                  <button onClick={() => addToCart(p)} style={{ padding: "5px 10px", background: "transparent", border: "1px solid #444", color: "#ccc", cursor: "pointer", fontFamily: "sans-serif", fontSize: 10, borderRadius: 2 }}>ADD</button>
                </div>
              </div>
            ))}
          </div>
          {page === "wishlist" && wishlist.length === 0 && <div style={{ textAlign: "center", color: "#555", padding: 80, fontFamily: "sans-serif" }}>Your wishlist is empty. Heart items to save them here.</div>}
        </div>
      )}

      {/* STYLE BOT */}
      {botOpen && (
        <div style={{ position: "fixed", bottom: 90, right: 32, width: 380, background: "#111", border: "1px solid #2a2a2a", borderRadius: 8, zIndex: 500, boxShadow: "0 20px 60px rgba(0,0,0,0.8)", display: "flex", flexDirection: "column", maxHeight: 560 }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #2a2a2a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: "#c9a84c" }}>Joan's Style Advisor</div>
              <div style={{ fontSize: 11, color: "#888", fontFamily: "sans-serif" }}>✦ Online · Instant answers</div>
            </div>
            <button onClick={() => setBotOpen(false)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 20 }}>×</button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {botMessages.map((m, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                  <div style={{ background: m.from === "user" ? "#c9a84c" : "#1a1a1a", color: m.from === "user" ? "#000" : "#ddd", padding: "10px 14px", borderRadius: 8, maxWidth: "80%", fontSize: 13, fontFamily: "sans-serif", lineHeight: 1.5 }}>{m.text}</div>
                </div>
                {m.products && m.products.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
                    {m.products.slice(0, 4).map(p => (
                      <div key={p.id} onClick={() => { setBotOpen(false); setSelectedProduct(p); }} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, padding: 10, cursor: "pointer" }}>
                        <div style={{ fontSize: 32, textAlign: "center", marginBottom: 6 }}>{p.img}</div>
                        <div style={{ fontSize: 11, fontFamily: "sans-serif", color: "#ccc", marginBottom: 2, textAlign: "center" }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "#c9a84c", fontFamily: "sans-serif", textAlign: "center" }}>{fmtXAF(p.price)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={botEndRef} />
          </div>
          <div style={{ padding: "8px 12px", borderTop: "1px solid #2a2a2a", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {QUICK_REPLIES.map(r => (
              <button key={r} onClick={() => handleBot(r)} style={{ padding: "4px 10px", background: "#1a1a1a", border: "1px solid #333", color: "#c9a84c", borderRadius: 20, fontFamily: "sans-serif", fontSize: 11, cursor: "pointer" }}>{r}</button>
            ))}
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid #1a1a1a", display: "flex", gap: 8 }}>
            <input value={botInput} onChange={e => setBotInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleBot()} placeholder="Describe what you need..." style={{ flex: 1, padding: "10px 12px", background: "#1a1a1a", border: "1px solid #333", color: "#fff", borderRadius: 6, fontFamily: "sans-serif", fontSize: 13 }} />
            <button onClick={() => handleBot()} style={{ padding: "10px 16px", background: "#c9a84c", border: "none", color: "#000", borderRadius: 6, fontWeight: 700, cursor: "pointer", fontFamily: "sans-serif" }}>→</button>
          </div>
        </div>
      )}

      {/* BOTTOM ACTIONS */}
      <div style={{ position: "fixed", bottom: 24, right: 32, display: "flex", flexDirection: "column", gap: 12, zIndex: 400 }}>
        <button onClick={() => setBotOpen(!botOpen)} style={{ width: 56, height: 56, borderRadius: "50%", background: "#c9a84c", border: "none", fontSize: 22, cursor: "pointer", boxShadow: "0 4px 20px rgba(201,168,76,0.4)" }}>✨</button>
        <button onClick={() => window.open("https://wa.me/237600000000?text=Hi%20La%20Maison%20Joan!%20I%20need%20help%20with%20my%20order.", "_blank")} style={{ width: 56, height: 56, borderRadius: "50%", background: "#25D366", border: "none", fontSize: 26, cursor: "pointer", boxShadow: "0 4px 20px rgba(37,211,102,0.4)" }}>📱</button>
      </div>
    </div>
  );
}
