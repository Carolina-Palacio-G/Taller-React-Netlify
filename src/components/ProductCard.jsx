import PropTypes from "prop-types";

/* ===========================
   Utilidades sencillas
   =========================== */
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

/** Formatea el precio como moneda (por defecto USD en es-CO) */
const formatPrice = (value, locale = "es-CO", currency = "USD") => {
  const n = Number(value);
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    Number.isFinite(n) ? n : 0
  );
};

/* ===========================
   Estrellas de calificación
   =========================== */
function RatingStars({ rating = 0 }) {
  const rounded = clamp(Math.round(Number(rating) || 0), 0, 5);
  const visual = "★★★★★".slice(0, rounded).padEnd(5, "☆");

  return (
    <span className="stars" aria-label={`Calificación ${rounded} de 5`} role="img">
      <span aria-hidden="true">{visual}</span>
    </span>
  );
}

RatingStars.propTypes = {
  rating: PropTypes.number
};

/* ===========================
   Tarjeta de producto
   =========================== */
export default function ProductCard({ product, onAdd }) {
  const FALLBACK_IMG = "https://via.placeholder.com/400x300?text=Sin+imagen";
  const PLACEHOLDER_IMG = "https://via.placeholder.com/400x300?text=Producto";

  const {
    name = "Producto",
    image = PLACEHOLDER_IMG,
    category = "General",
    price = 0,
    rating = 0
  } = product || {};

  const handleAdd = () => {
    // Si hay callback externo, úsalo. Si no, un fallback simple.
    if (typeof onAdd === "function") onAdd(product);
    else console.info(`Añadido: ${name}`);
  };

  const handleImageError = (e) => {
    // Evita bucles de onError aplicando un fallback único
    if (e.currentTarget.src !== FALLBACK_IMG) {
      e.currentTarget.src = FALLBACK_IMG;
    }
  };

  return (
    <article className="card" aria-label={name}>
      <img
        className="card-image"
        src={image}
        alt={name}
        loading="lazy"
        width="400"
        height="300"
        onError={handleImageError}
      />

      <div className="card-body">
        <h3 className="name">{name}</h3>

        <div className="meta">
          <span className="badge" aria-label={`Categoría: ${category}`}>
            {category}
          </span>
          <RatingStars rating={rating} />
        </div>

        <div className="price">{formatPrice(price)}</div>

        <button
          type="button"
          className="button"
          onClick={handleAdd}
          aria-label={`Añadir ${name} al carrito`}
        >
          Añadir al carrito
        </button>
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    rating: PropTypes.number
  }).isRequired,
  /** Callback opcional para manejar el "añadir al carrito" */
  onAdd: PropTypes.func
};