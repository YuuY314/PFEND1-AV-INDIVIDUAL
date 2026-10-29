const OFFER_LIMIT = 30;
const TOTAL_NEW_RELEASES = 8;

export function normalize(text = "") {
    return String(text)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

export const priceRanges = [
    { value: "all", label: "Todos os preços", accepts: () => true },
    { value: "upTo30", label: "Até R$ 30", accepts: (price) => price <= 30 },
    { value: "30to45", label: "R$ 30 a R$ 45", accepts: (price) => price > 30 && price <= 45 },
    { value: "over45", label: "Acima de R$ 45", accepts: (price) => price > 45 },
];

export const sortOptions = [
    { value: "featured", label: "Em destaque" },
    { value: "newest", label: "Mais recentes" },
    { value: "lowestPrice", label: "Menor preço" },
    { value: "highestPrice", label: "Maior preço" },
    { value: "title", label: "Título (A–Z)" },
];

export const collections = {
    newReleases: {
        title: "Lançamentos",
        text: `Os ${TOTAL_NEW_RELEASES} livros mais recentes da nossa estante.`,
    },
    offers: {
        title: "Ofertas especiais",
        text: `Boas histórias por até R$ ${OFFER_LIMIT}.`,
    },
};

export function listCategories(books) {
    const byKey = new Map();

    for (const book of books) {
        const key = normalize(book.categoria);

        if (!byKey.has(key)) {
            byKey.set(key, { key, name: book.categoria, total: 0 });
        }

        byKey.get(key).total += 1;
    }

    return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export function filterBooks({ books, categories = [], priceRange = "all", sortBy = "featured", collection = "", search = "" }) {
    let list = books;

    if (collection === "newReleases") {
        list = [...books].sort((a, b) => b.id - a.id).slice(0, TOTAL_NEW_RELEASES);
    } else if (collection === "offers") {
        list = books.filter((book) => book.preco <= OFFER_LIMIT);
    }

    const keys = categories.map(normalize);
    const chosenRange = priceRanges.find((r) => r.value === priceRange) ?? priceRanges[0];
    const words = normalize(search).split(/\s+/).filter(Boolean);

    list = list.filter((book) => {
        const categoryOk = keys.length === 0 || keys.includes(normalize(book.categoria));

        const text = normalize(`${book.titulo} ${book.autor} ${book.categoria}`);
        const searchOk = words.every((word) => text.includes(word));

        return categoryOk && searchOk && chosenRange.accepts(book.preco);
    });

    const sorted = [...list];

    if (sortBy === "newest") sorted.sort((a, b) => b.id - a.id);
    if (sortBy === "lowestPrice") sorted.sort((a, b) => a.preco - b.preco);
    if (sortBy === "highestPrice") sorted.sort((a, b) => b.preco - a.preco);
    if (sortBy === "title") sorted.sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));

    return sorted;
}