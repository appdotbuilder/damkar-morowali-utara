import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AppShell } from '@/components/app-shell';

interface NewsArticle {
    id: number;
    title: string;
    summary?: string;
    published_at: string;
    category: string;
    cover_image?: string;
    author?: string;
}

interface PaginatedArticles {
    data: NewsArticle[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    articles: PaginatedArticles;
    filters: {
        category?: string;
        search?: string;
    };
    [key: string]: unknown;
}

export default function NewsIndex({ articles, filters }: Props) {
    const [searchTerm, setSearchTerm] = React.useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/berita', { ...filters, search: searchTerm, page: 1 });
    };

    const filterByCategory = (category: string) => {
        router.get('/berita', { ...filters, category: category === filters.category ? '' : category, page: 1 });
    };

    const categories = [
        { key: 'berita', label: '📰 Berita', color: 'red' },
        { key: 'edukasi', label: '🎓 Edukasi', color: 'blue' },
        { key: 'siaran-pers', label: '📢 Siaran Pers', color: 'green' },
        { key: 'kegiatan', label: '🎯 Kegiatan', color: 'purple' },
    ];

    return (
        <AppShell>
            <Head title="Berita & Informasi - Damkar Morowali Utara" />
            
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">📰 Berita & Informasi</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Dapatkan informasi terbaru seputar kegiatan, edukasi, dan layanan 
                            Dinas Pemadam Kebakaran Morowali Utara
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Cari berita..."
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="bg-red-600 hover:bg-red-700 text-white px-6"
                                >
                                    🔍 Cari
                                </Button>
                            </div>
                        </form>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.key}
                                    onClick={() => filterByCategory(category.key)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        filters.category === category.key
                                            ? `bg-${category.color}-100 text-${category.color}-800 ring-2 ring-${category.color}-500`
                                            : `bg-gray-100 text-gray-700 hover:bg-${category.color}-50`
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                            {filters.category && (
                                <button
                                    onClick={() => filterByCategory('')}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 text-white hover:bg-gray-700"
                                >
                                    ✕ Clear Filter
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Articles Grid */}
                    {articles.data.length > 0 ? (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {articles.data.map((article) => (
                                    <div key={article.id} className="news-card">
                                        <div className="h-48 bg-gradient-to-br from-red-100 to-blue-100 flex items-center justify-center">
                                            <span className="text-6xl">
                                                {article.category === 'berita' ? '📰' :
                                                 article.category === 'edukasi' ? '🎓' :
                                                 article.category === 'siaran-pers' ? '📢' : '🎯'}
                                            </span>
                                        </div>
                                        
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                                    article.category === 'berita' ? 'bg-red-100 text-red-800' :
                                                    article.category === 'edukasi' ? 'bg-blue-100 text-blue-800' :
                                                    article.category === 'siaran-pers' ? 'bg-green-100 text-green-800' :
                                                    'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {article.category.replace('-', ' ').toUpperCase()}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(article.published_at).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                            
                                            <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                                                {article.title}
                                            </h3>
                                            
                                            {article.summary && (
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                    {article.summary}
                                                </p>
                                            )}
                                            
                                            <div className="flex items-center justify-between">
                                                {article.author && (
                                                    <span className="text-xs text-gray-500">
                                                        👤 {article.author}
                                                    </span>
                                                )}
                                                <Link
                                                    href={`/berita/${article.id}`}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                >
                                                    Baca Selengkapnya →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {articles.last_page > 1 && (
                                <div className="flex items-center justify-center space-x-2">
                                    {articles.current_page > 1 && (
                                        <Link
                                            href={`/berita?${new URLSearchParams({...filters, page: (articles.current_page - 1).toString()}).toString()}`}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            ← Sebelumnya
                                        </Link>
                                    )}
                                    
                                    <span className="px-4 py-2 bg-red-600 text-white rounded-lg">
                                        {articles.current_page} dari {articles.last_page}
                                    </span>
                                    
                                    {articles.current_page < articles.last_page && (
                                        <Link
                                            href={`/berita?${new URLSearchParams({...filters, page: (articles.current_page + 1).toString()}).toString()}`}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Selanjutnya →
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📄</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Tidak Ada Berita</h3>
                            <p className="text-gray-600">
                                {filters.search || filters.category 
                                    ? 'Tidak ditemukan berita yang sesuai dengan pencarian atau filter Anda.'
                                    : 'Belum ada berita yang dipublikasikan.'}
                            </p>
                            {(filters.search || filters.category) && (
                                <Link href="/berita" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
                                    Lihat Semua Berita →
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}