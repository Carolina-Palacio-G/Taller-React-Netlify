import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { PRODUCTS } from "../data/products";

/* ============================================================================
  Utilidades
   - normalize: normaliza texto (minúsculas + sin acentos) para búsquedas
============================================================================ */
const normalize = (str) =>
  (str ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export default function Home() {
  // Estado de controles de UI
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("Todos los productos");
  const [sortBy, setSortBy] = useState("name"); // name | price-asc | price-desc | rating

  // Fuente de datos segura (evita crashear si PRODUCTS no es un array)
  const data = Array.isArray(PRODUCTS) ? PRODUCTS : [];

  // Categorías únicas (con "all" al inicio). Se calcula una única vez.
  const categories = useMemo(() => {
    const uniq = new Set(data.map((p) => p.category).filter(Boolean));
    return ["Todos los productos", ...uniq];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // asumiendo PRODUCTS es estático; si no, usar [data]

  // Lista filtrada y ordenada (derivada de estado y datos)
  const filtered = useMemo(() => {
    const nq = normalize(q);

    // 1) Filtrado por búsqueda y categoría
    let list = data.filter((p) => normalize(p.name).includes(nq));
    if (category !== "Todos los productos") {
      list = list.filter((p) => p.category === category);
    }

    // 2) Ordenamiento
    const byName = (a, b) =>
      a.name.localeCompare(b.name, "es", { sensitivity: "base" });

    const sorted = [...list];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price || byName(a, b));
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price || byName(a, b));
        break;
      case "ranking":
        sorted.sort((a, b) => b.rating - a.rating || byName(a, b));
        break;
      default:
        sorted.sort(byName);
    }

    return sorted;
  }, [q, category, sortBy, data]);

  // Conteo accesible (avisará a lectores de pantalla cuando cambie)
  const resultsText = `${filtered.length} resultado${
    filtered.length !== 1 ? "s" : ""
  }`;

  return (
    <div className="container">
      <header className="header">
        <h1>Tienda de tecnologia</h1>

        <div
          className="toolbar"
          role="search"
          aria-label="Buscador de productos"
        >
          <input
            className="search"
            placeholder="Buscar..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar productos por nombre"
          />

          <select
            className="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filtrar por categoría"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Ordenar resultados"
          >
            <option value="name">Nombre (A–Z)</option>
            <option value="price-desc">Precio (↑)</option>
            <option value="price-asc">Precio (↓)</option>
            <option value="ranking">Raking</option>
          </select>
        </div>

        <p className="muted" aria-live="polite">
          {resultsText}
        </p>
      </header>

      <section className="grid">
        {filtered.length === 0 ? (
          <p className="empty">
            No hay productos que coincidan con tu búsqueda.
          </p>
        ) : (
          filtered.map((p) => <ProductCard key={p.id} product={p} />)
        )}
      </section>
    </div>
  );
}
