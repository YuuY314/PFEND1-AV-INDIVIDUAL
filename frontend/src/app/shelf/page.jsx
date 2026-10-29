"use client";

import styles from "./shelf.module.css";

import { useEffect, useState } from "react";

import BookCard from "@/components/BookCard";
import Pagination from "@/components/Pagination";
import {
    collections,
    priceRanges,
    filterBooks,
    listCategories,
    normalize,
    sortOptions,
} from "@/utils/filterBooks.js";

const BOOKS_PER_PAGE = 12;

export default function Shelf(){
    const [ bookList, setBookList ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState("");

    const [ categories, setCategories ] = useState([]);
    const [ priceRange, setPriceRange ] = useState("all");
    const [ sortBy, setSortBy ] = useState("featured");
    const [ search, setSearch ] = useState("");
    const [ collectionKey, setCollectionKey ] = useState("");
    const [ readFilters, setReadFilters ] = useState(false);
    const [ page, setPage ] = useState(1);

    const collection = collections[collectionKey];

    // Ao abrir a página, os parâmetros são lidos com o URLSearchParams do JavaScript.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        setCategories(params.getAll("category"));
        setSearch(params.get("search") ?? "");
        setCollectionKey(params.get("filter") ?? "");
        setReadFilters(true);
    }, []);

    useEffect(() => {
        fetch("http://localhost:3001/api/livro")
            .then(res => {
                if (!res.ok) throw new Error("Não foi possível carregar a estante.");
                return res.json();
            })
            .then(data => {
                setBookList(data.dados ?? []);
                setError("");
            })
            .catch(error => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

    // Mudou qualquer filtro: o resultado é outro, então volta para a primeira página
    useEffect(() => {
        setPage(1);
    }, [categories, priceRange, sortBy, search, collectionKey]);

    function changePage(newPage) {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function changeCategory(name) {
        const marked = categories.some((c) => normalize(c) === normalize(name));

        if (marked) {
            setCategories(categories.filter((c) => normalize(c) !== normalize(name)));
        } else {
            setCategories([...categories, name]);
        }
    }

    function clearFilters() {
        setCategories([]);
        setPriceRange("all");
        setSortBy("featured");
        setSearch("");
        setCollectionKey("");
    }

    const availableCategories = listCategories(bookList);
    const filteredBooks = filterBooks({ books: bookList, categories, priceRange, sortBy, collection: collectionKey, search });

    const totalPages = Math.max(1, Math.ceil(filteredBooks.length / BOOKS_PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const firstIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const pageBooks = filteredBooks.slice(firstIndex, firstIndex + BOOKS_PER_PAGE);

    const hasFilters = categories.length > 0 || priceRange !== "all" || sortBy !== "featured" || search !== "" || collection;

    // Evita mostrar a estante inteira por um instante antes de aplicar o filtro da URL
    if (!readFilters) {
        return (
            <main className="d-flex align-items-center justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </main>
        );
    }

    return (
        <main className={`d-flex flex-column flex-lg-row justify-content-center gap-5 p-4 p-lg-5 ${styles.shelf}`}>
            <section className={styles.shelf_sidebar}>
                <div>
                    <h6>CATEGORIAS</h6>
                    {availableCategories.map((category) => (
                        <div className="form-check" key={category.key}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`category-${category.key}`}
                                checked={categories.some((c) => normalize(c) === category.key)}
                                onChange={() => changeCategory(category.name)}
                            />
                            <label className="form-check-label" htmlFor={`category-${category.key}`}>
                                {category.name} <span className="text-secondary">({category.total})</span>
                            </label>
                        </div>
                    ))}
                </div>
                <hr/>
                <div>
                    <h6>FAIXA DE PREÇO</h6>
                    {priceRanges.map((range) => (
                        <div className="form-check" key={range.value}>
                            <input
                                type="radio"
                                className="form-check-input"
                                name="priceRange"
                                id={`price-range-${range.value}`}
                                checked={priceRange === range.value}
                                onChange={() => setPriceRange(range.value)}
                            />
                            <label className="form-check-label" htmlFor={`price-range-${range.value}`}>{range.label}</label>
                        </div>
                    ))}
                </div>
                {hasFilters && (
                    <button type="button" className={`btn w-100 mt-4 ${styles.clear_button}`} onClick={clearFilters}>
                        Limpar filtros
                    </button>
                )}
            </section>

            <section className={`d-flex flex-column gap-4 ${styles.shelf_main}`}>
                <section className={styles.shelf_navbar}>
                    <h2>{collection ? collection.title : "Nossa estante"}</h2>
                    <p>{collection ? collection.text : "Use os filtros para encontrar exatamente a história que você procura."}</p>

                    {(search !== "" || categories.length > 0 || collection) && (
                        <div className="d-flex flex-wrap gap-2 my-3">
                            {search !== "" && (
                                <span className="badge rounded-pill text-bg-light border d-flex align-items-center gap-2">
                                    Busca: {search}
                                    <button type="button" className="btn-close" aria-label="Remover busca"
                                        onClick={() => setSearch("")}/>
                                </span>
                            )}
                            {collection && (
                                <span className="badge rounded-pill text-bg-light border d-flex align-items-center gap-2">
                                    {collection.title}
                                    <button type="button" className="btn-close" aria-label={`Remover ${collection.title}`}
                                        onClick={() => setCollectionKey("")}/>
                                </span>
                            )}
                            {categories.map((c) => (
                                <span key={c} className="badge rounded-pill text-bg-light border d-flex align-items-center gap-2">
                                    {c}
                                    <button type="button" className="btn-close" aria-label={`Remover ${c}`}
                                        onClick={() => changeCategory(c)}/>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="d-flex align-items-center justify-content-between gap-3">
                        <p>
                            {filteredBooks.length} {filteredBooks.length === 1 ? "livro encontrado" : "livros encontrados"}
                            {filteredBooks.length > BOOKS_PER_PAGE && (
                                <span className="text-secondary"> · exibindo {firstIndex + 1}–{firstIndex + pageBooks.length}</span>
                            )}
                        </p>
                        <div className="form-field">
                            <label htmlFor="sortBy" className="visually-hidden">Ordenar por</label>
                            <select
                                className="form-select"
                                id="sortBy"
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value)}
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando livros...</span>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger" role="alert">{error}</div>
                ) : bookList.length === 0 ? (
                    <h2>Oh não! Nossa estante está vazia! Volte mais tarde...</h2>
                ) : filteredBooks.length > 0 ? (
                    <>
                        <section className="d-flex flex-wrap gap-4 justify-content-start">
                            {pageBooks.map((book) => (
                                <BookCard key={book.id} book={book}/>
                            ))}
                        </section>
                        <Pagination page={currentPage} totalPages={totalPages} onChange={changePage}/>
                    </>
                ) : (
                    <div className="alert alert-light d-flex align-items-center justify-content-between gap-3" role="alert">
                        Nenhum livro encontrado com esses filtros.
                        <button type="button" className={`btn ${styles.clear_button}`} onClick={clearFilters}>
                            Limpar filtros
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
