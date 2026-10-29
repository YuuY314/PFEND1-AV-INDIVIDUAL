import styles from "./pagination.module.css";

// Monta a lista de itens: sempre mostra a primeira, a última e a página atual com um vizinho de cada lado.
// Ex.: 1 ... 4 [5] 6 ... 12
function getPageItems(page, totalPages) {
    const pages = new Set([1, totalPages, page - 1, page, page + 1]);

    const sorted = [...pages]
        .filter((p) => p >= 1 && p <= totalPages)
        .sort((a, b) => a - b);

    const items = [];

    sorted.forEach((p, index) => {
        if (index > 0 && p - sorted[index - 1] > 1) {
            items.push({ type: "gap", key: `gap-${p}` });
        }

        items.push({ type: "page", key: `page-${p}`, number: p });
    });

    return items;
}

export default function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) {
        return null;
    }

    const items = getPageItems(page, totalPages);

    return (
        <nav aria-label="Paginação da estante">
            <ul className={`pagination justify-content-center flex-wrap mb-0 ${styles.pagination_brand}`}>
                <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                    <button
                        type="button"
                        className="page-link"
                        onClick={() => onChange(page - 1)}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                </li>

                {items.map((item) => (
                    item.type === "gap" ? (
                        <li key={item.key} className="page-item disabled" aria-hidden="true">
                            <span className="page-link">…</span>
                        </li>
                    ) : (
                        <li key={item.key} className={`page-item ${item.number === page ? "active" : ""}`}>
                            <button
                                type="button"
                                className="page-link"
                                aria-label={`Página ${item.number}`}
                                aria-current={item.number === page ? "page" : undefined}
                                onClick={() => onChange(item.number)}
                            >
                                {item.number}
                            </button>
                        </li>
                    )
                ))}

                <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                    <button
                        type="button"
                        className="page-link"
                        onClick={() => onChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        Próxima
                    </button>
                </li>
            </ul>
        </nav>
    );
}
