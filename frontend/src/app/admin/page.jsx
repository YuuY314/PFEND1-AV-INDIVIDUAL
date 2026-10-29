"use client";

import styles from "./admin.module.css";

import { useEffect, useMemo, useState } from "react";

import BookFormModal from "@/components/BookFormModal";
import ConfirmModal from "@/components/ConfirmModal";
import { formatCurrency } from "@/utils/formatCurrency.js";
import { filterBooks, listCategories, priceRanges, sortOptions } from "@/utils/filterBooks.js";

const API_URL = "http://localhost:3001/api/livro";
const PAGE_SIZE = 10;
const LOW_STOCK_LIMIT = 5;

const stockFilters = [
    { value: "all", label: "Todo o estoque" },
    { value: "inStock", label: "Em estoque" },
    { value: "low", label: `Estoque baixo (até ${LOW_STOCK_LIMIT})` },
    { value: "out", label: "Esgotados" },
];

const adminSortOptions = sortOptions.filter((option) => option.value !== "featured");

function getStockBadge(stock) {
    if (stock === 0) return { color: "danger", label: "Esgotado" };
    if (stock <= LOW_STOCK_LIMIT) return { color: "warning", label: `${stock} (baixo)` };
    return { color: "success", label: String(stock) };
}

export default function Admin(){
    const [ admin, setAdmin ] = useState(null);
    const [ authLoading, setAuthLoading ] = useState(true);

    const [ books, setBooks ] = useState([]);
    const [ booksLoading, setBooksLoading ] = useState(true);
    const [ booksError, setBooksError ] = useState("");
    const [ notice, setNotice ] = useState(null);

    const [ search, setSearch ] = useState("");
    const [ category, setCategory ] = useState("");
    const [ priceRange, setPriceRange ] = useState("all");
    const [ stockFilter, setStockFilter ] = useState("all");
    const [ sortBy, setSortBy ] = useState("newest");
    const [ page, setPage ] = useState(1);

    const [ formState, setFormState ] = useState(null);
    const [ saving, setSaving ] = useState(false);
    const [ formError, setFormError ] = useState("");

    const [ deleteTarget, setDeleteTarget ] = useState(null);
    const [ deleting, setDeleting ] = useState(false);
    const [ deleteError, setDeleteError ] = useState("");

    useEffect(() => {
        fetch("http://localhost:3001/api/autenticar/me", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (!data.autenticado) {
                    window.location.href = "/login";
                } else if (data.dados.tipo !== "administrador") {
                    window.location.href = "/";
                } else {
                    setAdmin(data.dados);
                }
            })
            .catch(() => { window.location.href = "/login"; })
            .finally(() => setAuthLoading(false));
    }, []);

    useEffect(() => {
        if (admin) loadBooks();
    }, [admin]);

    useEffect(() => {
        setPage(1);
    }, [search, category, priceRange, stockFilter, sortBy]);

    async function loadBooks() {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) throw new Error("Não foi possível carregar os livros.");

            const data = await response.json();

            setBooks(data.dados ?? []);
            setBooksError("");
        } catch (error) {
            setBooksError(error.message || "Erro ao conectar com o servidor.");
        } finally {
            setBooksLoading(false);
        }
    }

    function retryLoadBooks() {
        setBooksLoading(true);
        loadBooks();
    }

    function openCreateForm() {
        setFormError("");
        setFormState({ book: null });
    }

    function openEditForm(book) {
        setFormError("");
        setFormState({ book });
    }

    function closeForm() {
        if (!saving) setFormState(null);
    }

    function openDeleteConfirm(book) {
        setDeleteError("");
        setDeleteTarget(book);
    }

    function closeDeleteConfirm() {
        if (!deleting) setDeleteTarget(null);
    }

    async function handleSave(payload) {
        const editingBook = formState.book;

        setSaving(true);
        setFormError("");

        try {
            const response = await fetch(editingBook ? `${API_URL}/${editingBook.id}` : API_URL, {
                method: editingBook ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok || result.sucesso === false) {
                throw new Error(result.erro || "Não foi possível salvar o livro.");
            }

            setFormState(null);
            setNotice({ type: "success", text: editingBook ? "Livro atualizado com sucesso." : "Livro cadastrado com sucesso." });
            await loadBooks();
        } catch (error) {
            setFormError(error.message || "Erro ao conectar com o servidor.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        setDeleting(true);
        setDeleteError("");

        try {
            const response = await fetch(`${API_URL}/${deleteTarget.id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    response.status === 500
                        ? "Não foi possível excluir. O livro pode estar vinculado a pedidos."
                        : result.erro || "Não foi possível excluir o livro."
                );
            }

            setDeleteTarget(null);
            setNotice({ type: "success", text: `"${deleteTarget.titulo}" foi excluído.` });
            await loadBooks();
        } catch (error) {
            setDeleteError(error.message || "Erro ao conectar com o servidor.");
        } finally {
            setDeleting(false);
        }
    }

    function clearFilters() {
        setSearch("");
        setCategory("");
        setPriceRange("all");
        setStockFilter("all");
        setSortBy("newest");
    }

    const availableCategories = useMemo(() => listCategories(books), [books]);

    const filteredBooks = useMemo(() => {
        const list = filterBooks({ books, categories: category ? [category] : [], priceRange, sortBy, search });

        return list.filter((book) => {
            if (stockFilter === "inStock") return book.estoque > 0;
            if (stockFilter === "low") return book.estoque > 0 && book.estoque <= LOW_STOCK_LIMIT;
            if (stockFilter === "out") return book.estoque === 0;
            return true;
        });
    }, [books, category, priceRange, sortBy, search, stockFilter]);

    if (authLoading || !admin) {
        return (
            <main className="d-flex align-items-center justify-content-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </main>
        );
    }

    const totalUnits = books.reduce((sum, book) => sum + book.estoque, 0);
    const outOfStock = books.filter((book) => book.estoque === 0).length;
    const lowStock = books.filter((book) => book.estoque > 0 && book.estoque <= LOW_STOCK_LIMIT).length;

    const hasFilters = search !== "" || category !== "" || priceRange !== "all" || stockFilter !== "all" || sortBy !== "newest";

    const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const pageBooks = filteredBooks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <main className={styles.admin_page}>
            <div className="container py-5">
                <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
                    <div>
                        <p className="mb-1 fw-semibold">ÁREA DO ADMINISTRADOR</p>
                        <h1 className={styles.admin_title}>Gerenciar livros</h1>
                        <p className="mb-0">Olá, {admin.nome?.trim().split(" ")[0] || "administrador"}! Cadastre, edite e acompanhe o estoque da estante.</p>
                    </div>
                    <button type="button" className={`btn ${styles.brand_button}`} onClick={openCreateForm}>
                        + Novo livro
                    </button>
                </div>

                {notice && (
                    <div className={`alert alert-${notice.type} alert-dismissible`} role="alert">
                        {notice.text}
                        <button type="button" className="btn-close" aria-label="Fechar aviso" onClick={() => setNotice(null)}/>
                    </div>
                )}

                <section className="row g-3 mb-4">
                    <div className="col-6 col-lg-3">
                        <div className={styles.stat_card}><small>Títulos cadastrados</small><strong>{books.length}</strong></div>
                    </div>
                    <div className="col-6 col-lg-3">
                        <div className={styles.stat_card}><small>Unidades em estoque</small><strong>{totalUnits}</strong></div>
                    </div>
                    <div className="col-6 col-lg-3">
                        <div className={styles.stat_card}><small>Estoque baixo</small><strong>{lowStock}</strong></div>
                    </div>
                    <div className="col-6 col-lg-3">
                        <div className={styles.stat_card}><small>Esgotados</small><strong>{outOfStock}</strong></div>
                    </div>
                </section>

                <section className={`${styles.filters} mb-4`} aria-label="Filtros">
                    <div className="row g-2 align-items-end">
                        <div className="col-12 col-lg-4">
                            <label htmlFor="admin-search" className="form-label small mb-1">Buscar</label>
                            <input id="admin-search" type="search" className="form-control" placeholder="Título, autor ou categoria"
                                value={search} onChange={(event) => setSearch(event.target.value)}/>
                        </div>
                        <div className="col-6 col-lg-2">
                            <label htmlFor="admin-category" className="form-label small mb-1">Categoria</label>
                            <select id="admin-category" className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}>
                                <option value="">Todas</option>
                                {availableCategories.map((item) => (
                                    <option key={item.key} value={item.name}>{item.name} ({item.total})</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-6 col-lg-2">
                            <label htmlFor="admin-price-range" className="form-label small mb-1">Preço</label>
                            <select id="admin-price-range" className="form-select" value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>
                                {priceRanges.map((range) => (
                                    <option key={range.value} value={range.value}>{range.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-6 col-lg-2">
                            <label htmlFor="admin-stock" className="form-label small mb-1">Estoque</label>
                            <select id="admin-stock" className="form-select" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)}>
                                {stockFilters.map((filter) => (
                                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-6 col-lg-2">
                            <label htmlFor="admin-sort" className="form-label small mb-1">Ordenar por</label>
                            <select id="admin-sort" className="form-select" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                                {adminSortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {hasFilters && (
                        <button type="button" className="btn btn-link p-0 mt-2" onClick={clearFilters}>Limpar filtros</button>
                    )}
                </section>

                {booksLoading ? (
                    <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Carregando livros...</span>
                        </div>
                    </div>
                ) : booksError ? (
                    <div className="alert alert-danger d-flex align-items-center justify-content-between gap-3" role="alert">
                        {booksError}
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={retryLoadBooks}>Tentar novamente</button>
                    </div>
                ) : books.length === 0 ? (
                    <div className="alert alert-light text-center py-5" role="alert">
                        <p className="mb-3">Nenhum livro cadastrado ainda.</p>
                        <button type="button" className={`btn ${styles.brand_button}`} onClick={openCreateForm}>Cadastrar o primeiro livro</button>
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <div className="alert alert-light d-flex align-items-center justify-content-between gap-3" role="alert">
                        Nenhum livro encontrado com esses filtros.
                        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>Limpar filtros</button>
                    </div>
                ) : (
                    <>
                        <div className={styles.table_card}>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">Capa</th>
                                            <th scope="col">Título</th>
                                            <th scope="col">Autor</th>
                                            <th scope="col">Categoria</th>
                                            <th scope="col" className="text-end">Preço</th>
                                            <th scope="col" className="text-center">Estoque</th>
                                            <th scope="col" className="text-end">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pageBooks.map((book) => {
                                            const stockBadge = getStockBadge(book.estoque);

                                            return (
                                                <tr key={book.id}>
                                                    <td>{book.id}</td>
                                                    <td>
                                                        {book.imagem_url
                                                            ? <img src={book.imagem_url} alt="" className={styles.cover}/>
                                                            : <span className={`${styles.cover} ${styles.cover_empty}`} aria-hidden="true"/>}
                                                    </td>
                                                    <td className={styles.book_title}>{book.titulo}</td>
                                                    <td>{book.autor}</td>
                                                    <td>{book.categoria}</td>
                                                    <td className="text-end text-nowrap">{formatCurrency(book.preco)}</td>
                                                    <td className="text-center">
                                                        <span className={`badge text-bg-${stockBadge.color}`}>{stockBadge.label}</span>
                                                    </td>
                                                    <td className="text-end text-nowrap">
                                                        <button type="button" className="btn btn-outline-secondary btn-sm me-2"
                                                            aria-label={`Editar ${book.titulo}`} onClick={() => openEditForm(book)}>
                                                            Editar
                                                        </button>
                                                        <button type="button" className="btn btn-outline-danger btn-sm"
                                                            aria-label={`Excluir ${book.titulo}`} onClick={() => openDeleteConfirm(book)}>
                                                            Excluir
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
                            <small>
                                Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–{(currentPage - 1) * PAGE_SIZE + pageBooks.length} de {filteredBooks.length} {filteredBooks.length === 1 ? "livro" : "livros"}
                            </small>
                            {totalPages > 1 && (
                                <div className="d-flex align-items-center gap-2">
                                    <button type="button" className={`btn btn-sm ${styles.pagination_button}`} disabled={currentPage === 1}
                                        onClick={() => setPage(currentPage - 1)}>Anterior</button>
                                    <small>Página {currentPage} de {totalPages}</small>
                                    <button type="button" className={`btn btn-sm ${styles.pagination_button}`} disabled={currentPage === totalPages}
                                        onClick={() => setPage(currentPage + 1)}>Próxima</button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {formState && (
                <BookFormModal
                    book={formState.book}
                    categories={availableCategories}
                    saving={saving}
                    error={formError}
                    onSubmit={handleSave}
                    onClose={closeForm}
                />
            )}

            {deleteTarget && (
                <ConfirmModal
                    title="Excluir livro"
                    message={`Tem certeza que deseja excluir "${deleteTarget.titulo}"? Esta ação não pode ser desfeita.`}
                    confirmLabel="Excluir"
                    loading={deleting}
                    error={deleteError}
                    onConfirm={handleDelete}
                    onCancel={closeDeleteConfirm}
                />
            )}
        </main>
    );
}
