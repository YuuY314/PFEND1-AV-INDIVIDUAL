import { filterBooks, listCategories } from "@/utils/filterBooks.js";

const CAROUSEL_LIMIT = 10;
const TOTAL_CATEGORY_CAROUSELS = 2;
const MIN_BOOKS_PER_CATEGORY = 3;

// Fisher-Yates: embaralha uma cópia, sem alterar a lista original
function shuffle(list) {
    const copy = [...list];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

// Monta todas as listas dos carrosséis da home a partir dos livros que vieram da API
export function buildHomeSections(books) {
    const newReleases = filterBooks({ books, collection: "newReleases" });

    const offers = filterBooks({ books, collection: "offers", sortBy: "lowestPrice" })
        .slice(0, CAROUSEL_LIMIT);

    const suggestions = shuffle(books).slice(0, CAROUSEL_LIMIT);

    // Categorias com mais livros ganham um carrossel próprio
    const byCategory = listCategories(books)
        .filter((category) => category.total >= MIN_BOOKS_PER_CATEGORY)
        .sort((a, b) => b.total - a.total)
        .slice(0, TOTAL_CATEGORY_CAROUSELS)
        .map((category) => ({
            name: category.name,
            books: filterBooks({ books, categories: [category.name] }).slice(0, CAROUSEL_LIMIT),
        }));

    return { newReleases, offers, suggestions, byCategory };
}
