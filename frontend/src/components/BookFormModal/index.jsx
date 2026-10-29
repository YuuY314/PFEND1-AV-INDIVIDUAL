"use client";

import styles from "./bookFormModal.module.css";

import { useState } from "react";

import Modal from "@/components/Modal";

const emptyForm = {
    title: "",
    author: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
};

function bookToForm(book) {
    if (!book) return emptyForm;

    return {
        title: book.titulo ?? "",
        author: book.autor ?? "",
        category: book.categoria ?? "",
        price: String(book.preco ?? ""),
        stock: String(book.estoque ?? ""),
        description: book.descricao ?? "",
        imageUrl: book.imagem_url ?? "",
    };
}

function formToPayload(form) {
    return {
        titulo: form.title.trim(),
        autor: form.author.trim(),
        categoria: form.category.trim(),
        preco: Number(form.price),
        estoque: Number(form.stock),
        descricao: form.description.trim(),
        imagem_url: form.imageUrl.trim(),
    };
}

export default function BookFormModal({ book = null, categories = [], saving = false, error = "", onSubmit, onClose }){
    const [ form, setForm ] = useState(() => bookToForm(book));
    const [ localError, setLocalError ] = useState("");

    const isEditing = book !== null;

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((current) => ({ ...current, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        setLocalError("");

        if (!Number.isInteger(Number(form.stock))) {
            setLocalError("O estoque deve ser um número inteiro.");
            return;
        }

        onSubmit(formToPayload(form));
    }

    const shownError = localError || error;

    return (
        <Modal title={isEditing ? "Editar livro" : "Novo livro"} size="modal-lg" onClose={onClose}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className="modal-body">
                    <div className="row g-3">
                        <div className="col-md-8">
                            <label htmlFor="book-title" className="form-label">Título</label>
                            <input id="book-title" name="title" type="text" className="form-control" maxLength={150} required autoFocus
                                value={form.title} onChange={handleChange}/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="book-author" className="form-label">Autor</label>
                            <input id="book-author" name="author" type="text" className="form-control" maxLength={100} required
                                value={form.author} onChange={handleChange}/>
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="book-category" className="form-label">Categoria</label>
                            <input id="book-category" name="category" type="text" className="form-control" maxLength={50} required
                                list="book-category-options" value={form.category} onChange={handleChange}/>
                            <datalist id="book-category-options">
                                {categories.map((category) => (
                                    <option key={category.key} value={category.name}/>
                                ))}
                            </datalist>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="book-price" className="form-label">Preço (R$)</label>
                            <input id="book-price" name="price" type="number" className="form-control" min="0" max="99999999.99" step="0.01" required
                                value={form.price} onChange={handleChange}/>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="book-stock" className="form-label">Estoque</label>
                            <input id="book-stock" name="stock" type="number" className="form-control" min="0" step="1" required
                                value={form.stock} onChange={handleChange}/>
                        </div>

                        <div className="col-12">
                            <label htmlFor="book-image-url" className="form-label">URL da imagem</label>
                            <div className="d-flex align-items-start gap-3">
                                <input id="book-image-url" name="imageUrl" type="text" className="form-control" maxLength={255}
                                    placeholder="https://..." value={form.imageUrl} onChange={handleChange}/>
                                {form.imageUrl.trim() !== "" && (
                                    <img key={form.imageUrl} src={form.imageUrl.trim()} alt="Pré-visualização da capa" className={styles.preview}
                                        onError={(event) => { event.currentTarget.style.display = "none"; }}/>
                                )}
                            </div>
                        </div>

                        <div className="col-12">
                            <label htmlFor="book-description" className="form-label">Descrição</label>
                            <textarea id="book-description" name="description" className="form-control" rows={4}
                                value={form.description} onChange={handleChange}/>
                        </div>
                    </div>

                    {shownError && <div className="alert alert-danger mt-3 mb-0" role="alert">{shownError}</div>}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={saving}>
                        Cancelar
                    </button>
                    <button type="submit" className={`btn ${styles.brand_button}`} disabled={saving}>
                        {saving && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"/>}
                        {isEditing ? "Salvar alterações" : "Cadastrar livro"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
